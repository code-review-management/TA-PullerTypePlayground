import Image from "next/image";
import LockIcon from "@/public/icons/lock.svg";
import styles from "./ReadOnlyToast.module.css";

export default function ReadOnlyToast() {
  return (
    <div className={styles.toast}>
      <Image src={LockIcon} alt="Lock" width={14} className={styles.lock} />
      <div className={styles.text}>
        Read-only mode
        <div className={styles.description}>GitHub App not installed</div>
      </div>
    </div>
  );
}
