import { FileData } from "react-diff-view";
import { FileDiff } from "@/types/github.types";
import styles from "./EmptyDiff.module.css";

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
  const messages = [];

  if (diff.isBinary) {
    messages.push("Binary file not shown.");
  }

  if (fileMeta?.status === "renamed" && fileMeta.changes === 0) {
    messages.push("File renamed without changes.");
  }

  if (messages.length === 0) {
    messages.push("File contents not shown."); // Default message
  }

  return messages.join(" ");
}
