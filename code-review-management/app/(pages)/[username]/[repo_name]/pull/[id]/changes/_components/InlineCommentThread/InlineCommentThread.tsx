import { MockPublishedComment, MockPublishedThread } from "@/mocks/types/comments";
import InlineCommentItem from "../InlineCommentItem/InlineCommentItem";
import InlineThreadHeader from "../InlineThreadHeader/InlineThreadHeader";
import styles from "./InlineCommentThread.module.css";

export default function InlineCommentThread({ thread }: { thread: MockPublishedThread }) {
  return (
    <div className={styles.thread}>
      <InlineThreadHeader title={getThreadHeader(thread)} />
      <div className={styles.comments}>
        {thread.comments.map((comment: MockPublishedComment) => (
          <InlineCommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}

function getThreadHeader(thread: MockPublishedThread) {
  // Placeholder in case the ending line and side are undefined.
  if (!thread.line && !thread.side) return "File thread";

  const formatSide = (side: string) => (side === "RIGHT" ? "R" : "L");
  const endRange = `${formatSide(thread.side!)}${thread.line}`;

  // Starting line and side are undefined when it is not a multi-line comment.
  if (thread.start_side && thread.start_line && thread.start_line !== thread.line) {
    const startRange = `${formatSide(thread.start_side)}${thread.start_line}`;
    return `Thread on lines ${startRange} to ${endRange}`;
  }

  return `Thread on line ${endRange}`;
}
