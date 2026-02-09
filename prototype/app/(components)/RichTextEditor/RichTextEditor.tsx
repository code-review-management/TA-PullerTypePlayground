"use client";

import { Box } from "@mui/material";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import "./RichTextEditor.css";

/**
 * Documentation:
 * 1. https://tiptap.dev/docs/editor/getting-started/install/nextjs#integrate-tiptap
 * - Referenced to setup Tiptap editor.
 */

export default function RichTextEditor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello World!</p>",
    immediatelyRender: false,
  });

  return (
    <Box
      sx={{
        margin: "8px",
        border: "1px solid rgb(235, 235, 235)",
        borderRadius: "8px",
      }}
    >
      <EditorContent editor={editor} />
    </Box>
  );
}
