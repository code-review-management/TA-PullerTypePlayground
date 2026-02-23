import MarkdownEditor from "@/app/(pages)/_components/MarkdownEditor/MarkdownEditor";
import styles from "./InlineCommentItem.module.css";

export default function InlineCommentItem({
  username,
  createdAt,
  body,
}: {
  username: string;
  createdAt: string;
  body: string;
}) {
  return (
    <div className={styles.comment}>
      <div className={styles.header}>
        <span>{username}</span>
        <span>{createdAt}</span>
      </div>
      <MarkdownEditor content={body} />
    </div>
  );
}
