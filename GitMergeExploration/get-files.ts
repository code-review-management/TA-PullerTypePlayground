import axios from 'axios';

// --- Interfaces ---

export interface ConflictFileContent {
    fileName: string;
    ancestorContent: string | null; // null if file didn't exist then
    targetContent: string | null;   // null if deleted in target
    featureContent: string | null;  // null if deleted in feature
}

/**
 * Helper: Fetches a single file's content from a specific commit/ref.
 * Returns null if the file is not found (404).
 */
async function fetchRawContent(path: string, ref: string, 
    owner: string, repo: string, headers: {
        Authorization: string,
        Accept: string
    }): Promise<string | null> {
    try {
        const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${ref}`;
        const response = await axios.get(url, { headers });
        
        // GitHub API returns content as Base64
        if (response.data.content && response.data.encoding === 'base64') {
            return Buffer.from(response.data.content, 'base64').toString('utf-8');
        }
        return null; 
    } catch (error: any) {
        // If file not found (404), it means it was deleted or didn't exist yet.
        if (error.response?.status === 404) {
            return null;
        }
        console.error(`Error fetching ${path} at ${ref}:`, error.message);
        throw error;
    }
}

/**
 * Main Function: Retrieves the 3-way content for a list of conflicting files.
 */
export async function retrieveConflictContents(
    fileList: string[], 
    ancestorSha: string, 
    targetSha: string, 
    featureSha: string,
    owner: string,
    repo: string,
    headers: {
        Authorization: string,
        Accept: string
    }
): Promise<ConflictFileContent[]> {
    
    //console.log(`\n📥 Downloading content for ${fileList.length} files...`);

    // Map over every file and fetch its 3 versions in parallel
    const promises = fileList.map(async (fileName) => {
        
        // Fetch all 3 versions concurrently for speed
        const [ancestor, target, feature] = await Promise.all([
            fetchRawContent(fileName, ancestorSha, owner, repo, headers),
            fetchRawContent(fileName, targetSha, owner, repo, headers),
            fetchRawContent(fileName, featureSha, owner, repo, headers)
        ]);

        return {
            fileName,
            ancestorContent: ancestor,
            targetContent: target,
            featureContent: feature
        };
    });

    return Promise.all(promises);
}