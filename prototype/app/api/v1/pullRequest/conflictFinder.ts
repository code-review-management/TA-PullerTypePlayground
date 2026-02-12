import { execSync } from 'child_process';

export const getConflictMarkers = async (pr: any) => {
    // 'dirty' means there are merge conflicts
    if (pr.mergeable_state !== 'dirty') {
    console.log("No conflicts detected by GitHub.");
    return [];
    }

    const pull_number = pr.id
    const baseRepoUrl = pr.base.repo.clone_url; 
    const headRepoUrl = pr.head.repo.clone_url;

    const baseBranch = pr.base.ref; // e.g. "RTOS_Task_low_pwr"
    const headBranch = pr.head.ref; // e.g. "RTOS_Training_Base"

    try {
    console.log(`Fetching Base from: ${baseRepoUrl} (Branch: ${baseBranch})`);

    // 2. Fetch the BASE explicitly from its URL
    // We fetch it into a local reference so we don't mess up your current branches
    execSync(`git fetch "${baseRepoUrl}" ${baseBranch}:refs/remotes/target/${baseBranch}`);

    console.log(`Fetching Head from: ${headRepoUrl} (Branch: ${headBranch})`);
    // 3. Fetch the HEAD explicitly from its URL
    execSync(`git fetch "${headRepoUrl}" ${headBranch}:refs/remotes/source/${headBranch}`);

    // 4. Create the temporary merge sandbox
    const tempMergeBranch = `conflict-check-${pull_number}`;
    
    console.log("Checking out temp branch: ${tempMergeBranch} refs/remotes/target/${baseBranch}")
    // Checkout the BASE we just fetched
    execSync(`git checkout -B ${tempMergeBranch} refs/remotes/target/${baseBranch}`);

    // 5. Attempt the merge using the HEAD we just fetched
    try {
        console.log(`Attempting merge...`);
        execSync(`git merge refs/remotes/source/${headBranch} --no-commit --no-ff`);
    } catch (e) {
        console.log("Merge conflict detected (this is what we want).");
    }

    // 6. Get conflicting files
    const conflictedFiles = execSync('git diff --name-only --diff-filter=U')
        .toString()
        .trim()
        .split('\n');

    console.log(conflictedFiles)
    return conflictedFiles;

    } catch (error) {
    console.error("Git operation failed:", error);
    throw error;
    }
}
