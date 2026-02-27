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
  defaultEditable,
  defaultContent,
  actions,
}: {
  defaultEditable: boolean;
  defaultContent?: string;
  actions?: ReactNode;
}) {
  const [editorContent, setEditorContent] = useState(defaultContent ?? "");
  const [editable, setEditable] = useState(defaultEditable);

  const editor = useEditor({
    extensions: [StarterKit, Markdown],
    editable,
    content: editorContent,
    contentType: "markdown",
    immediatelyRender: false,
    autofocus: "end",
    onUpdate: ({ editor }: { editor: Editor }) => {
      setEditorContent(editor.getMarkdown());
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  return (
    <MarkdownEditorContext
      value={{
        editorContent,
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
