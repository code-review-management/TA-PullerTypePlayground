import styles from "./InlineThreadHeader.module.css";

/**
 * A header for an inline thread of comments. Rendered above the thread to
 * display which lines and side that the thread is anchored to.
 * 
 * @param title: Text to display on the header. 
 */
export default function InlineThreadHeader({ title }: { title: string }) {
  return <div className={styles.header}>{title}</div>;
}
