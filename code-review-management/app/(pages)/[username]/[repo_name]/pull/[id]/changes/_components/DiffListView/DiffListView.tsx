import { FileData } from "react-diff-view";
import { PublishedThreads } from "../../_hooks/usePublishedThreads";
import FileDiffView from "../FileDiffView/FileDiffView";
import styles from "./DiffListView.module.css";
import { Drafts } from "../../_hooks/useDrafts";
import { Dispatch, SetStateAction } from "react";

export default function DiffListView({
  diffs,
  publishedThreads,
  drafts,
  setDrafts,
}: {
  diffs?: FileData[];
  publishedThreads?: PublishedThreads;
  drafts: Drafts;
  setDrafts: Dispatch<SetStateAction<Drafts>>;
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
            publishedThreadsByLine={
              publishedThreads.get(activePath) ?? new Map()
            }
            drafts={drafts}
            setDrafts={setDrafts}
          />
        );
      })}
    </div>
  );
}
