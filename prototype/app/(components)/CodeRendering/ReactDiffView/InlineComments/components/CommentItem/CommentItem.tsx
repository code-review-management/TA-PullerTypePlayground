"use client";

import { useState } from "react";
import { Avatar, Divider, Stack } from "@mui/material";
import { useEditor } from "@tiptap/react";
import { Placeholder } from "@tiptap/extensions";
import StarterKit from "@tiptap/starter-kit";
import CommentEditor from "../CommentEditor/CommentEditor";
import CommentHeader from "../CommentHeader/CommentHeader";

/**
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
 * TODO: handle attempts to save empty comments.
 * TODO: remove hard-coded styling.
 */

type CommentItemProps =
  | { type: "is-draft"; username: string }
  | { type: "is-published"; username: string; content: string; date: string };

export default function CommentItem(props: CommentItemProps) {
  const STYLE_AVATAR_SIZE = 14;
  const STYLE_AVATAR_MT = "4px";

  const isEditableDefault = props.type === "is-draft";
  const [isEditEnabled, setEditEnabled] = useState(isEditableDefault);

  const enableEditMode = () => {
    setEditEnabled(true);
    editor?.setEditable(true);
    editor?.commands.focus("end");
  };

  const handlePublishDraft = () => {
    setEditEnabled(false);
    editor?.setEditable(false);
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write a comment...",
      }),
    ],
    editable: isEditableDefault,
    ...(props.type === "is-published" && {
      content: props.content,
    }),
    autofocus: "end",
    immediatelyRender: false,
  });

  return (
    <Stack direction="row">
      <Stack sx={{ alignItems: "center" }}>
        <Avatar
          src="/mock-avatar.png"
          sx={{
            width: STYLE_AVATAR_SIZE,
            height: STYLE_AVATAR_SIZE,
            mt: STYLE_AVATAR_MT,
          }}
        />
        <Divider orientation="vertical" sx={{ flex: 1, mt: 1 }} />
      </Stack>

      <Stack spacing={isEditEnabled ? 1 : 0.5} sx={{ flex: 1 }}>
        {props.type === "is-draft" ? (
          <CommentHeader
            type="is-draft"
            editor={editor}
            username={props.username}
          />
        ) : (
          <CommentHeader
            type="is-published"
            editor={editor}
            isEditEnabled={isEditEnabled}
            username={props.username}
            date={props.date}
            enableEditMode={enableEditMode}
          />
        )}
        <CommentEditor
          editor={editor}
          isEditEnabled={isEditEnabled}
          handlePublishDraft={handlePublishDraft}
        />
      </Stack>
    </Stack>
  );
}
