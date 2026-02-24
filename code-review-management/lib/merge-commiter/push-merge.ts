import { Octokit } from "octokit";

export interface MergeCommitInputData {
    owner: string,
    repo: string,
    targetMergeSha: string,
    targetBranch: string,
    featureBranch: string,
}

export interface MergeCommitContent {
    filename: string,
    content: string
}

interface TreeItem {
    path: string;
    mode: '100644' | '100755' | '040000' | '160000' | '120000';
    type: 'blob' | 'tree' | 'commit';
    sha?: string | null;
    content?: string;
}


export const commitChanges = async (
    mergeCommitInput: MergeCommitInputData, 
    mergeCommitContent: MergeCommitContent[], 
    octokit: Octokit
) => {
    const { owner, repo, targetMergeSha, targetBranch, featureBranch } = mergeCommitInput;

    if (!(await isShaAtBranchHead(octokit, owner, repo, targetBranch, targetMergeSha))) {
        console.log("Target branch has moved. Add logic to handle out-of-date merge here");
        return;
    }

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

    for (const file of featureFiles) {
        if (resolvedFilesMap.has(file.filename)) {
            //Merged files use our content
            treeItems.push({
                path: file.filename,
                mode: '100644',
                type: 'blob',
                content: resolvedFilesMap.get(file.filename),
            });

            resolvedFilesMap.delete(file.filename); 
        } else {
            //Use the feature sha otherwise (if removed we set it to null)
            treeItems.push({
                path: file.filename,
                mode: '100644',
                type: 'blob',
                sha: file.status === 'removed' ? null : file.sha,
            });
        }
    }

    //This is incase new files were added during resolution
    for (const [filename, content] of resolvedFilesMap.entries()) {
        treeItems.push({
            path: filename,
            mode: '100644',
            type: 'blob',
            content: content,
        });
    }

    const newTree = await octokit.rest.git.createTree({
        owner,
        repo,
        base_tree: targetMergeSha,
        tree: treeItems,
    });

    //Make commit
    const newCommit = await octokit.rest.git.createCommit({
        owner,
        repo,
        message: `Merge ${targetBranch} into ${featureBranch}`,
        tree: newTree.data.sha,
        parents: [featureSha, targetMergeSha],
    });

    //Update feature ref to make it the new head
    await octokit.rest.git.updateRef({
        owner,
        repo,
        ref: `heads/${featureBranch}`,
        sha: newCommit.data.sha,
        force: false,
    });
};

async function isShaAtBranchHead(
    octokit: Octokit,
    owner: string,
    repo: string,
    branch: string,
    givenSha: string
): Promise<boolean> {
    const { data } = await octokit.rest.repos.getBranch({
        owner,
        repo,
        branch,
    });

    const currentHeadSha = data.commit.sha;
    return currentHeadSha === givenSha;
}