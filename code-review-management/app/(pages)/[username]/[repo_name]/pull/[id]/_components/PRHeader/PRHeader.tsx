import HeaderButton from "@/app/(pages)/_components/HeaderButton/HeaderButton";
import styles from "./PRHeader.module.css";
import { useEffect, useState } from "react";

/**
 * Header for PR view page.
 */
export default function PRHeader() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

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
    <div className={`${styles.PRHeader} ${isScrolled && styles.shadow}`}>
      <HeaderButton variant="secondary">View Files</HeaderButton>
      <HeaderButton variant="secondary">Add review</HeaderButton>
      <HeaderButton>Merge</HeaderButton>
    </div>
  );
}
