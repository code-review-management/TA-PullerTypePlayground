import { FileData } from "react-diff-view";
import { FileDiff } from "@/types/github.types";
import styles from "./EmptyDiff.module.css";

/**
 * Empty file diff with message explaining why.
 *
 * @param diff: Diff parsed by react-diff-view.
 * @param fileMeta: File information from GitHub API.
 */
export default function EmptyDiff({
  diff,
  fileMeta,
}: {
  diff: FileData;
  fileMeta?: FileDiff;
}) {
  return (
    <div className={styles.emptyDiff}>
      {getEmptyDiffMessage(diff, fileMeta)}
    </div>
  );
}

function getEmptyDiffMessage(diff: FileData, fileMeta?: FileDiff): string {
  // Array to display multiple applicable messages.
  const messages: string[] = [];

  if (diff.isBinary) {
    messages.push("Binary file not shown.");
  }

  if (fileMeta?.status === "renamed" && fileMeta.changes === 0) {
    messages.push("File renamed without changes.");
  }

  // Default message.
  if (messages.length === 0) {
    messages.push("File contents not shown.");
  }

  return messages.join(" ");
}
