import { Dispatch, SetStateAction } from "react";
import { FileData } from "react-diff-view";
import { DraftThreads } from "../../_hooks/useDraftThreads";
import { PublishedThreads } from "../../_hooks/usePublishedThreads";
import FileDiffView from "../FileDiffView/FileDiffView";
import styles from "./DiffListView.module.css";

export default function DiffListView({
  diffs,
  publishedThreads,
  draftThreads,
  setDraftThreads,
}: {
  diffs?: FileData[];
  publishedThreads?: PublishedThreads;
  draftThreads: DraftThreads;
  setDraftThreads: Dispatch<SetStateAction<DraftThreads>>;
}) {
  if (!diffs || !publishedThreads) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.diffListView}>
      {diffs.map((diff) => {
        const activePath = diff.type === "delete" ? diff.oldPath : diff.newPath;
        return (
          <FileDiffView
            key={diff.oldPath + "-" + diff.newPath}
            oldPath={diff.oldPath}
            newPath={diff.newPath}
            diffType={diff.type}
            viewType="split"
            hunks={diff.hunks}
            // When there are no published threads mapped to a file, pass an empty map.
            publishedThreadsByLine={publishedThreads.get(activePath) ?? new Map()}
            draftThreads={draftThreads}
            setDraftThreads={setDraftThreads}
          />
        );
      })}
    </div>
  );
}
