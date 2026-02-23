import Image from "next/image";
import InlineThreadHeader from "../InlineThreadHeader/InlineThreadHeader";
import MarkdownEditor from "@/app/(pages)/_components/MarkdownEditor/MarkdownEditor";
import { DraftThreadItem } from "../../_hooks/useDraftThreads";
import styles from "./InlineDraftThread.module.css";

/**
 * Displays a draft thread that is anchored to specific lines in a file diff.
 * Will eventually contain an editor where the user can draft a comment
 * associated with those lines, and begin a new thread upon submission.
 *
 * @param draft: `DraftThreadItem` object containing data about the draft thread.
 */
export default function InlineDraftThread({
  draft,
}: {
  draft: DraftThreadItem;
}) {
  return (
    <div className={styles.draft}>
      <InlineThreadHeader title={getDraftHeader(draft)} />
      <div className={styles.comment}>
        <div className={styles.userIcon}>
          <Image src="/mock/octocat.png" alt="@octocat" fill />
        </div>
        <div className={styles.content}>
          <div className={styles.header}>
            <span className={styles.login}>octocat</span>
            <span className={styles.date}>
              {/* TODO: Change date format. */}
              {new Date(draft.created).toDateString()}
            </span>
          </div>
          {/* TODO: Add placeholder to editor. */}
          <MarkdownEditor content={"Write a comment..."} editable={true} />
        </div>
      </div>
    </div>
  );
}

/**
 * Gets the header text for the draft thread. Indicates which sides and lines
 * the draft is anchored to.
 *
 * TODO: Only indicate the side ("R" or "L") if it is a modified file.
 * Otherwise, if it is a new file or deleted file, react-diff-view does not do a
 * split view, so it does not make sense to show "R" or "L".
 *
 * @param draft: `DraftThreadItem` object containing data about the draft thread.
 */
function getDraftHeader(draft: DraftThreadItem) {
  const side = draft.side === "new" ? "R" : "L";
  const end = `${side}${draft.end}`;

  if (draft.start !== draft.end) {
    const start = `${side}${draft.start}`;
    return `Draft on lines ${start} to ${end}`;
  }

  return `Draft on line ${end}`;
}
