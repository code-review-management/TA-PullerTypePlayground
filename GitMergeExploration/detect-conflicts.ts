import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import axios from 'axios';

// Types for clearer code
interface FileChange {
    filename: string;
    status: 'added' | 'removed' | 'modified' | 'renamed' | 'copied' | 'changed' | 'unchanged';
}

interface CompareResponse {
    merge_base_commit: { sha: string };
    files: FileChange[];
}

interface ConflictingFilesResponse{
    merge_base_commit: string,
    files: string[]
}

export const findConflictingFiles = async (
    owner: string,
    repo: string,
    targetBranch: string,
    featureBranch: string,
    headers: {
        Authorization: string,
        Accept: string
    }
): Promise<ConflictingFilesResponse | null>  => {
    // 1. Create a unique temporary directory
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'gh-conflict-'));
    //console.log(`📂 Working in temp directory: ${tempDir}`);

    try {
        const baseUrl = `https://api.github.com/repos/${owner}/${repo}`;
        const baseHead = `${encodeURIComponent(targetBranch)}...${encodeURIComponent(featureBranch)}`;

        // ---------------------------------------------------------
        // Step A & B: Compare Feature to Target to find Ancestor & Feature Changes
        // ---------------------------------------------------------
        // We use the "..." syntax (TARGET...FEATURE). 
        // GitHub automatically calculates the merge base (common ancestor) for us here.
        //console.log(`1️⃣  Comparing ${targetBranch}...${featureBranch} to find ancestor...`);
        
        const featureResponse = await axios.get<CompareResponse>(
            `${baseUrl}/compare/${baseHead}`,
            { headers }
        );

        const ancestorSha = featureResponse.data.merge_base_commit.sha;
        const featureFiles = featureResponse.data.files.map(f => f.filename);

        console.log(`   ↳ Common Ancestor SHA: ${ancestorSha}`);
        // console.log(`   ↳ Feature branch modified ${featureFiles.length} files.`);

        // ---------------------------------------------------------
        // Step C: Compare Ancestor to Target Head
        // ---------------------------------------------------------
        // Now we see what happened on the Target branch since that same ancestor.
        // We compare AncestorSHA...TargetBranch
        // console.log(`2️⃣  Checking changes on ${targetBranch} since ancestor...`);

        const targetResponse = await axios.get<CompareResponse>(
            `${baseUrl}/compare/${ancestorSha}...${targetBranch}`,
            { headers }
        );
        
        const targetFiles = targetResponse.data.files.map(f => f.filename);
        //console.log(`   ↳ Target branch modified ${targetFiles.length} files.`);

        // ---------------------------------------------------------
        // Step D: Find the Intersection (The Conflicts)
        // ---------------------------------------------------------
        // We want files that appear in BOTH lists.
        const overlappingFiles = featureFiles.filter(file => targetFiles.includes(file));

        //console.log(`3️⃣  Calculating overlaps...`);
        
        const report = {
            ancestor_sha: ancestorSha,
            feature_branch_changes: featureFiles,
            target_branch_changes: targetFiles,
            overlapping_files: overlappingFiles // <--- This is your answer
        };

        // Write the report to the temp directory
        const reportPath = path.join(tempDir, 'conflict_report.json');
        await fs.writeJson(reportPath, report, { spaces: 2 });
        return  {
            merge_base_commit: report.ancestor_sha,
            files: overlappingFiles
        }

    } catch (error: any) {
        console.error("Error executing API calls:", error.response?.data || error.message);
        return null;
    } finally {
        // Optional: Cleanup the temp dir if you don't need to inspect it
        // await fs.remove(tempDir); 
    }
}