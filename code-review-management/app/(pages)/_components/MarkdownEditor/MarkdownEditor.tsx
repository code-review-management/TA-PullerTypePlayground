"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

/**
 * Docs:
 * 1. https://tiptap.dev/docs/editor/getting-started/install/nextjs
 */
export default function MarkdownEditor({ content }: { content: string }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    immediatelyRender: false,
    editable: false,
  });

  return <EditorContent editor={editor} />;
}
