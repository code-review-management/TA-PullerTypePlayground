import InlineCommentEntry from "../InlineCommentEntry/InlineCommentEntry";
import { MockPublishedComment } from "@/mocks/types/comments";

/**
 * Displays a comment that is part of a published thread, anchored to specific
 * lines in a file diff.
 * 
 * @param comment: `MockPublishedComment` object containing data about the published comment.
 */
export default function InlinePublishedComment({
  comment,
}: {
  comment: MockPublishedComment;
}) {
  return (
    <InlineCommentEntry
      avatar={comment.user.avatar_url}
      username={comment.user.login}
      created={comment.created_at}
      body={comment.body}
      editable={false}
    />
  );
}
