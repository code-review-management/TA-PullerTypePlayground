import { ReactNode, useState } from "react";
import Image from "next/image";
import MarkdownEditor from "@/app/(pages)/_components/MarkdownEditor/MarkdownEditor";
import styles from "./InlineCommentEntry.module.css";

/**
 * Used to render published and draft comment entries.
 * 
 * @param avatar: The link/path to the avatar picture of the comment author.
 * @param username: Username of the comment author.
 * @param created: Date of comment creation.
 * @param editable: Whether the editor should be editable by default (e.g.,
 *                  false for published comments and true for draft comments)
 * @param content: Contents of the comment.
 */
export default function InlineCommentEntry({
  avatar,
  username,
  created,
  editableDef,
  content,
  actions,
}: {
  avatar: string;
  username: string;
  created: string;
  editableDef: boolean;
  content?: string;
  actions?: ReactNode;
}) {
  const [editable, setEditable] = useState(editableDef);

  return (
    <div className={styles.comment}>
      <div className={styles.avatar}>
        <Image src={avatar} alt={`@${username}`} fill />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.username}>{username}</span>
          <span className={styles.date}>
            {/* TODO: Change date format. Create utility function to get date text in desirable foramt. */}
            {new Date(created).toDateString()}
          </span>
        </div>
        <MarkdownEditor editable={editable} content={content} actions={actions} />
      </div>
    </div>
  );
}
