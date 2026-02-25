import { useParams } from "next/navigation";
import { Dispatch, SetStateAction, useMemo } from "react";
import { parseDiff } from "react-diff-view";
import { useFileDiffsQuery } from "@/lib/api/queries/useFileDiffsQuery";
import { PullParams } from "@/types/routing.types";
import { DraftThreads } from "../../_hooks/useDraftThreads";
import { PublishedThreads } from "../../_hooks/usePublishedThreads";
import { getActivePath } from "../../_utils/diff-utils";
import FileDiffView from "../FileDiffView/FileDiffView";
import styles from "./DiffListView.module.css";

export default function DiffListView({
  publishedThreads,
  draftThreads,
  setDraftThreads,
}: {
  publishedThreads: PublishedThreads;
  draftThreads: DraftThreads;
  setDraftThreads: Dispatch<SetStateAction<DraftThreads>>;
}) {
  const { username, repo_name, id } = useParams<PullParams>();
  const {
    data: diffString,
    isPending,
    isError,
  } = useFileDiffsQuery(username, repo_name, id);

  const diffs = useMemo(() => {
    if (!diffString) return []; // Fallback to handle type errors, but won't render during pending/error state.
    return parseDiff(diffString, { nearbySequences: "zip" });
  }, [diffString]);

  // TODO: Replace with proper loading/error UI.
  if (isPending) return <div>Loading diffs...</div>;
  if (isError) return <div>Failed to load diffs.</div>;

  return (
    <div className={styles.diffListView}>
      {diffs.map((diff) => {
        const activePath = getActivePath(diff.type, diff.oldPath, diff.newPath);
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
