import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import styles from "./InlineDraftReply.module.css";

export default function InlineDraftReply({
  setIsDraftingReply,
}: {
  setIsDraftingReply: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className={styles.comment}>
      <div className={styles.avatar}>
        <Image src={"/mock/octocat.png"} alt={`@octocat`} fill />
      </div>
      <div
        className={styles.reply}
        onClick={() => setIsDraftingReply((prev) => !prev)}
      >
        Reply
      </div>
    </div>
  );
}
