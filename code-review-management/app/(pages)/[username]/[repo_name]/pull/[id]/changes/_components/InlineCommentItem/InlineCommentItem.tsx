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
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.username}>{username}</span>
        <span>{createdAt}</span>
      </div>
      <p>{body}</p>
    </div>
  );
}
