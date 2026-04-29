import { ReactNode } from "react";
import { useChangesViewMode } from "../../_hooks/useChangesViewMode";
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
  const { mode } = useChangesViewMode();

  const threadHeader = (
    <div className={styles.header}>
      {title}
      {actions}
    </div>
  );

  const handleAnchorClick = () => {
    // If we click on a thread header, close its file-diff, and re-click on the
    // same thread header, the hash will not change and no scroll will be
    // triggered. Thus, manually dispatch a hash change event.
    // Docs: https://stackoverflow.com/a/15212106
    if (mode === "pr" && window.location.hash === anchorHref) {
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
