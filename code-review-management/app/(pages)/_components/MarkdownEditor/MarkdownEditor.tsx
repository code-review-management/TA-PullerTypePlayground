"use client";

import { ReactNode, useEffect, useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import { Markdown } from "@tiptap/markdown";
import StarterKit from "@tiptap/starter-kit";
import MarkdownEditorContext from "./MarkdownEditorContext";

import styles from "./MarkdownEditor.module.css";
import "./TiptapEditor.css";

/**
 * Docs:
 * 1. https://tiptap.dev/docs/editor/getting-started/install/nextjs
 * 2. https://tiptap.dev/docs/editor/markdown/getting-started/installation
 *
 * TODO: Configure GitHub Flavored Markdown
 */
export default function MarkdownEditor({
  editableDefault,
  content,
  actions,
}: {
  editableDefault: boolean;
  content?: string;
  actions?: ReactNode;
}) {
  const [editable, setEditable] = useState(editableDefault);

  const editor = useEditor({
    extensions: [StarterKit, Markdown],
    editable,
    content,
    contentType: "markdown",
    immediatelyRender: false,
    autofocus: "end",
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  return (
    <MarkdownEditorContext
      value={{
        getMarkdown: () => editor?.getMarkdown() ?? "",
        setEditable,
      }}
    >
      <div className={editable ? styles.editable : ""}>
        <EditorContent editor={editor} />
        {editable && actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </MarkdownEditorContext>
  );
}
