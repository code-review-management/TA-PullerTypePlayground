import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as os from 'os';

interface ConflictedFile {
  filename: string;
  content: string;
}

export const getConflictMarkers  = async (pr: any, token: any) => {
  const baseBranch = pr.base.ref;
  const headBranch = pr.head.ref;
  const baseRepoUrl = pr.base.repo.clone_url; 
  const headRepoUrl = pr.head.repo.clone_url;
  
  // Authenticated URLs are required for private repos
  // Format: https://x-access-token:YOUR_TOKEN@github.com/owner/repo.git
//   const addToken = (url: string) => url.replace('https://', `https://x-access-token:${token}@`);
//   const baseRepoUrl = addToken(pr.base.repo.clone_url);
//   const headRepoUrl = addToken(pr.head.repo.clone_url);

  // 2. Create a unique temporary directory
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), `pr-${pr.id}-`));
  console.log(`Created temp work environment: ${tempDir}`);

  try {
    // Helper to run commands INSIDE the temp dir
    const run = (command: string) => execSync(command, { cwd: tempDir, stdio: 'pipe' });

    // 3. Initialize an empty git repo (Fastest method)
    run('git init');
    
    // 4. Fetch ONLY the specific tips of the branches we need (Shallow fetch)
    // We fetch the base branch into a local branch named 'base'
    // We fetch the head branch into a local branch named 'head'
    console.log("Fetching base")
    run(`git fetch "${baseRepoUrl}" ${baseBranch}:refs/remotes/target/${baseBranch}`);
    console.log("Fetching head")
    run(`git fetch "${headRepoUrl}" ${headBranch}:refs/remotes/source/${headBranch}`);
    // 5. Checkout the base branch
    const tempMergeBranch = `conflict-check-${pr.id}`;
    run(`git checkout -B ${tempMergeBranch} refs/remotes/target/${baseBranch}`);

    // 6. Attempt the merge
    try {
      // This will fail if there are conflicts, which is what we want to catch
      run(`git merge refs/remotes/source/${headBranch} --no-commit --no-ff`);
      console.log("Merge successful (no conflicts).");
      return []; 
    } catch (e) {
      console.log("Conflict detected!");
    }

    // 7. extract the list of conflicting files
    const output = run('git diff --name-only --diff-filter=U').toString().trim();
    console.log("Output: " + output)
    const conflictingFiles = output ? output.split('\n') : [];
    console.log("Conflicting files: " + conflictingFiles)
    const results: ConflictedFile[] = [];

    for (const filePath of conflictingFiles) {
      // Read the file from the temp director
      const absolutePath = path.join(tempDir, filePath);
      console.log("Adding: " + absolutePath)
      const content = await fs.readFile(absolutePath, 'utf8');
      
      results.push({
        filename: filePath,
        content: content 
      });
    }

    console.log(results)
    return results;
  } catch (error) {
    console.error("Error during conflict check:", error);
    throw error;
  } finally {
    // 8. CLEANUP: Always delete the temp folder
    await fs.rm(tempDir, { recursive: true, force: true });
    console.log(`Cleaned up ${tempDir}`);
  }
}
