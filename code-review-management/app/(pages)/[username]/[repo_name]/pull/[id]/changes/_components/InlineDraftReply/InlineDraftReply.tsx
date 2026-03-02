import Image from "next/image";
import styles from "./InlineDraftReply.module.css";

export default function InlineDraftReply() {
  return (
    <div className={styles.comment}>
      <div className={styles.avatar}>
        <Image src={"/mock/octocat.png"} alt={`@octocat`} fill />
      </div>
      <div className={styles.reply}>Reply</div>
    </div>
  );
}
