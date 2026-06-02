import { Button } from "@mui/material";

export default function PublishedOptionsMenu({
  enableEditMode,
}: {
  enableEditMode: () => void;
}) {
  const STYLE_BUTTON_FONT_SIZE = "0.85rem";
  const STYLE_BUTTON_WIDTH = 15;

  return (
    <Button
      variant="contained"
      sx={{ fontSize: STYLE_BUTTON_FONT_SIZE, height: STYLE_BUTTON_WIDTH }}
      onClick={enableEditMode}
    >
      Edit
    </Button>
  );
}
