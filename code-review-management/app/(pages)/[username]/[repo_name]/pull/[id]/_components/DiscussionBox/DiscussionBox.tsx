import styles from "./DiscussionBox.module.css";

/**
 * Discussion box component present on the Timeline section of the PR view page.
 * TODO: Add commenting functionality and update UI to use markdown editor and buttons
 */
export default function DiscussionBox() {
  return (
    <textarea
      placeholder="Add a discussion comment"
      className={styles.discussionBox}
    ></textarea>
  );
}
