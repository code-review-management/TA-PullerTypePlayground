import { ReactNode } from "react";
import { formatDate } from "../../../_utils/date-utils";
import { extractSuggestions } from "../CommentSuggestionEntry/suggestionParser";
import { SuggestionReplacementWidget } from "../CommentSuggestionEntry/SuggestionReplacementWidget";
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
 * (e.g., false for published comments and true for
 * draft comments)
 * @param defaultContent: Contents of the comment. Can be empty for newly
 *                        created drafts.
 * @param activePath: Path of the file being commented on. Used to highlight llm suggestions
 * @param editorActions: Action buttons to render below the editor content when
 *                       it is editable (e.g., publish buttons).
 * @param headerActions: Action buttons to render on the right-side of the
 *                       comment header.
 */
export default function InlineCommentEntry({
  avatar,
  username,
  created,
  defaultEditable,
  defaultContent,
  activePath,
  editorActions,
  headerActions,
}: {
  avatar: string;
  username: string;
  created?: string;
  defaultEditable: boolean;
  defaultContent?: string;
  activePath?: string;
  editorActions?: ReactNode;
  headerActions?: ReactNode;
}) {
  const suggestiveComment = defaultContent 
    ? extractSuggestions(defaultContent) : 
    { 
      hasSuggestion: false, 
      relativeStartLine: 0,
      deletionContent: "",
      additionContent: ""
    };
  
  if (!activePath) activePath = "";

  return (
    <div className={styles.comment}>
      <UserIcon avatarUrl={avatar} username={username} size={22} />
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.metadata}>
            <span className={styles.username}>{username}</span>
            {created && (
              <span className={styles.date}>
                {formatDate(new Date(created))}
              </span>
            )}
          </div>
          {headerActions}
        </div>
        
        {(suggestiveComment.hasSuggestion && false) ? (
          <SuggestionReplacementWidget
            suggestion={suggestiveComment}
            activePath={activePath}  
          />
        ) : (
          <MarkdownEditor
            defaultEditable={defaultEditable}
            defaultContent={defaultContent}
            actions={editorActions}
          />
        )}
      </div>
    </div>
  );
}
