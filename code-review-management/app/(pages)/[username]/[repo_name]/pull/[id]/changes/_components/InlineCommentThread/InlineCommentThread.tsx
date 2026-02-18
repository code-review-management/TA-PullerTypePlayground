import {
  MockPublishedComment,
  MockPublishedThread,
} from "@/mocks/types/comments";
import InlineCommentItem from "../InlineCommentItem/InlineCommentItem";
import styles from "./InlineCommentThread.module.css";

export default function InlineCommentThread({
  thread,
}: {
  thread: MockPublishedThread;
}) {
  return (
    <div>
      <span className={styles.threadHeader}>{getThreadHeader(thread)}</span>
      <div className={styles.commentList}>
        {thread.comments.map((comment: MockPublishedComment) => (
          <InlineCommentItem
            key={comment.id}
            username={comment.user.login}
            body={comment.body}
            createdAt={comment.created_at}
          />
        ))}
      </div>
    </div>
  );
}

function getThreadHeader(thread: MockPublishedThread) {
  if (!thread.line && !thread.side) return "File comment";

  const formatSide = (side: string) => (side === "RIGHT" ? "R" : "L");
  const endRange = `${formatSide(thread.side!)}${thread.line}`;

  if (thread.start_side && thread.start_line && thread.start_line !== thread.line) {
    const startRange = `${formatSide(thread.start_side)}${thread.start_line}`;
    return `Thread on lines ${startRange} to ${endRange}`;
  }

  return `Thread on line ${endRange}`;
}
