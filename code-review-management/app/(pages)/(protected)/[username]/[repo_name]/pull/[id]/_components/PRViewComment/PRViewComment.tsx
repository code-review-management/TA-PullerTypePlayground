import styles from "./PRViewComment.module.css";
import MarkdownEditor from "@/app/(pages)/_components/MarkdownEditor/MarkdownEditor";
import UserIcon from "@/app/(pages)/_components/UserIcon/UserIcon";
import { formatDate } from "../../_utils/date-utils";

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
  avatarUrl,
  inTimeline,
}: {
  username: string;
  createdAt: string;
  description: string;
  avatarUrl?: string;
  inTimeline?: boolean;
}) {
  const formattedDate = formatDate(new Date(createdAt));
  return (
    <div className={styles.comment}>
      <div className={`${inTimeline && styles.userIconBackground}`}>
        <UserIcon
          avatarUrl={avatarUrl || "/mock/octocat.png"}
          username={username}
          size={25}
        />
      </div>
      <div className={styles.commentContent}>
        <div className={styles.usernameAndDate}>
          <h5 className={styles.username}>{username}</h5>
          <p className={styles.date}>{formattedDate}</p>
        </div>
        <MarkdownEditor defaultEditable={false} defaultContent={description} />
      </div>
    </div>
  );
}
