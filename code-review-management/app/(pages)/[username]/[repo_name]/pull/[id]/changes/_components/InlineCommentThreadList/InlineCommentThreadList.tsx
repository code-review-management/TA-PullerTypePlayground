import { ChangeData, ViewType } from "react-diff-view";
import { MockPublishedThread } from "@/mocks/types/comments";
import InlineCommentThread from "../InlineCommentThread/InlineCommentThread";
import styles from "./InlineCommentThreadList.module.css";

export default function InlineCommentPublishedThreadList({
  change,
  viewType,
  leftPublishedThreads,
  rightPublishedThreads,
}: {
  change: ChangeData;
  viewType: ViewType;
  leftPublishedThreads: MockPublishedThread[];
  rightPublishedThreads: MockPublishedThread[];
}) {
  if (change.type === "delete") {
    return <PublishedThreadList publishedThreads={leftPublishedThreads} />;
  }
  else if (change.type === "insert") {
    return <PublishedThreadList publishedThreads={rightPublishedThreads} />;
  }
  else if (viewType === "split") {
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
  else {
    return (
      <div>
        <PublishedThreadList publishedThreads={leftPublishedThreads} />
        <PublishedThreadList publishedThreads={rightPublishedThreads} />
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
