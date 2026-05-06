import { Octokit } from "octokit";
import { getFileDiffAndContent } from "./retrieveContext";
import { getSystemPrompt, getUserPrompt } from "./prompt";
import { callGeminiToGenerateSuggestion } from "./generateGeminiSuggestion";
import { ThreadSuggestionRequest } from "@/types/request.types";
import { commentGeminiSuggestion } from "./geminiCommentor";

export async function generateSuggestion(
  ocktokit: Octokit,
  threadVal: ThreadSuggestionRequest,
  owner: string,
  repo: string,
  pull_number: number,
): Promise<void> {
  try {
    const { filePath, line, comments, sha } = threadVal;
    const context = await getFileDiffAndContent(
      ocktokit,
      owner,
      repo,
      filePath,
      sha,
    );
    const systemPrompt = getSystemPrompt();
    const userPrompt = getUserPrompt(context, comments, line);

    const geminiResponse = await callGeminiToGenerateSuggestion(
      systemPrompt,
      userPrompt,
    );
    await commentGeminiSuggestion(
      ocktokit,
      owner,
      repo,
      pull_number,
      geminiResponse,
      context.content,
      threadVal,
    );
    return;
  } catch (error) {
    console.error(
      `Error generating gemini data for ${threadVal.filePath}: `,
      error,
    );
    throw error;
  }
}
