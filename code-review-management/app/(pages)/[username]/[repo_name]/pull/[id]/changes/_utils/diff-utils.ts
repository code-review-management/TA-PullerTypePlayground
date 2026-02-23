import refractor from "refractor";
import path from "path";
import { ChangeData, FileData } from "react-diff-view";
import { Side } from "react-diff-view/types/interface";

export function getLineNumber(change: ChangeData, side: Side) {
  if (change.type === "delete" || change.type === "insert") {
    return change.lineNumber;
  }
  // Executes when change.type === "normal":
  return side === "new" ? change.newLineNumber : change.oldLineNumber;
}

export function getActivePath(
  diffType: FileData["type"],
  oldPath: string,
  newPath: string,
) {
  return diffType === "delete" ? oldPath : newPath;
}

export function getLanguage(filename: string) {
  const fileExtension = path.extname(filename).slice(1);

  if (refractor.registered(fileExtension)) {
    return fileExtension;
  } else {
    return "txt";
  }
}
