import { ChangeData } from "react-diff-view";
import { MockPublishedThread } from "@/mocks/types/comments";
import { DraftItem } from "../../_hooks/useDrafts";
import InlineCommentThread from "../InlineCommentThread/InlineCommentThread";
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
  draftBySide: { left: DraftItem | null; right: DraftItem | null };
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
  draft: DraftItem | null;
}) {
  return (
    <div>
      {publishedThreads.map((thread) => (
        <InlineCommentThread key={thread.id} thread={thread} />
      ))}
      {draft && <div>Draft created at {draft.createdAt}</div>}
    </div>
  );
}
