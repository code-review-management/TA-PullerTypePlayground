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
  if (diff.isBinary) return "Binary file cannot be shown.";
  if (fileMeta?.status === "renamed" && fileMeta.changes === 0)
    return "File renamed without changes.";
  return "File contents cannot be shown.";
}
