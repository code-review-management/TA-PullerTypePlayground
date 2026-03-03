import { Octokit } from "octokit";
import { MergeCommitContent, MergeCommitInputData } from "../merge-conflict-finder/merge-github.types";


//Notes about different kinds of modes:
//Modes are lost when they come through our system, so we need to fetch all of them
interface TreeItem {
    path: string;
    mode: '100644' | '100755' | '040000' | '160000' | '120000';
    type: 'blob' | 'tree' | 'commit';
    sha?: string | null;
    content?: string;
}

export const commitMergeChanges = async (
    mergeCommitInput: MergeCommitInputData, 
    mergeCommitContent: MergeCommitContent[], 
    octokit: Octokit
) : Promise<boolean> => {
    const { owner, repo, targetMergeSha, targetBranch, featureBranch } = mergeCommitInput;
    
    try {
        const featureRef = await octokit.rest.git.getRef({
            owner,
            repo,
            ref: `heads/${featureBranch}`,
        });
        const featureSha = featureRef.data.object.sha;

        const compareResponse = await octokit.rest.repos.compareCommits({
            owner,
            repo,
            base: targetMergeSha, 
            head: featureSha,
        });

        const featureFiles = compareResponse.data.files || [];
        const treeItems: TreeItem[] = [];
        const resolvedFilesMap: Map<string, string> = new Map(mergeCommitContent.map(m => [m.filename, m.content]));
        
        // Cache to store directory trees. Key: dirPath, Value: GitHub tree array
        const folderTreeCache = new Map<string, Map<string, any[]>>();

        // Helper function to fetch only the specific folder's tree and cache it
        const getOriginalFileItem = async (filePath: string, commitSha: string) => {
            const lastSlashIndex = filePath.lastIndexOf('/');
            const dirPath = lastSlashIndex === -1 ? '' : filePath.substring(0, lastSlashIndex);
            const fileName = lastSlashIndex === -1 ? filePath : filePath.substring(lastSlashIndex + 1);

            // If we haven't fetched this folder yet, fetch and cache it
            if (!folderTreeCache.get(commitSha)?.has(dirPath)) {
                try {
                    // If root directory, use targetMergeSha. Otherwise, use targetMergeSha:path/to/folder
                    const treeSha = dirPath === '' ? commitSha : `${commitSha}:${dirPath}`;
                    
                    const { data } = await octokit.rest.git.getTree({
                        owner,
                        repo,
                        tree_sha: treeSha,
                    });
                    
                    let innerMap = folderTreeCache.get(commitSha);

                    if (!innerMap) {
                        innerMap = new Map();
                        folderTreeCache.set(commitSha, innerMap);
                    }

                    innerMap.set(dirPath, data.tree);
                    
                } catch (error: any) {
                        throw error;
                }
            }

            // Retrieve the tree from cache and find the specific file
            const tree = folderTreeCache.get(commitSha)?.get(dirPath) || [];
            return tree.find((item: any) => item.path === fileName);
        };

        for (const file of featureFiles) {
            if (resolvedFilesMap.has(file.filename)) {
                // Merged files use our content
                if (resolvedFilesMap.get(file.filename) === '') {
                    if (file.status === 'added') {
                        console.log(`Skipping deletion for ${file.filename}: not in base tree.`);
                    } else {
                        // Fetch the targeted folder tree instead of the massive recursive tree
                        const originalItem = await getOriginalFileItem(file.filename, targetMergeSha);

                        if (originalItem) {
                            treeItems.push({
                                path: file.filename,
                                mode: originalItem.mode as any, // Use the REAL mode
                                type: originalItem.type as any, // Use the REAL type
                                sha: null, // Now GitHub will actually delete it
                            });
                        }
                    }
                } else {
                    const originalItem = await getOriginalFileItem(file.filename, featureSha);

                    treeItems.push({
                        path: file.filename,
                        mode: originalItem.mode as any, // Use the REAL mode
                        type: originalItem.type as any, // Use the REAL type
                        content: resolvedFilesMap.get(file.filename),
                    });
                }

                resolvedFilesMap.delete(file.filename); 
            } else {
                // Use the feature sha otherwise (if removed we set it to null)
                const originalItem = file.status === 'removed' ? await getOriginalFileItem(file.filename, targetMergeSha) : await getOriginalFileItem(file.filename, featureSha);
                treeItems.push({
                    path: file.filename,
                    mode: originalItem.mode as any, // Use the REAL mode
                    type: originalItem.type as any, // Use the REAL type
                    sha: file.status === 'removed' ? null : file.sha,
                });
            }
        }

        // This is in case new files were added during resolution (Leftovers)
        for (const [filename, content] of resolvedFilesMap.entries()) {
            if (content === '') {
                // If deleting a leftover item, we must also grab its real mode/type
                const originalItem = await getOriginalFileItem(filename, featureSha);
                
                if (originalItem) {
                    treeItems.push({
                        path: filename,
                        mode: originalItem.mode as any,
                        type: originalItem.type as any,
                        sha: null,
                    });
                }
            } else {
                treeItems.push({
                    path: filename,
                    mode: '100644',
                    type: 'blob',
                    content: content,
                });
            }
        }

        const newTree = await octokit.rest.git.createTree({
            owner,
            repo,
            base_tree: targetMergeSha,
            tree: treeItems,
        });

        // Make commit
        const newCommit = await octokit.rest.git.createCommit({
            owner,
            repo,
            message: `Merge ${targetBranch} into ${featureBranch}`,
            tree: newTree.data.sha,
            parents: [featureSha, targetMergeSha],
        });

        // Update feature ref to make it the new head
        await octokit.rest.git.updateRef({
            owner,
            repo,
            ref: `heads/${featureBranch}`,
            sha: newCommit.data.sha,
            force: false,
        });

        return true;
    } catch (error) {
        console.log("Error when committing merge: " + error);
        throw error;
    }
};