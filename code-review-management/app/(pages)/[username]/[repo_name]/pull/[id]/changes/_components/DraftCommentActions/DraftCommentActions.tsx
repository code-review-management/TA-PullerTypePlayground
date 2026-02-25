import Image from "next/image";
import ArrowUpIcon from "@/public/icons/arrow_up.svg";
import styles from "./DraftCommentActions.module.css";

export default function DraftCommentActions() {
  return (
    <button className={styles.publish}>
      <Image src={ArrowUpIcon} alt="Arrow up" />
    </button>
  );
}
