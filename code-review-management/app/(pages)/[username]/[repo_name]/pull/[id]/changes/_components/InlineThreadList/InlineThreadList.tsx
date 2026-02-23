import { ChangeData } from "react-diff-view";
import { MockPublishedThread } from "@/mocks/types/comments";
import { DraftThreadItem } from "../../_hooks/useDraftThreads";
import InlineCommentThread from "../InlineCommentThread/InlineCommentThread";
import InlineDraftThread from "../InlineDraftThread/InlineDraftThread";
import styles from "./InlineThreadList.module.css";

/**
 * For a given line on a file diff, displays all threads (published and drafts)
 * that are anchored to it.
 *
 * Note: react-diff-view renders widgets for normal (unchanged) lines across the
 * entire diff without separating them by side. To position comments on the
 * correct LHS or RHS column, we use a flex-box that distributes the space
 * equally between the left-threads and right-threads during "split" view.
 *
 * @param change: `Change` object containing data about the line these threads are anchored to.
 * @param publishedThreadsBySide: Published threads grouped by side.
 * @param draftThreadsBySide: Draft threads grouped by side.
 */
export default function InlineThreadList({
  change,
  publishedThreadsBySide,
  draftThreadsBySide,
}: {
  change: ChangeData;
  publishedThreadsBySide: { left: MockPublishedThread[]; right: MockPublishedThread[] };
  draftThreadsBySide: { left: DraftThreadItem | null; right: DraftThreadItem | null };
}) {
  if (change.type === "delete") {
    return (
      <ThreadList
        publishedThreads={publishedThreadsBySide.left}
        draftThread={draftThreadsBySide.left}
      />
    );
  } else if (change.type === "insert") {
    return (
      <ThreadList
        publishedThreads={publishedThreadsBySide.right}
        draftThread={draftThreadsBySide.right}
      />
    );
  } else {
    // Executes when change.type === "normal"
    return (
      <div className={styles.normalLineColumns}>
        <div className={styles.normalLineSide}>
          <ThreadList
            publishedThreads={publishedThreadsBySide.left}
            draftThread={draftThreadsBySide.left}
          />
        </div>
        <div className={styles.normalLineSide}>
          <ThreadList
            publishedThreads={publishedThreadsBySide.right}
            draftThread={draftThreadsBySide.right}
          />
        </div>
      </div>
    );
  }
}

/**
 * Used by `InlineThreadList` to render a list of published threads followed by
 * a draft thread if present.
 *
 * @param publishedThreads: List of published threads to render.
 * @param draftThread: Draft thread to render, or null if none exists.
 */
function ThreadList({
  publishedThreads,
  draftThread,
}: {
  publishedThreads: MockPublishedThread[];
  draftThread: DraftThreadItem | null;
}) {
  return (
    <div>
      {publishedThreads.map((publishedThread) => (
        <InlineCommentThread key={publishedThread.id} thread={publishedThread} />
      ))}
      {draftThread && <InlineDraftThread draft={draftThread} />}
    </div>
  );
}
