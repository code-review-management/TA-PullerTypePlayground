import { findConflictingFiles, ConflictingFilesResponse } from "./detect-modified"
import { retrieveConflictContents, ConflictFileContent } from "./get-files"
import { FileMergeOutput, attemptFileMerge } from "./get-merge-diff"

export interface MergeOutput{
    filename: string,
    hasConflict: boolean,
    contents: string
}

export interface ConflictInput{
    githubToken: string,
    owner: string,
    repo: string,
    targetBranch: string,
    featureBranch: string,
}

export const getMergeConflict = async (conflictInput: ConflictInput) : Promise<MergeOutput[]> => {
    if (!conflictInput.githubToken.startsWith("Bearer ")){
        conflictInput.githubToken = "Bearer " + conflictInput.githubToken;
    }

    const headers = {
        Authorization: `${conflictInput.githubToken}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
    };

    const mergeCandidates: ConflictingFilesResponse = await findConflictingFiles(conflictInput.owner,
        conflictInput.repo, 
        conflictInput.targetBranch,
        conflictInput.featureBranch, 
        headers);

    const mergeCandidatesContent: ConflictFileContent[] = await retrieveConflictContents(mergeCandidates.files, 
        mergeCandidates.merge_base_commit, 
        conflictInput.targetBranch, 
        conflictInput.featureBranch, 
        conflictInput.owner, 
        conflictInput.repo, 
        headers);
        
    const mergedFiles: (MergeOutput)[] = mergeCandidatesContent.map(file => MakeMerge(file))
    return mergedFiles;
}

function MakeMerge(fileContent: ConflictFileContent): MergeOutput {
    let ancestor: string = ""
    let target: string = ""
    let feature: string = ""
    if (fileContent.ancestorContent != null) ancestor = fileContent.ancestorContent
    if (fileContent.targetContent != null) target = fileContent.targetContent
    if (fileContent.featureContent != null) feature = fileContent.featureContent

    const mergedContent: FileMergeOutput = attemptFileMerge(ancestor, target, feature)

    return {
        filename: fileContent.fileName,
        hasConflict: mergedContent.hasConflict,
        contents: mergedContent.content
    }
}

