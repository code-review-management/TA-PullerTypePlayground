import { ReactNode } from "react";
import styles from "./InlineThreadHeader.module.css";

/**
 * A header for an inline thread of comments. Rendered above the thread to
 * display which lines and side that the thread is anchored to.
 *
 * @param title: Text to display on the header.
 * @param actions: Action components to display on the right-end of the header.
 */
export default function InlineThreadHeader({
  title,
  actions,
}: {
  title: string;
  actions?: ReactNode;
}) {
  return (
    <div className={styles.header}>
      {title}
      {actions}
    </div>
  );
}
