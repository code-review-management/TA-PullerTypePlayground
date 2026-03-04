import Image from "next/image";
import styles from "./PRViewComment.module.css";
import UserIcon from "@/app/(pages)/_components/UserIcon/UserIcon";

/**
 * A minimalist comment component for display on the PR View page.
 * @param username: Username of the user who wrote the comment.
 * @param createdAt: The time that the comment was posted.
 * @param description: The text content for the comment. Currently supports HTML for markup.
 */
export default function PRViewComment({
  username,
  createdAt,
  description,
  inTimeline,
}: {
  username: string;
  createdAt: string;
  description: string;
  inTimeline?: boolean;
}) {
  return (
    <div className={styles.comment}>
      <div className={`${inTimeline && styles.userIconBackground}`}>
        <UserIcon avatarUrl="/mock/octocat.png" username="octocat" size={25} />
      </div>
      <div className={styles.commentContent}>
        <div className={styles.usernameAndDate}>
          <h5 className={styles.username}>{username}</h5>
          <p className={styles.date}>{createdAt}</p>
        </div>
        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    </div>
  );
}
