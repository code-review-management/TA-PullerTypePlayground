export interface SuggestiveComment {
  hasSuggestion: boolean,
  relativeStartLine: number,
  deletionContent: string,
  additionContent: string,
}

export function extractSuggestions(comment: string): SuggestiveComment {
  const extractedSuggestion: SuggestiveComment = {
    hasSuggestion: false,
    relativeStartLine: 0,
    deletionContent: "",
    additionContent: "",
  };

    const match = comment.match(/<!--\[Gemini Suggestion#HLTP]\[(.*?)\]/);
    if (match) {
      const relativeStartLine = parseInt(match[1]);
      extractedSuggestion.relativeStartLine = relativeStartLine;

      const deletedMatch = comment.match(
        /<!--Gemini-Tag \[Code To Be Deleted]-->\n```diff\n([\s\S]*?)\n```\n<!--Gemini-Tag \[Code To Be Inserted]-->/
      );

      const insertedMatch = comment.match(
        /<!--Gemini-Tag \[Code To Be Inserted]-->\n```diff\n([\s\S]*?)\n```\n<!--Gemini-Tag \[Diff End] -->/
      );

      if (deletedMatch){
        extractedSuggestion.deletionContent = deletedMatch[1].replace(/^- /gm, "");
      } else {
        console.log("tag tampered!");
        return extractedSuggestion;
      }

      if (insertedMatch) {
        extractedSuggestion.additionContent = insertedMatch[1].replace(/^\+ /gm, "");
      } else {
        console.log("tag tampered!");
        return extractedSuggestion;
      }

      extractedSuggestion.hasSuggestion = true;
    }

  return extractedSuggestion;
}