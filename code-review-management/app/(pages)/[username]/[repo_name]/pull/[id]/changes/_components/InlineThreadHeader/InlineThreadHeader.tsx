import { ReactNode } from "react";
import styles from "./InlineThreadHeader.module.css";

/**
 * A header for an inline thread of comments. Rendered above the thread to
 * display which lines and side that the thread is anchored to.
 *
 * @param title: Text to display on the header.
 * @param actions: Action components to display on the right-side of the header.
 * @param anchorHref: Optional URL linking to anchored location.
 */
export default function InlineThreadHeader({
  title,
  actions,
  anchorHref,
}: {
  title: string;
  actions?: ReactNode;
  anchorHref?: string;
}) {
  const threadHeader = (
    <div className={styles.header}>
      {title}
      {actions}
    </div>
  );

  const handleAnchorClick = () => {
    if (window.location.hash === anchorHref) {
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  };

  return (
    <>
      {anchorHref ? (
        <a
          href={anchorHref}
          className={styles.headerAnchor}
          onClick={handleAnchorClick}
        >
          {threadHeader}
        </a>
      ) : (
        threadHeader
      )}
    </>
  );
}
