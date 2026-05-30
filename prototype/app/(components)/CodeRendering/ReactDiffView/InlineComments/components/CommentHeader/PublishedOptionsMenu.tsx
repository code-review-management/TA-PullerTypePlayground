import { Button } from "@mui/material";

/**
 * TODO: remove hard-coded styling.
 * TODO: Update width and height.
 */

export default function PublishedOptionsMenu({
  enableEditMode,
}: {
  enableEditMode: () => void;
}) {
  const STYLE_BUTTON_FONT_SIZE = "1rem";
  const STYLE_BUTTON_WIDTH = 20;
  const STYLE_BUTTON_HEIGHT = 15;

  return (
    <Button
      variant="contained"
      sx={{
        fontSize: STYLE_BUTTON_FONT_SIZE,
        height: STYLE_BUTTON_HEIGHT,
        width: STYLE_BUTTON_WIDTH,
      }}
      onClick={enableEditMode}
    >
      Edit
    </Button>
  );
}
