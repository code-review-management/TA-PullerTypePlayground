"use client";

import { ReactNode } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { Markdown } from "@tiptap/markdown";
import StarterKit from "@tiptap/starter-kit";

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
  editable,
  content,
  actions,
}: {
  editable: boolean;
  content?: string;
  actions?: ReactNode;
}) {
  const editor = useEditor({
    extensions: [StarterKit, Markdown],
    editable,
    content,
    contentType: "markdown",
    immediatelyRender: false,
    autofocus: "end",
  });

  return (
    <div className={`${styles.editor} ${editable && styles.editable}`}>
      <EditorContent editor={editor} />
      {editable && actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
