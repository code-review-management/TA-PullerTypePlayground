import axios from 'axios';
import { CompareResponse, CompareResponseSchema } from './merge-github.types';

export interface ConflictingFilesResponse{
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
): Promise<ConflictingFilesResponse>  => {
    try {
        const baseUrl:string = `https://api.github.com/repos/${owner}/${repo}`;
        const baseHead: string = `${encodeURIComponent(targetBranch)}...${encodeURIComponent(featureBranch)}`;
        const featureResponse = await axios(
            `${baseUrl}/compare/${baseHead}`,
            { headers }
        );
        const validatedFeatureReponse: CompareResponse = CompareResponseSchema.parse(featureResponse)

        const ancestorSha = validatedFeatureReponse.merge_base_commit.sha;
        const featureFiles = validatedFeatureReponse.files.map(f => f.filename);

        const targetResponse = await axios.get(
            `${baseUrl}/compare/${ancestorSha}...${targetBranch}`,
            { headers }
        );
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