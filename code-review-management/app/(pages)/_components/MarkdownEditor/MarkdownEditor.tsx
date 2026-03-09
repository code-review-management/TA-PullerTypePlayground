"use client";

import { ReactNode, useEffect, useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import { Markdown } from "@tiptap/markdown";
import StarterKit from "@tiptap/starter-kit";
import MarkdownEditorContext from "./MarkdownEditorContext";
import styles from "./MarkdownEditor.module.css";
import "./TiptapEditor.css";

/**
 * A Markdown renderer/editor used to display and write comments.
 *
 * Docs:
 * 1. https://tiptap.dev/docs/editor/getting-started/install/nextjs
 * 2. https://tiptap.dev/docs/editor/markdown/getting-started/installation
 *
 * TODO: Configure GitHub Flavored Markdown
 *
 * @param defaultEditable: Whether the editor should be editable on initial render.
 * @param defaultContent: Content to display in the editor on initial render.
 * @param actions: Action buttons to render below the editor content when it is
 *                 editable (e.g., publish or cancel buttons).
 */
export default function MarkdownEditor({
  defaultEditable,
  defaultContent,
  actions,
  onChange,
}: {
  defaultEditable: boolean;
  defaultContent?: string;
  actions?: ReactNode;
  onChange?: (markdown: string) => void;
}) {
  const [editable, setEditable] = useState(defaultEditable);
  const [editorContent, setEditorContent] = useState(defaultContent ?? "");
  const [editorReady, setEditorReady] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Markdown],
    editable: defaultEditable,
    content: defaultContent,
    contentType: "markdown",
    immediatelyRender: false,
    autofocus: "end",
    onCreate: () => {
      setEditorReady(true);
    },
    onUpdate: ({ editor }: { editor: Editor }) => {
      const markdown = editor.getMarkdown();
      setEditorContent(markdown);
      if (onChange) {
        onChange(markdown);
      }
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  // Docs: https://github.com/ueberdosis/tiptap/issues/5068#issuecomment-2465958436
  const handleEditorClick = () => {
    if (editor && !editor.isFocused) {
      editor.commands.focus("end");
    }
  };

  return (
    <MarkdownEditorContext
      value={{
        editorContent,
        setEditable,
      }}
    >
      <div
        className={editable ? styles.editable : ""}
        style={{ visibility: editorReady ? "visible" : "hidden" }}
        onClick={handleEditorClick}
      >
        <EditorContent editor={editor} />
        {editable && actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </MarkdownEditorContext>
  );
}
