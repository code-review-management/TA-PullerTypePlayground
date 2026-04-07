import { Octokit } from "octokit";
import { getFileDiffAndContent } from "./retrieveContext";
import { getSystemPrompt, getUserPrompt } from "./prompt";
import { callGeminiToGenerateSuggestion } from "./generateGeminiSuggestion";
import { ThreadSuggestionRequest } from "@/types/request.types";

export async function generateSuggestion(
    ocktokit: Octokit,
    threadVal: ThreadSuggestionRequest,
    owner: string,
    repo: string
): Promise<string> {
try {
    const {id, filePath, side, line, comments, sha} = threadVal;
    const context = await getFileDiffAndContent(ocktokit, owner, repo, filePath, sha) 
    const systemPrompt = getSystemPrompt();
    const userPrompt = getUserPrompt(context, comments, line);

    const geminiResponse = callGeminiToGenerateSuggestion(systemPrompt, userPrompt)
    return geminiResponse;

} catch (error) {
    console.error(`Error generating gemini data for ${threadVal.filePath}: `, error);
    throw error;
}
}