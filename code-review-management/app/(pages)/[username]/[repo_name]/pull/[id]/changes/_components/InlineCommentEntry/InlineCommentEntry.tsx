import { ReactNode } from "react";
import { formatDate } from "../../../_utils/date-utils";
import Image from "next/image";
import MarkdownEditor from "@/app/(pages)/_components/MarkdownEditor/MarkdownEditor";
import UserIcon from "@components/UserIcon/UserIcon";
import styles from "./InlineCommentEntry.module.css";

/**
 * Used to render published and draft comment entries.
 *
 * @param avatar: The link/path to the avatar picture of the comment author.
 * @param username: Username of the comment author.
 * @param created: Date of comment creation.
 * @param defaultEditable: Whether the editor should be editable by default
 *                         (e.g., false for published comments and true for
 *                         draft comments)
 * @param defaultContent: Contents of the comment. Can be empty for newly
 *                        created drafts.
 * @param actions: Action buttons to render below the editor content when it is
 *                 editable (e.g., publish or cancel buttons).
 */
export default function InlineCommentEntry({
  avatar,
  username,
  created,
  defaultEditable,
  defaultContent,
  actions,
}: {
  avatar: string;
  username: string;
  created?: string;
  defaultEditable: boolean;
  defaultContent?: string;
  actions?: ReactNode;
}) {
  return (
    <div className={styles.comment}>
      <UserIcon avatarUrl={avatar} username={username} size={22} />
      <div className={styles.avatar}>
        <Image src={avatar} alt={`@${username}`} fill />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.username}>{username}</span>
          {created && (
            <span className={styles.date}>{formatDate(new Date(created))}</span>
          )}
        </div>
        <MarkdownEditor
          defaultEditable={defaultEditable}
          defaultContent={defaultContent}
          actions={actions}
        />
      </div>
    </div>
  );
}
