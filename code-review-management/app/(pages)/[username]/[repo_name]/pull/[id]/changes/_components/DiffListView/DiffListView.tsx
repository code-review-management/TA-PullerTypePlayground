import { useMemo } from "react";
import { parseDiff } from "react-diff-view";
import { useDraftThreadsContext } from "../../_contexts/DraftThreadsContext";
import { useActiveDiffs } from "../../_hooks/useActiveDiffs";
import { useChangesViewMode } from "../../_hooks/useChangesViewMode";
import { usePublishedThreadsByDiff } from "../../_hooks/usePublishedThreadsByDiff";
import { FileDiff, PullRequest } from "@/types/github.types";
import { PublishedThreads } from "../../_hooks/usePublishedThreads";
import { getActivePath } from "../../_utils/diff-utils";
import { orderParsedDiffs } from "../../_utils/filetree-utils";
import ErrorMessage, {
  getErrorMessageProps,
} from "@components/ErrorMessage/ErrorMessage";
import FileDiffView from "../FileDiffView/FileDiffView";
import IconTooltip from "@components/IconTooltip/IconTooltip";
import styles from "./DiffListView.module.css";

export default function DiffListView({
  pull,
  flatFileTree,
  publishedThreads,
  externalHref,
  sha,
}: {
  pull: PullRequest;
  flatFileTree: FileDiff[];
  publishedThreads: PublishedThreads;
  externalHref?: string;
  sha: string | null;
}) {
  const { draftThreads, setDraftThreads } = useDraftThreadsContext();
  const { mode } = useChangesViewMode();
  const { diffString, isPending, isError, error } = useActiveDiffs(pull);

  const diffs = useMemo(() => {
    if (!diffString) return []; // Fallback to handle type errors, but won't render during loading/error state.
    const parsedDiffs = parseDiff(diffString, { nearbySequences: "zip" });
    orderParsedDiffs(parsedDiffs, flatFileTree);
    // Ordered `parsedDiffs` array has 1-1 matching with ordered `flatFileTree` array.
    return parsedDiffs.map((diff, index) => ({
      diff,
      fileMeta: flatFileTree.at(index),
    }));
  }, [diffString, flatFileTree]);

  const publishedThreadsByDiff = usePublishedThreadsByDiff(
    publishedThreads,
    diffs,
  );

  // TODO: Replace with proper loading UI.
  if (isPending) return <div>Loading diffs...</div>;
  if (isError) {
    return (
      <ErrorMessage
        {...getErrorMessageProps(error, "diff")}
        externalHref={externalHref}
      />
    );
  }

  return (
    <div className={`${styles.diffListView} ${sha ? styles.extraPadding : ""}`}>
      {diffs.map(({ diff, fileMeta }) => {
        const activePath = getActivePath(diff.type, diff.oldPath, diff.newPath);
        const diffId = diff.oldPath + "-" + diff.newPath;
        const tooltips = (
          <>
            <IconTooltip id={`tooltip-collapse-diff-${diffId}`} />
            <IconTooltip id={`tooltip-file-comment-${diffId}`} />
            <IconTooltip id={`tooltip-copy-${diff.oldPath}`} />
            <IconTooltip id={`tooltip-copy-${diff.newPath}`} />
          </>
        );

        return (
          <div key={diffId}>
            {tooltips}
            <FileDiffView
              diff={diff}
              fileMeta={fileMeta}
              viewType="split"
              publishedThreads={publishedThreadsByDiff[activePath]}
              draftThreadsByLine={draftThreads[activePath]}
              setDraftThreads={setDraftThreads}
              isCommitView={mode !== "pr"}
            />
          </div>
        );
      })}
    </div>
  );
}
