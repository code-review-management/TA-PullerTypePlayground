import styles from "./InlineCommentItem.module.css";

export default function InlineCommentItem({
  username,
  body,
  createdAt,
}: {
  username: string;
  body: string;
  createdAt: string;
}) {
  return (
    <div className={styles.comment}>
      <div className={styles.commentHeader}>
        <span>{username}</span>
        <span>{createdAt}</span>
      </div>
      <div>{body}</div>
    </div>
  );
}
