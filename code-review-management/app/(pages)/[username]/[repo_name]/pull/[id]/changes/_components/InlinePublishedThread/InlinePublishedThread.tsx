import { useState } from "react";
import { PublishedThreadItem } from "../../_hooks/usePublishedThreads";
import InlineCommentEntry from "../InlineCommentEntry/InlineCommentEntry";
import InlineDraftReply from "../InlineDraftReply/InlineDraftReply";
import InlineThreadHeader from "../InlineThreadHeader/InlineThreadHeader";
import styles from "./InlinePublishedThread.module.css";

/**
 * Displays a published thread that is anchored to specific lines in a file diff.
 *
 * @param thread: `PublishedThreadItem` object containing data about the published thread.
 */
export default function InlinePublishedThread({
  thread,
}: {
  thread: PublishedThreadItem;
}) {
  const [isDraftingReply, setIsDraftingReply] = useState(false);

  return (
    <div className={styles.thread}>
      <InlineThreadHeader title={getThreadTitle(thread)} />
      <div className={styles.comments}>
        {thread.comments.map((comment) => (
          <InlineCommentEntry
            key={comment.id}
            avatar={comment.user.avatar_url}
            username={comment.user.login}
            created={comment.created_at}
            defaultEditable={false}
            defaultContent={comment.body}
          />
        ))}
        {!isDraftingReply ? (
          <InlineDraftReply setIsDraftingReply={setIsDraftingReply}/>
        ) : (
          <InlineCommentEntry
            avatar={"/mock/octocat.png"}
            username="octocat"
            created={new Date().toISOString()}
            defaultEditable={true}
          />
        )}
      </div>
    </div>
  );
}

function getThreadTitle(thread: PublishedThreadItem) {
  // Placeholder in case the ending line and side are undefined.
  if (!thread.line && !thread.side) return "File thread";

  const formatSide = (side: string) => (side === "RIGHT" ? "R" : "L");
  const endRange = `${formatSide(thread.side!)}${thread.line}`;

  // Starting line and side are undefined when it is not a multi-line comment.
  if (
    thread.start_side &&
    thread.start_line &&
    thread.start_line !== thread.line
  ) {
    const startRange = `${formatSide(thread.start_side)}${thread.start_line}`;
    return `Thread on lines ${startRange} to ${endRange}`;
  }

  return `Thread on line ${endRange}`;
}
