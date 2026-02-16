import { FileData } from "react-diff-view";
import FileDiffView from "../FileDiffView/FileDiffView";
import styles from "./DiffListView.module.css";

export default function DiffListView({ diffs }: { diffs?: FileData[] }) {
  if (!diffs) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.diffListView}>
      {diffs.map((diff) => (
        <FileDiffView
          key={diff.oldRevision + "-" + diff.newRevision}
          oldRevision={diff.oldRevision}
          newRevision={diff.newRevision}
          oldPath={diff.oldPath}
          newPath={diff.newPath}
          diffType={diff.type}
          viewType="split"
          hunks={diff.hunks}
        />
      ))}
    </div>
  );
}
