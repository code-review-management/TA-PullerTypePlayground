import { CompareResponse, CompareResponseSchema, CompareWithRateLimitSchema } from './merge-github.types';
import { Octokit } from 'octokit';

const API_REDUNDENCY: number = 500;
const API_TOKENS_PER_MINUTE: number = 15;

export class AllowanceError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, AllowanceError.prototype);
        this.name = 'ValidationError'; 
    }
}


export const validateUserAllowance = async (
    owner: string,
    repo: string,
    targetBranch: string,
    featureBranch: string,
    octokit: Octokit
): Promise<boolean>  => {
    try {
        const response = await octokit.rest.repos.compareCommits({
        owner,
        repo,
        base: targetBranch,
        head: featureBranch,
        });


        const result = CompareWithRateLimitSchema.parse({
            data: response.data,
            rateLimit: {
            limit: response.headers["x-ratelimit-limit"],
            remaining: response.headers["x-ratelimit-remaining"],
            reset: response.headers["x-ratelimit-reset"],
            },
        });
        const validatedFeatureReponse: CompareResponse = result.data
        const { limit, remaining, reset} = result.rateLimit;

        const ancestorSha: string = validatedFeatureReponse.merge_base_commit.sha;
        const targetSha: string = validatedFeatureReponse.base_commit.sha;
        const featureFiles: string[] = validatedFeatureReponse.files.map(f => f.filename);

        const targetResponse = await octokit.rest.repos.compareCommits({
                owner,
                repo,
                base: ancestorSha,
                head: targetBranch,
        });
        const validatedTargetReponse: CompareResponse = CompareResponseSchema.parse(targetResponse.data)
        
        const targetFiles = validatedTargetReponse.files.map(f => f.filename);
        const overlappingFiles = featureFiles.filter(file => targetFiles.includes(file));
        const conflictFileCount: number = overlappingFiles.length
        
        const apiCallCost: number = calculateTokenCost(conflictFileCount, validatedFeatureReponse);
        const minutesRemaining: number = getMinutesUntilReset(reset)

        if (minutesRemaining === 0){
            return true;
        } else if (remaining < API_REDUNDENCY){
            return false;
        } else{
            console.log("Cost: ", apiCallCost, " | remaining: ", remaining, " | token per minute: ", minutesRemaining * API_TOKENS_PER_MINUTE)
            return API_REDUNDENCY < remaining - (minutesRemaining * API_TOKENS_PER_MINUTE) - apiCallCost;
        }
    } catch (error: any) {
        console.error("Error validating user allowance:", error.response?.data || error.message);
        throw error;
    }
}

const calculateTokenCost = (
    conflictFileCount: number,
    featureFiles: CompareResponse
) : number => {
    let totalCost: number = conflictFileCount * 3; // this is get cost
    
    const removedDirs = new Set<string>();
    const activeDirs = new Set<string>();

    for (const file of featureFiles.files) {
        const lastSlashIndex = file.filename.lastIndexOf('/');
        const dirPath = lastSlashIndex === -1 ? '' : file.filename.substring(0, lastSlashIndex);

        if (file.status === 'removed') {
            if (!removedDirs.has(dirPath)) {
                removedDirs.add(dirPath);
                totalCost += 1;
            }
        } else {
            if (!activeDirs.has(dirPath)) {
                activeDirs.add(dirPath);
                totalCost += 1;
            }
        }
    }
    totalCost += 4; // ref call, compare commit call, commit call, push commit call
    return totalCost;
}

export const getMinutesUntilReset = (resetTimestampSeconds: number): number => {
    const currentTimeSeconds = Math.floor(Date.now() / 1000);
    const secondsRemaining = resetTimestampSeconds - currentTimeSeconds;
    if (secondsRemaining <= 0) {
        return 0;
    }
    return Math.ceil(secondsRemaining / 60);
};