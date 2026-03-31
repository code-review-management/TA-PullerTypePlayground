import { useParams } from "next/navigation";
import { useMemo } from "react";
import { parseDiff } from "react-diff-view";
import { useFileDiffsQuery } from "@/lib/api/queries/useFileDiffsQuery";
import { FileDiff } from "@/types/github.types";
import { PullParams } from "@/types/routing.types";
import { PublishedThreads } from "../../_hooks/usePublishedThreads";
import { getActivePath } from "../../_utils/diff-utils";
import { orderParsedDiffs } from "../../_utils/filetree-utils";
import FileDiffView from "../FileDiffView/FileDiffView";
import IconTooltip from "@components/IconTooltip/IconTooltip";
import styles from "./DiffListView.module.css";

export default function DiffListView({
  flatFileTree,
  publishedThreads,
}: {
  flatFileTree: FileDiff[];
  publishedThreads: PublishedThreads;
}) {
  const { username, repo_name, id } = useParams<PullParams>();
  const {
    data: diffString,
    isPending,
    isError,
  } = useFileDiffsQuery(username, repo_name, id);

  const diffs = useMemo(() => {
    if (!diffString) return []; // Fallback to handle type errors, but won't render during loading/error state.
    const parsed = parseDiff(diffString, { nearbySequences: "zip" });
    orderParsedDiffs(parsed, flatFileTree);
    return parsed;
  }, [diffString, flatFileTree]);

  // TODO: Replace with proper loading/error UI.
  if (isPending) return <div>Loading diffs...</div>;
  if (isError) return <div>Failed to load diffs.</div>;

  return (
    <div className={styles.diffListView}>
      {diffs.map((diff) => {
        const activePath = getActivePath(diff.type, diff.oldPath, diff.newPath);
        const diffId = diff.oldPath + "-" + diff.newPath;

        return (
          <div key={diffId}>
            <IconTooltip id={`collapse-expand-diff-${diffId}`} />
            <FileDiffView
              oldPath={diff.oldPath}
              newPath={diff.newPath}
              diffType={diff.type}
              viewType="split"
              hunks={diff.hunks}
              // When there are no published threads mapped to a file, pass an empty map.
              publishedThreadsByLine={
                publishedThreads.get(activePath) ?? new Map()
              }
            />
          </div>
        );
      })}
    </div>
  );
}
