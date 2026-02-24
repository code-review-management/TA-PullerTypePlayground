import InlineCommentItem from "../InlineCommentItem/InlineCommentItem";
import { MockPublishedComment } from "@/mocks/types/comments";

export default function InlinePublishedComment({
  comment,
}: {
  comment: MockPublishedComment;
}) {
  return (
    <InlineCommentItem
      avatar={comment.user.avatar_url}
      username={comment.user.login}
      created={comment.created_at}
      body={comment.body}
      editable={false}
    />
  );
}
