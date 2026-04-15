import { ReactNode, useEffect, useState } from "react";
import IconTooltip from "../IconTooltip/IconTooltip";
import styles from "./PageHeader.module.css";

/**
 * Sticky header for a page.
 *
 * @param leftChildren: Children to display on the left side of the header.
 * @param rightChildren: Children to display on the right side of the header.
 * @param className: Optional styling classes to apply to the header container.
 */
export default function PageHeader({
  leftChildren,
  rightChildren,
  className,
}: {
  leftChildren?: ReactNode;
  rightChildren?: ReactNode;
  className?: string;
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  // On scroll, check the scrollY to determine whether to show box shadow or not.
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.removeEventListener("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        className={`${styles.header} ${isScrolled && styles.shadow} ${className || ""}`}
      >
        <div className={styles.group}>{leftChildren}</div>
        <div className={styles.group}>{rightChildren}</div>
      </div>
      <IconTooltip id="page-header" />
    </>
  );
}
