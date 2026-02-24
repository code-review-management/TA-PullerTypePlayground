import { CompareResponse, CompareResponseSchema } from './merge-github.types';
import { Octokit } from 'octokit';

export interface ConflictingFilesResponse{
    merge_base_commit: string,
    files: string[]
}

export const findConflictingFiles = async (
    owner: string,
    repo: string,
    targetBranch: string,
    featureBranch: string,
    octokit: Octokit
): Promise<ConflictingFilesResponse>  => {
    try {
        const featureResponse = await octokit.rest.repos.compareCommits({
                owner,
                repo,
                base: targetBranch,
                head: featureBranch,
        });
        const validatedFeatureReponse: CompareResponse = CompareResponseSchema.parse(featureResponse)

        const ancestorSha = validatedFeatureReponse.merge_base_commit.sha;
        const featureFiles = validatedFeatureReponse.files.map(f => f.filename);

        const targetResponse = await octokit.rest.repos.compareCommits({
                owner,
                repo,
                base: ancestorSha,
                head: featureBranch,
        });
        const validatedTargetReponse: CompareResponse = CompareResponseSchema.parse(targetResponse)
        
        const targetFiles = validatedTargetReponse.files.map(f => f.filename);
        const overlappingFiles = featureFiles.filter(file => targetFiles.includes(file));

        return  {
            merge_base_commit: ancestorSha,
            files: overlappingFiles
        }
    } catch (error: any) {
        console.error("Error executing API calls:", error.response?.data || error.message);
        throw error;
    }
}