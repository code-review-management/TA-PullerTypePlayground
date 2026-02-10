"use client";

import { useState } from "react";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import {
  useEditor,
  EditorContent,
  Editor,
  type Editor as EditorType,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./_components/MenuBar/MenuBar";

import "./TiptapEditor.css";

/**
 * Documentation:
 * 1. https://tiptap.dev/docs/editor/getting-started/install/nextjs#integrate-tiptap
 * - Referenced to setup Tiptap editor.
 *
 * 2. https://tiptap.dev/docs/editor/api/editor#seteditable
 * - Referenced to update editable state of editor.
 *
 * TODO: Add placeholder instead of default content.
 */

// TODO: Add new MUI button themes
const BUTTON_FONT_SIZE = "0.7rem";
const BUTTON_HEIGHT = "24px";

export default function ParentCommentEditor() {
  const [isEditable, setIsEditable] = useState(true);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello World!</p>",
    immediatelyRender: false,
    autofocus: "end",
  });

  const handleEdit = () => {
    setIsEditable(true);
    editor?.setEditable(true);
    editor?.commands.focus("end");
  };

  const handleSave = () => {
    setIsEditable(false);
    editor?.setEditable(false);
  };

  return (
    <Stack direction="row" sx={{ padding: "12px 8px" }}>
      <Avatar
        sx={{ width: 18, height: 18, paddingTop: "4px" }}
        src="/mock-avatar.png"
      />

      <Stack spacing={1} flex={1}>
        <CommentHeader
          isEditable={isEditable}
          editor={editor}
          handleEdit={handleEdit}
        />
        <CommentEditor isEditable={isEditable} editor={editor} />
        <CommentActions isEditable={isEditable} handleSave={handleSave} />
      </Stack>
    </Stack>
  );
}

function CommentHeader({
  isEditable,
  editor,
  handleEdit,
}: {
  isEditable: boolean;
  editor: EditorType | null;
  handleEdit: () => void;
}) {
  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant="body2" sx={{ paddingLeft: "8px" }}>
        octocat
      </Typography>

      {isEditable ? (
        <MenuBar editor={editor} />
      ) : (
        <Button
          variant="contained"
          sx={{ fontSize: BUTTON_FONT_SIZE, height: BUTTON_HEIGHT }}
          onClick={handleEdit}
        >
          Edit
        </Button>
      )}
    </Stack>
  );
}

function CommentEditor({
  isEditable,
  editor,
}: {
  isEditable: boolean;
  editor: Editor | null;
}) {
  return (
    <Box
      sx={{
        ...(isEditable && {
          border: "1px solid rgb(225, 222, 222)",
          borderRadius: "4px",
        }),
      }}
    >
      <EditorContent editor={editor} />
    </Box>
  );
}

function CommentActions({
  isEditable,
  handleSave,
}: {
  isEditable: boolean;
  handleSave: () => void;
}) {
  return (
    <>
      {isEditable && (
        <Stack direction="row" alignSelf="flex-end" spacing={1}>
          <Button
            variant="outlined"
            sx={{ fontSize: BUTTON_FONT_SIZE, height: BUTTON_HEIGHT }}
            onClick={handleSave}
          >
            Add to review
          </Button>
          <Button
            variant="contained"
            sx={{ fontSize: BUTTON_FONT_SIZE, height: BUTTON_HEIGHT }}
            onClick={handleSave}
          >
            Publish
          </Button>
        </Stack>
      )}
    </>
  );
}
