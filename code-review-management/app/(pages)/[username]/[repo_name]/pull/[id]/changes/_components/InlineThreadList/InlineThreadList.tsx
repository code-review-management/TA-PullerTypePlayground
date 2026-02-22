import { ChangeData } from "react-diff-view";
import { MockPublishedThread } from "@/mocks/types/comments";
import { DraftThreadItem } from "../../_hooks/useDraftThreads";
import InlineCommentThread from "../InlineCommentThread/InlineCommentThread";
import InlineDraftThread from "../InlineDraftThread/InlineDraftThread";
import styles from "./InlineThreadList.module.css";

/**
 * react-diff-view renders widgets for normal, unchanged lines across both sides
 * of the diff. To keep widgets either on the LHS or RHS on normal lines, we
 * render the left-threads and right-threads in a flex-box that distributes the
 * space equally during "split" view.
 */

export default function InlineThreadList({
  change,
  publishedThreadsBySide,
  draftBySide,
}: {
  change: ChangeData;
  publishedThreadsBySide: { left: MockPublishedThread[]; right: MockPublishedThread[] };
  draftBySide: { left: DraftThreadItem | null; right: DraftThreadItem | null };
}) {
  if (change.type === "delete") {
    return (
      <ThreadList
        publishedThreads={publishedThreadsBySide.left}
        draft={draftBySide.left}
      />
    );
  } else if (change.type === "insert") {
    return (
      <ThreadList
        publishedThreads={publishedThreadsBySide.right}
        draft={draftBySide.right}
      />
    );
  } else {
    // Executes when change.type === "normal"
    return (
      <div className={styles.normalLineColumns}>
        <div className={styles.normalLineSide}>
          <ThreadList
            publishedThreads={publishedThreadsBySide.left}
            draft={draftBySide.left}
          />
        </div>
        <div className={styles.normalLineSide}>
          <ThreadList
            publishedThreads={publishedThreadsBySide.right}
            draft={draftBySide.right}
          />
        </div>
      </div>
    );
  }
}

function ThreadList({
  publishedThreads,
  draft,
}: {
  publishedThreads: MockPublishedThread[];
  draft: DraftThreadItem | null;
}) {
  return (
    <div>
      {publishedThreads.map((thread) => (
        <InlineCommentThread key={thread.id} thread={thread} />
      ))}
      {draft && <InlineDraftThread draft={draft} />}
    </div>
  );
}
