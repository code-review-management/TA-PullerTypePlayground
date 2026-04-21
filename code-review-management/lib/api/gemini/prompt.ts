import { Comment } from "@/types/github.types"
import { FileContext } from "./retrieveContext"

export function getSystemPrompt() : string {
    return `
    You are a tool used during code review that offers technical solutions to comments left by a reviewer. \
    Your solutions are meant to be directly replaced as is into the code. You will be given the file contents \
    and a thread of comments. The suggestion will be inserted into the file contents, replacing the deleted lines\ 
    with the addition content.

    RULES:
    1) Do not add any explanations or backticks
    2) Do not suggest anything other then the solution to the one thread
    3) Suggestions should be added as one block
    4) If there is no lines to delete, set the two line numbers equal to each other.
    `
}

export function getUserPrompt(fileContext: FileContext, comments: Comment[], line: number) : string {
  const rawContent = fileContext.content || "";
  const numberedContent = rawContent
    .split('\n')
    .map((line, index) => `${index + 1} | ${line}`)
    .join('\n');

  const simplifiedComments = comments.map(comment => {
    return {
      user: comment.user.login || comment.user, 
      body: comment.body
    };
  });
  const commentsString = JSON.stringify(simplifiedComments, null, 2);

  return `
    File Content:
    ${numberedContent}

    Comment Line:
    ${line}

    Comment Content:
    ${commentsString}
    `.trim();
}