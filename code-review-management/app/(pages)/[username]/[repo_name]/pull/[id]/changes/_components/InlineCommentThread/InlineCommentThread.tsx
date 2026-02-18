import { MockPublishedComment, MockPublishedThread } from "@/mocks/types/comments";
import InlineCommentItem from "../InlineCommentItem/InlineCommentItem";

export default function InlineCommentThread({ thread }: { thread: MockPublishedThread }) {
  return (
    <div>
      <p>{thread.start_line} {thread.line}</p>
      {thread.comments.map((comment: MockPublishedComment) => (
        <InlineCommentItem
          key={comment.id}
          username={comment.user.login}
          body={comment.body}
          createdAt={comment.created_at}
        />
      ))}
    </div>
  );
}
