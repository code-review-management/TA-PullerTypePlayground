import { ChangeData } from "react-diff-view";

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
