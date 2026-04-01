import MarkdownEditor from "@/app/(pages)/_components/MarkdownEditor/MarkdownEditor";
import styles from "./DiscussionBox.module.css";
import { useState } from "react";

/**
 * Discussion box component present on the Timeline section of the PR view page.
 * TODO: Add commenting functionality
 */
export default function DiscussionBox() {
  const [discussionBoxContent, setDiscussionBoxContent] = useState("");

  console.log(discussionBoxContent); // TODO: Remove this debug print

  return (
    <form className={styles.form}>
      <MarkdownEditor
        autofocus={false}
        defaultEditable={true}
        placeholder="Add a discussion comment"
        onChange={(content: string) => setDiscussionBoxContent(content)}
      />
    </form>
  );
}
