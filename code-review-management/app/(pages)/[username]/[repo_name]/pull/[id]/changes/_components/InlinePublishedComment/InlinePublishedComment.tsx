import InlineCommentEntry from "../InlineCommentEntry/InlineCommentEntry";
import { MockPublishedComment } from "@/mocks/types/comments";

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
