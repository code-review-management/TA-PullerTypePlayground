import { ReactNode, useEffect, useState } from "react";
import styles from "./PageHeader.module.css";

export default function PageHeader({
  leftChildren,
  rightChildren,
}: {
  leftChildren?: ReactNode;
  rightChildren?: ReactNode;
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
    <div className={`${styles.header} ${isScrolled && styles.shadow}`}>
      <div className={styles.group}>{leftChildren}</div>
      <div className={styles.group}>{rightChildren}</div>
    </div>
  );
}
