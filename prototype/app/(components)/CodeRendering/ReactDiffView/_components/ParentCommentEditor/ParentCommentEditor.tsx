"use client";

import { useState } from "react";
import { Avatar, Button, IconButton, Stack, Typography } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Placeholder } from "@tiptap/extensions";
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
 * Very messy just prototyping!
 *
 * Documentation:
 * 1. https://tiptap.dev/docs/editor/getting-started/install/nextjs#integrate-tiptap
 * - Referenced to setup Tiptap editor.
 *
 * 2. https://tiptap.dev/docs/editor/api/editor#seteditable
 * - Referenced to update editable state of editor.
 *
 * 3. https://tiptap.dev/docs/editor/extensions/functionality/placeholder?gad_source=1&gad_campaignid=22014820935&gbraid=0AAAAAqkAF27TH7RLIwwHMjrMW-KIJbiQj&gclid=CjwKCAiAqKbMBhBmEiwAZ3UboMM1YGoZisSQkqBLsUDt_MQqa6NvrmVfpJM9gMQQD9L_BUzTcorkGRoCQ9oQAvD_BwE
 * - Referenced to add a placeholder.
 *
 * TODO: handle empty comments and saves
 * TODO: change add to review to checkbox
 * TODO: change edit to icon with dropdown options
 * TODO: draft comments w/ react state
 * TODO: make background clearer
 * TODO: MUI themes instead of hardcoding values
 */

const BUTTON_FONT_SIZE = "0.65rem";
const BUTTON_HEIGHT = "20px";

export default function ParentCommentEditor() {
  const [isEditable, setIsEditable] = useState(true);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write a comment...",
      }),
    ],
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
    <Stack direction="row" margin="10px">
      <Avatar
        sx={{ width: 14, height: 14, paddingTop: "4px" }}
        src="/mock-avatar.png"
      />

      <Stack spacing={0.5} flex={1}>
        <CommentHeader
          isEditable={isEditable}
          editor={editor}
          handleEdit={handleEdit}
        />
        <CommentEditor
          isEditable={isEditable}
          editor={editor}
          handleSave={handleSave}
        />
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
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Stack direction="row" alignItems="center">
        <Typography
          sx={{
            fontSize: "12px",
            paddingLeft: "8px",
            fontWeight: 600,
            color: "text.secondary",
          }}
        >
          octocat
        </Typography>
        {!isEditable && (
          <Typography
            sx={{
              fontSize: "11px",
              paddingLeft: "8px",
              color: "text.secondary",
            }}
          >
            Feb 9, 2026
          </Typography>
        )}
      </Stack>

      {isEditable ? (
        <Stack direction="row" spacing={1}>
          <MenuBar editor={editor} />
        </Stack>
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
  handleSave,
}: {
  isEditable: boolean;
  editor: Editor | null;
  handleSave: () => void;
}) {
  return (
    <Stack
      sx={{
        ...(isEditable && {
          border: "1px solid rgb(225, 222, 222)",
          borderRadius: "4px",
        }),
      }}
    >
      <EditorContent editor={editor} />
      {isEditable && (
        <CommentActions isEditable={isEditable} handleSave={handleSave} />
      )}
    </Stack>
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
        <Stack
          direction="row"
          alignSelf="flex-end"
          spacing={1}
          sx={{ margin: "8px" }}
        >
          <Button
            variant="outlined"
            sx={{ fontSize: BUTTON_FONT_SIZE, height: BUTTON_HEIGHT }}
            onClick={handleSave}
          >
            Add to review
          </Button>
          <IconButton
            size="small"
            sx={{
              p: 0,
              backgroundColor: "primary.main",
              color: "primary.contrastText",
            }}
            onClick={handleSave}
          >
            <KeyboardArrowUpIcon fontSize="small" />
          </IconButton>
        </Stack>
      )}
    </>
  );
}
