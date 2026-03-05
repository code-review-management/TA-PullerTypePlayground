import { GitHubContent, GitHubContentSchema } from './merge-github.types';
import { Octokit } from 'octokit';

export interface ConflictFileContent {
    fileName: string;
    ancestorContent: string | null; // null if file didn't exist then
    targetContent: string | null;   // null if deleted in target
    featureContent: string | null;  // null if deleted in feature
}

/**
 * Main Function: Retrieves the 3-way content for a list of conflicting files.
 * Returns: 3 versions of the file
 */
export async function retrieveConflictContents(
    fileList: string[], 
    ancestorSha: string, 
    targetSha: string, 
    featureSha: string,
    owner: string,
    repo: string,
    octokit: Octokit
): Promise<ConflictFileContent[]> {
    const promises = fileList.map(async (fileName) => {
        const [ancestor, target, feature] = await Promise.all([
            fetchRawContent(fileName, ancestorSha, owner, repo, octokit),
            fetchRawContent(fileName, targetSha, owner, repo, octokit),
            fetchRawContent(fileName, featureSha, owner, repo, octokit)
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

/**
 * Helper: Fetches a single file's content from a specific commit/ref.
 * Returns null if the file is not found
 */
async function fetchRawContent(
    path: string, 
    ref: string, 
    owner: string, 
    repo: string, 
    octokit: Octokit
    ): Promise<string | null> {
    try {
        const response = await octokit.rest.repos.getContent({
            owner,
            repo,
            path,
            ref,
        });
        const validatedReponse: GitHubContent = GitHubContentSchema.parse(response.data)

        // GitHub API returns content as Base64
        if (validatedReponse.content && validatedReponse.encoding === 'base64') {
            return Buffer.from(validatedReponse.content, 'base64').toString('utf-8');
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