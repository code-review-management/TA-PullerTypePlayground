import { Button } from "@mui/material";

/**
 * TODO: remove hard-coded styling.
 */

export default function PublishedOptionsMenu({
  enableEditMode,
}: {
  enableEditMode: () => void;
}) {
  const STYLE_BUTTON_FONT_SIZE = "0.65rem";
  const STYLE_BUTTON_HEIGHT = 20;

  return (
    <Button
      variant="contained"
      sx={{ fontSize: STYLE_BUTTON_FONT_SIZE, height: STYLE_BUTTON_HEIGHT }}
      onClick={enableEditMode}
    >
      Edit
    </Button>
  );
}
