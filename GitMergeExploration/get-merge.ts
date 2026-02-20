import { findConflictingFiles } from "./detect-conflicts.ts"
import { retrieveConflictContents } from "./get-files.ts"
import type { ConflictFileContent } from "./get-files.ts"
import { attemptFileMerge } from "./merge-contents.ts"

// --- Configuration ---
const GITHUB_TOKEN = 'Bearer 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';
const OWNER = 'nithinsenthil';
const REPO = 'IntestiSat';
const TARGET_BRANCH = 'RTOS_Task_low_pwr';    // The branch you want to merge INTO
const FEATURE_BRANCH = 'RTOS_Training_Base'; // The branch containing your changes

// Headers for GitHub API
const headers = {
    Authorization: `${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
};

interface MergeOutput{
    filename: string,
    contents: string
}

const data = await findConflictingFiles(OWNER, REPO, TARGET_BRANCH, FEATURE_BRANCH, headers)
if (data == null){
    console.log("Error in find conflicting files!")
} else {
    const ancestor: string = data.merge_base_commit
    const conflictingFiles: string[] = data.files

    const results = await retrieveConflictContents(conflictingFiles, ancestor, TARGET_BRANCH, FEATURE_BRANCH, OWNER, REPO, headers);
        
    const finalMergeOutputs: (MergeOutput | null)[] = results.map(f => MakeMerge(f))
    const validMerges = finalMergeOutputs.filter((job): job is MergeOutput => job !== null);

    // validMerges.forEach(m => {
    //     console.log(`Saved: ${m.filename}`);
    // });

    // validMerges.forEach(mergeOutput => {
    //     console.log(`=====${mergeOutput.filename}=====`)
    //     console.log(mergeOutput.contents)
    //     console.log("\n\n")
    // });
}

function MakeMerge(fileContent: ConflictFileContent): MergeOutput | null {
    let ancestor: string = ""
    let target: string = ""
    let feature: string = ""
    if (fileContent.ancestorContent != null) ancestor = fileContent.ancestorContent
    if (fileContent.targetContent != null) target = fileContent.targetContent
    if (fileContent.featureContent != null) feature = fileContent.featureContent

    const mergeContent: string | null = attemptFileMerge(ancestor, target, feature)

    if (fileContent.fileName == "Src/main.c"){
        // console.log("ancestor: " + ancestor)
        // console.log("target: " + target)
        // console.log("feature: " + feature)
        console.log(mergeContent)
    }

    if (mergeContent == null){
        return null
    }
    return {
        filename: fileContent.fileName,
        contents: mergeContent
    }
}


