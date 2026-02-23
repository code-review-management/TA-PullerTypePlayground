import Image from "next/image";
import MarkdownEditor from "@/app/(pages)/_components/MarkdownEditor/MarkdownEditor";
import { MockPublishedComment } from "@/mocks/types/comments";
import styles from "./InlineCommentItem.module.css";

export default function InlineCommentItem({
  comment,
}: {
  comment: MockPublishedComment;
}) {
  return (
    <div className={styles.comment}>
      <div className={styles.userIcon}>
        <Image
          src={comment.user.avatar_url}
          alt={`@${comment.user.login}`}
          fill
        />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.login}>{comment.user.login}</span>
          <span className={styles.date}>
            {/* TODO: Change date format. */}
            {new Date(comment.created_at).toDateString()}
          </span>
        </div>
        <MarkdownEditor content={comment.body} editable={false} />
      </div>
    </div>
  );
}
