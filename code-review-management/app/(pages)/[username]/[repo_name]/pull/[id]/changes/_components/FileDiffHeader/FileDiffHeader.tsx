import { FileData } from "react-diff-view";
import styles from "./FileDiffHeader.module.css";

export default function FileDiffHeader({
  diffType,
  oldPath,
  newPath,
}: {
  diffType: FileData["type"];
  oldPath: string;
  newPath: string;
}) {
  return (
    <div className={styles.fileDiffHeader}>
      {diffType === "delete" ? oldPath : newPath}
    </div>
  );
}
