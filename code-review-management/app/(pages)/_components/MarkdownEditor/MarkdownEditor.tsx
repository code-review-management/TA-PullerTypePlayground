"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { Markdown } from "@tiptap/markdown";
import StarterKit from "@tiptap/starter-kit";
import "./MarkdownEditor.css";

/**
 * Docs:
 * 1. https://tiptap.dev/docs/editor/getting-started/install/nextjs
 * 2. https://tiptap.dev/docs/editor/markdown/getting-started/installation
 *
 * TODO: Configure GitHub Flavored Markdown
 */
export default function MarkdownEditor({
  content,
  editable,
}: {
  content: string;
  editable: boolean;
}) {
  const editor = useEditor({
    extensions: [StarterKit, Markdown],
    editable: editable,
    content: content,
    contentType: "markdown",
    immediatelyRender: false,
  });

  return <EditorContent editor={editor} />;
}
