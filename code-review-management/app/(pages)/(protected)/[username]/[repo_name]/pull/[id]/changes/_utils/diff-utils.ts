import refractor from "refractor";
import path from "path";
import { ChangeData, FileData } from "react-diff-view";
import { Side } from "react-diff-view/types/interface";

const DIFF_GIT_PREFIX = "diff --git ";

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

export function toGitHubSide(side: Side) {
  return side === "old" ? "LEFT" : "RIGHT";
}

export function fixParsedDiffPaths(
  diffString: string,
  parsedDiffs: FileData[],
) {
  const diffGitLines = diffString.match(/^diff --git .*/gm) ?? [];

  diffGitLines.forEach((line, i) => {
    const parsed = parsedDiffs[i];
    if (!parsed) return;

    const paths = line.slice(DIFF_GIT_PREFIX.length);
    const mid = Math.floor(paths.length / 2);
    if (paths[mid] !== " ") return;

    const aPrefixed = paths.slice(0, mid);
    const bPrefixed = paths.slice(mid + 1);
    if (!aPrefixed.startsWith("a/") || !bPrefixed.startsWith("b/")) return;

    const oldPath = aPrefixed.slice(2);
    const newPath = bPrefixed.slice(2);
    if (oldPath !== newPath) return;

    parsed.oldPath = oldPath;
    parsed.newPath = newPath;
  });
}

/**
 * Creates the ID for a file-diff by URL encoding the spaces. Required for the
 * edge case when there are multiple files whose paths only differ by the
 * amounts of trailing whitespace at the end.
 *
 * Docs: https://stackoverflow.com/a/72073207
 *
 * @param path: Active path of file-diff.
 */
export function createFileDiffId(activePath: string) {
  return `file-${activePath.replace(/\s/g, "%20")}`;
}
