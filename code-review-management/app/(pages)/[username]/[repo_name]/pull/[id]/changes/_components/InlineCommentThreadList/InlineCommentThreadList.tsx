import { ChangeData } from "react-diff-view";
import { MockPublishedThread } from "@/mocks/types/comments";
import InlineCommentThread from "../InlineCommentThread/InlineCommentThread";
import styles from "./InlineCommentThreadList.module.css";

/**
 * react-diff-view renders widgets for normal, unchanged lines across both sides
 * of the diff. To keep widgets either on the LHS or RHS on normal lines, we
 * render the left-threads and right-threads in a flex-box that distributes the
 * space equally during "split" view.
 */

export default function InlineCommentPublishedThreadList({
  change,
  leftPublishedThreads,
  rightPublishedThreads,
}: {
  change: ChangeData;
  leftPublishedThreads: MockPublishedThread[];
  rightPublishedThreads: MockPublishedThread[];
}) {
  if (change.type === "delete") {
    return <PublishedThreadList publishedThreads={leftPublishedThreads} />;
  }
  else if (change.type === "insert") {
    return <PublishedThreadList publishedThreads={rightPublishedThreads} />;
  }
  else {
    return (
      <div className={styles.normalSplitContainer}>
        <div className={styles.normalSplitItems}>
          <PublishedThreadList publishedThreads={leftPublishedThreads} />
        </div>
        <div className={styles.normalSplitItems}>
          <PublishedThreadList publishedThreads={rightPublishedThreads} />
        </div>
      </div>
    );
  }
}

function PublishedThreadList({ publishedThreads }: { publishedThreads: MockPublishedThread[] }) {
  return (
    <div>
      {publishedThreads.map((thread) => (
        <InlineCommentThread key={thread.id} thread={thread} />
      ))}
    </div>
  );
}
