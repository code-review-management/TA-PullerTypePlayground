import MarkdownEditor from "@/app/(pages)/_components/MarkdownEditor/MarkdownEditor";
import styles from "./DiscussionBox.module.css";
import { useState } from "react";

/**
 * Discussion box component present on the Timeline section of the PR view page.
 * TODO: Add commenting functionality and update UI to use markdown editor and buttons
 */
export default function DiscussionBox() {
  const [discussionBoxContent, setDiscussionBoxContent] = useState("");

  return (
    <form className={styles.form}>
      <MarkdownEditor
        autofocus={false}
        defaultEditable={true}
        onChange={(content: string) => setDiscussionBoxContent(content)}
      />
    </form>
    // <textarea
    //   placeholder="Add a discussion comment"
    //   className={styles.discussionBox}
    // ></textarea>
  );
}
