import { Octokit } from "octokit"
import { findConflictingFiles } from "./detect-modified"
import { retrieveConflictContents, ConflictFileContent } from "./get-files"
import { FileMergeOutput, attemptFileMerge } from "./get-merge-diff"
import { validateUserAllowance, AllowanceError } from "./validate-token-allowance"

export interface MergeOutput{
    targetShaAtMerge: string,
    mergedFiles: MergeFileOutput[]
}

interface MergeFileOutput {
    filename: string,
    hasConflict: boolean,
    contents: string
}

export interface ConflictInput{
    owner: string,
    repo: string,
    targetBranch: string,
    featureBranch: string,
}

export const getMergeConflict = async (conflictInput: ConflictInput, octokit: Octokit) : Promise<MergeOutput> => {
    try{
        const hasEnoughTokens: boolean = await validateUserAllowance(conflictInput.owner,
            conflictInput.repo, 
            conflictInput.targetBranch,
            conflictInput.featureBranch, 
            octokit);

        if (!hasEnoughTokens){
            throw new AllowanceError("User doesn't have enough tokens")
        }

        const conflictingFilesResponse = await findConflictingFiles(conflictInput.owner,
            conflictInput.repo, 
            conflictInput.targetBranch,
            conflictInput.featureBranch, 
            octokit);

        const mergeCandidatesContent: ConflictFileContent[] = await retrieveConflictContents(conflictingFilesResponse.files, 
            conflictingFilesResponse.mergeBaseCommit, 
            conflictInput.targetBranch, 
            conflictInput.featureBranch, 
            conflictInput.owner, 
            conflictInput.repo, 
            octokit);
            
        const mergedFiles: (MergeFileOutput)[] = mergeCandidatesContent.map(file => MakeMerge(file))
        return {
            targetShaAtMerge: conflictingFilesResponse.targetShaAtMerge,
            mergedFiles: mergedFiles
        }
    } catch (error){
        console.log("Error in get merge conflict: " + error)
        throw (error)
    }
}

function MakeMerge(fileContent: ConflictFileContent): MergeFileOutput {
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

