import styles from "./DiscussionBox.module.css";

export default function DiscussionBox() {
  return (
    <textarea
      placeholder="Add a discussion comment"
      className={styles.discussionBox}
    ></textarea>
  );
}
