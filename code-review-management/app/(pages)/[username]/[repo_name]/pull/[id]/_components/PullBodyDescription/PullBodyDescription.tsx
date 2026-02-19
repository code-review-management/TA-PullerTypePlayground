import Comment from "../Comment/Comment";
import styles from "./PullBodyDescription.module.css";

/**
 * The description of a pull request as displayed on the PR View page.
 * @param username: The username of the user who created the PR (and therefore wrote the first comment).
 * @param createdAt: The date/time the PR was created.
 * @param description: The description of the pull request, aka the content of the first comment.
 */
export default function PullBodyDescription({
  username,
  createdAt,
  description,
}: {
  username: string;
  createdAt: string;
  description: string;
}) {
  return (
    <div className={styles.pullBodyDescription}>
      <h4 className={styles.sectionTitle}>Description</h4>
      <Comment
        username={username}
        createdAt={createdAt}
        description={description}
      />
    </div>
  );
}
