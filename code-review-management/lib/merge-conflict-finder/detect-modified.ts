import { CompareResponse, CompareResponseSchema } from './merge-github.types';
import { Octokit } from 'octokit';

export interface ConflictingFilesResponse{
    mergeBaseCommit: string,
    targetShaAtMerge: string,
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
        const validatedFeatureReponse: CompareResponse = CompareResponseSchema.parse(featureResponse.data)

        const ancestorSha: string = validatedFeatureReponse.merge_base_commit.sha;
        const targetSha: string = validatedFeatureReponse.base_commit.sha;
        const featureFiles: string[] = validatedFeatureReponse.files.map(f => f.filename);

        const targetResponse = await octokit.rest.repos.compareCommits({
                owner,
                repo,
                base: ancestorSha,
                head: featureBranch,
        });
        const validatedTargetReponse: CompareResponse = CompareResponseSchema.parse(targetResponse.data)
        
        const targetFiles = validatedTargetReponse.files.map(f => f.filename);
        const overlappingFiles = featureFiles.filter(file => targetFiles.includes(file));

        return  {
            mergeBaseCommit: ancestorSha,
            targetShaAtMerge: targetSha,
            files: overlappingFiles
        }
    } catch (error: any) {
        console.error("Error executing API calls:", error.response?.data || error.message);
        throw error;
    }
}