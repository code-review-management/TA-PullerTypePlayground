import Image from "next/image";
import MarkdownEditor from "@/app/(pages)/_components/MarkdownEditor/MarkdownEditor";
import styles from "./InlineCommentEntry.module.css";

export default function InlineCommentEntry({
  avatar,
  username,
  created,
  body,
  editable,
}: {
  avatar: string;
  username: string;
  created: string;
  body: string;
  editable: boolean;
}) {
  return (
    <div className={styles.comment}>
      <div className={styles.avatar}>
        <Image src={avatar} alt={`@${username}`} fill />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.username}>{username}</span>
          <span className={styles.date}>
            {/* TODO: Change date format. Create utility function to convert date. */}
            {new Date(created).toDateString()}
          </span>
        </div>
        <MarkdownEditor content={body} editable={editable} />
      </div>
    </div>
  );
}
