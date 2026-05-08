import { RegionData } from "./SuggestionDiffEditor";
import { Monaco } from "@monaco-editor/react";
import type { languages } from "monaco-editor";

export const getLineCount = (str: string) => (str ? str.split("\n").length : 0);
export const getLines = (str: string) => (str ? str.split("\n") : []);

/**
 * Handles when a user clicks on the gutter. It adds the regions from the clicked lines
 * to the diff region into the suggestion block
 * @param clickedLine The line clicked by the user
 * @param currentData The current text regions of the suggestion diff
 * @returns The region data, which is the new text content, since expanding a region shifts the code
 */
export function calculateExpandedRegions(
  clickedLine: number,
  currentData: RegionData,
): RegionData | null {
  const { beforeCode, originalCode, modifiedCode, afterCode } = currentData;

  const beforeArr = getLines(beforeCode);
  const afterArr = getLines(afterCode);

  let newBeforeCode = beforeCode;
  let newAfterCode = afterCode;
  let newOriginalCode = originalCode;
  let newModifiedCode = modifiedCode;

  const startLine = beforeArr.length > 0 ? beforeArr.length + 1 : 1;
  const endLine = startLine + getLines(modifiedCode).length - 1;

  if (clickedLine >= startLine && clickedLine <= endLine) {
    return null;
  }

  if (clickedLine < startLine) {
    const linesToTake = startLine - clickedLine;
    const shifted = beforeArr.splice(-linesToTake, linesToTake);

    newBeforeCode = beforeArr.join("\n");
    const shiftStr = shifted.join("\n");

    newOriginalCode = shiftStr + (originalCode ? "\n" + originalCode : "");
    newModifiedCode = shiftStr + (modifiedCode ? "\n" + modifiedCode : "");
  } else if (clickedLine > endLine) {
    const linesToTake = clickedLine - endLine;
    const shifted = afterArr.splice(0, linesToTake);

    newAfterCode = afterArr.join("\n");
    const shiftStr = shifted.join("\n");

    newOriginalCode = (originalCode ? originalCode + "\n" : "") + shiftStr;
    newModifiedCode = (modifiedCode ? modifiedCode + "\n" : "") + shiftStr;
  }

  return {
    beforeCode: newBeforeCode,
    originalCode: newOriginalCode,
    modifiedCode: newModifiedCode,
    afterCode: newAfterCode,
  };
}

/**
 * Dynamically queries Monaco's internal registry to find the correct
 * language identifier (e.g., "csharp") based on a file extension (e.g., ".cs").
 * Unfortunantly, the uri doesnt seem to work for the diff editor
 */
export function getLanguageIdFromFilename(
  filename: string,
  monaco: Monaco,
): string {
  if (!filename) return "plaintext";
  const ext = "." + filename.split(".").pop()?.toLowerCase();
  const language = monaco.languages
    .getLanguages()
    .find((lang: languages.ILanguageExtensionPoint) =>
      lang.extensions?.includes(ext),
    );

  return language?.id || "plaintext";
}

// Styling information for the monaco editor.
// unfortunantly, it changes very little
export const vsCodeLightPlus = {
  base: "vs",
  inherit: true,
  rules: [
    { background: "FFFFFF" },
    { token: "keyword", foreground: "0000FF" },
    { token: "type", foreground: "267F99" },
    { token: "function", foreground: "795E26" },
    { token: "string", foreground: "A31515" },
    { token: "variable", foreground: "001080" },
    { token: "number", foreground: "098658" },
    { token: "comment", foreground: "008000" },
    { token: "operator", foreground: "000000" },
  ],
  colors: {
    "editor.background": "#FFFFFF",
    "editor.foreground": "#000000",
    "editorCursor.foreground": "#000000",
    "editor.lineHighlightBackground": "#F8F8F8",
    "editorLineNumber.foreground": "#2B91AF",
    "editor.selectionBackground": "#ADD6FF",
    "editor.inactiveSelectionBackground": "#E5EBF1",
  },
};
