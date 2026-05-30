import { Stack } from "@mui/material";
import { Editor, EditorContent } from "@tiptap/react";
import DraftCommentActions from "./DraftCommentActions";

import "./CommentEditor.css";

/**
 * TODO: show different comment actions for editing already published comments
 *       vs. new comments in creation.
 * TODO: remove hard-coded styling.
 */

export default function CommentEditor({
  editor,
  isEditEnabled,
  handlePublishDraft,
}: {
  editor: Editor | null;
  isEditEnabled: boolean;
  handlePublishDraft: () => void;
}) {
  const STYLE_UNFOCUSED_BORDER_COLOR = "rgb(214, 214, 214)";
  const STYLE_FOCUSED_COLOR = "rgb(57, 135, 214)";

  return (
    <Stack
      sx={{
        ...(isEditEnabled && {
          borderWidth: 3,
          borderRadius: 3,
          "&:not(:focus-within)": {
            borderColor: STYLE_UNFOCUSED_BORDER_COLOR,
          },
          "&:focus-within": {
            outline: `1.5px solid ${STYLE_FOCUSED_COLOR}`,
            borderColor: "transparent",
          },
        }),
      }}
    >
      <EditorContent editor={editor} />
      {/* TODO: show different comment actions for drafts vs. already published comments */}
      {isEditEnabled && (
        <DraftCommentActions handlePublishDraft={handlePublishDraft} />
      )}
    </Stack>
  );
}
