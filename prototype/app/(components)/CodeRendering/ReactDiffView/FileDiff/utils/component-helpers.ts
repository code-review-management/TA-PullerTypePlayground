import refractor from "refractor";
import { ChangeData, HunkData, markEdits, tokenize } from "react-diff-view";

export function getTokens(hunks: HunkData[], newPath: string) {
  return tokenize(hunks, {
    refractor,
    highlight: true,
    language: newPath.split(".")?.pop() || "txt", // gets the file extension, update with API
    enhancers: [markEdits(hunks, { type: "line" })],
  });
}

export function getLineKey(change: ChangeData, side: "new" | "old") {
  let lineKey = "";

  if (change.type === "normal") {
    lineKey =
      side === "old"
        ? `${side}-${change.oldLineNumber}`
        : `${side}-${change.newLineNumber}`;
  } else {
    lineKey = `${side}-${change.lineNumber}`;
  }

  return lineKey;
}
