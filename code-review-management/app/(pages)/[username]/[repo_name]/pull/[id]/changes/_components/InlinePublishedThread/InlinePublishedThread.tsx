import { useSession } from "next-auth/react";
import { useDraftRepliesContext } from "../../_contexts/DraftRepliesContext";
import { DraftReplyItem, getDraftReplyKey } from "../../_hooks/useDraftReplies";
import { PublishedThreadItem } from "../../_hooks/usePublishedThreads";
import { getBasename } from "../../_utils/comment-utils";
import DraftEditorActions from "../DraftEditorActions/DraftEditorActions";
import InlineCommentEntry from "../InlineCommentEntry/InlineCommentEntry";
import InlineDraftReplyTrigger from "../InlineDraftReplyTrigger/InlineDraftReplyTrigger";
import InlineThreadHeader from "../InlineThreadHeader/InlineThreadHeader";
import styles from "./InlinePublishedThread.module.css";

type ThreadViewType = "inline" | "panel";

/**
 * Displays a published thread that is anchored to specific lines in a file diff.
 *
 * @param thread: `PublishedThreadItem` object containing data about the published thread.
 * @param viewType: Where the published thread is rendered.
 */
export default function InlinePublishedThread({
  thread,
  viewType,
}: {
  thread: PublishedThreadItem;
  viewType: ThreadViewType;
}) {
  const { draftReplies } = useDraftRepliesContext();
  const draftReplyKey = getDraftReplyKey(thread.path, thread.id);
  const isDraftingReply = draftReplyKey in draftReplies;

  return (
    <div
      className={styles.thread}
      {...(viewType === "inline" && { id: `thread-${thread.id}` })}
    >
      <InlineThreadHeader
        title={getThreadTitle(thread, viewType)}
        {...(viewType === "panel" && { anchorHref: `#thread-${thread.id}` })}
      />
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
        {viewType === "inline" && ( // Reply option currently supported only for inline threads.
          <>
            {isDraftingReply ? (
              <InlineDraftReplyEntry reply={draftReplies[draftReplyKey]} />
            ) : (
              <InlineDraftReplyTrigger thread={thread} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function InlineDraftReplyEntry({ reply }: { reply: DraftReplyItem }) {
  const { data: session } = useSession();
  return (
    <InlineCommentEntry
      avatar={session?.user.image ?? "/mock/octocat.png"}
      username={session?.user.githubLogin ?? ""}
      defaultEditable={true}
      actions={
        <DraftEditorActions
          draft={{
            type: "reply",
            payload: reply,
          }}
        />
      }
    />
  );
}

function getThreadTitle(thread: PublishedThreadItem, viewType: ThreadViewType) {
  const basename = getBasename(thread.path);

  // Placeholder in case the ending line and side are undefined.
  if (!thread.line && !thread.side) {
    return viewType === "inline" ? "File thread" : basename;
  }

  const formatSide = (side: string) => (side === "RIGHT" ? "R" : "L");
  const endRange = `${formatSide(thread.side!)}${thread.line}`;

  // Starting line and side are undefined when it is not a multi-line comment.
  if (
    thread.start_side &&
    thread.start_line &&
    thread.start_line !== thread.line
  ) {
    const startRange = `${formatSide(thread.start_side)}${thread.start_line}`;
    return viewType === "inline"
      ? `Thread on lines ${startRange} to ${endRange}`
      : `${getBasename(thread.path)}: ${startRange} to ${endRange}`;
  }

  return viewType === "inline"
    ? `Thread on line ${endRange}`
    : `${getBasename(thread.path)}: ${endRange}`;
}
