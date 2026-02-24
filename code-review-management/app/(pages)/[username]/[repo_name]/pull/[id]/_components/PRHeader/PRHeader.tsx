import HeaderButton from "@/app/(pages)/_components/HeaderButton/HeaderButton";
import styles from "./PRHeader.module.css";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

/**
 * Header for PR view page.
 * TODO: Add callback as onClick to Merge button.
 */
export default function PRHeader() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const params = useParams();
  const { username, repo_name, id } = params;

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
      <HeaderButton
        href={`/${username}/${repo_name}/pull/${id}/changes`}
        variant="secondary"
      >
        View files
      </HeaderButton>
      <HeaderButton
        href={`/${username}/${repo_name}/pull/${id}/changes`}
        variant="secondary"
      >
        Add review
      </HeaderButton>
      <HeaderButton>Merge</HeaderButton>
    </div>
  );
}
