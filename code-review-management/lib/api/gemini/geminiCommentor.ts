import { CodeEditResponse, ThreadSuggestionRequest } from "@/types/request.types";
import { Octokit } from "octokit";

export async function commentGeminiSuggestion(
    octokit: Octokit,
    owner: string,
    repo: string,
    pull_number: number,
    suggestion: CodeEditResponse,
    fileContext: string,
    thread: ThreadSuggestionRequest
) {
    const header: string = "Gemini Suggestion (AI can make mistakes)";
    
    const fileLines: string[] = fileContext.split('\n');
    const { deleteRange, additionBlock } = suggestion;
    let deletionBlock = "";

    for (let i = deleteRange.minInclusiveLine; i < deleteRange.maxExclusiveLine; i++){
        deletionBlock += fileLines[i] + '\n';
    }

    const { insertionCode } = additionBlock;
    const body = convertIntoMarkdownSuggestion(header, deletionBlock, insertionCode);

    try {
        const response = await octokit.rest.pulls.createReplyForReviewComment({
        owner,
        repo,
        pull_number,
        comment_id: thread.id,
        body,
        });

        console.log(`Threaded reply created! URL: ${response.data.html_url}`);
  } catch (error) {
    console.error("Failed to reply to review comment:", error);
  }
}

function convertIntoMarkdownSuggestion(header: string, deletionBlock: string, insertionBlock: string): string {

  const formatDiffLines = (text: string, prefix: string): string => {
    return text
      .trimEnd() 
      .split('\n')
      .map(line => `${prefix} ${line}`)
      .join('\n');
  };

  const formattedDeletions = formatDiffLines(deletionBlock, '-');
  const formattedInsertions = formatDiffLines(insertionBlock, '+');


  return `### ${header}

\`\`\`diff
${formattedDeletions}
${formattedInsertions}
\`\`\``;
}