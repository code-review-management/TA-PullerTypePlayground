import { FileData } from "react-diff-view";
import { PublishedThreads } from "../../_hooks/usePublishedThreads";
import FileDiffView from "../FileDiffView/FileDiffView";
import styles from "./DiffListView.module.css";

export default function DiffListView({
  diffs,
  publishedThreads,
}: {
  diffs?: FileData[];
  publishedThreads?: PublishedThreads;
}) {
  if (!diffs || !publishedThreads) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.diffListView}>
      {diffs.map((diff) => {
        const filePath = diff.type === "delete" ? diff.oldPath : diff.newPath;
        return (
          <FileDiffView
            key={diff.oldRevision + "-" + diff.newRevision}
            oldRevision={diff.oldRevision}
            newRevision={diff.newRevision}
            oldPath={diff.oldPath}
            newPath={diff.newPath}
            diffType={diff.type}
            viewType="split"
            hunks={diff.hunks}
            publishedThreadsByLine={publishedThreads.get(filePath) ?? new Map()}
          />
        );
      })}
    </div>
  );
}
