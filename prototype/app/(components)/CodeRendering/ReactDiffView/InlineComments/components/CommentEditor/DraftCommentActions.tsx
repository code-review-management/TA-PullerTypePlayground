import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Button, IconButton, Stack } from "@mui/material";

/**
 * These comment actions are only relevant for publishing a new comment, not
 * editing an already published comment.
 *
 * TODO: create component `PublishedCommentActions` for editing an already
 *       published comment.
 * TODO: change "Add to review" button to a checkbox.
 * TODO: create state to handle "Add to review" checkbox + enable/disable
 *       accordingly (fetch status via API).
 * TODO: remove hard-coded styling.
 */

export default function DraftCommentActions({
  handlePublishDraft,
}: {
  handlePublishDraft: () => void;
}) {
  const STYLE_CONTAINER_MARGIN = 0.75;
  const STYLE_BUTTON_FONT_SIZE = "0.65rem";
  const STYLE_BUTTON_HEIGHT = 20;

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ alignSelf: "flex-end", m: STYLE_CONTAINER_MARGIN }}
    >
      <Button
        variant="outlined"
        sx={{ fontSize: STYLE_BUTTON_FONT_SIZE, height: STYLE_BUTTON_HEIGHT }}
      >
        Add to review
      </Button>
      <button style={{ padding: "2px" }}>
        <KeyboardArrowUpIcon fontSize="small" />
      </button>
    </Stack>
  );
}
