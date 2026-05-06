import MarkdownEditor from "@/app/(pages)/_components/MarkdownEditor/MarkdownEditor";
import styles from "./DiscussionBox.module.css";
import { useState } from "react";
import DiscussionEditorActions from "../DiscussionEditorActions/DiscussionEditorActions";

/**
 * Discussion box component present on the Timeline section of the PR view page.
 * TODO: Add commenting functionality
 */
export default function DiscussionBox() {
  const [discussionBoxContent, setDiscussionBoxContent] = useState("");
  const [resetKey, setResetKey] = useState(0);

  function resetDiscussionBox() {
    setDiscussionBoxContent("");
    setResetKey((resetKey) => resetKey + 1);
  }

  return (
    <div className={styles.discussionBox}>
      <MarkdownEditor
        key={resetKey}
        autofocus={false}
        defaultEditable={true}
        placeholder="Add a discussion comment"
        onChange={(content: string) => setDiscussionBoxContent(content)}
        actions={
          <DiscussionEditorActions
            editorContent={discussionBoxContent}
            onSuccess={resetDiscussionBox}
          />
        }
      />
    </div>
  );
}
