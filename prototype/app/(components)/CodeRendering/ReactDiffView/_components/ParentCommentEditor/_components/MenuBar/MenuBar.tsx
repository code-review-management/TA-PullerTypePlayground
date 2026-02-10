import { ToggleButton, ToggleButtonGroup } from "@mui/material";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";

import { type Editor } from "@tiptap/react";

/**
 * Documentation:
 * 1. https://tiptap.dev/docs/examples/basics/formatting
 * - Referenced to test out basic formatting buttons.
 *
 * 2. https://mui.com/material-ui/react-toggle-button/
 * - Referenced for MUI ToggleButtonGroup.
 *
 * 3. https://mui.com/material-ui/api/toggle-button/
 * - Referenced for overriding default styling.
 */

export default function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  return (
    <ToggleButtonGroup
      size="small"
      sx={{
        ".MuiToggleButton-root": {
          height: "24px",
        },
        ".MuiSvgIcon-root": {
          fontSize: "1rem",
        },
        alignSelf: "flex-end",
      }}
    >
      <ToggleButton
        value="bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <FormatBoldIcon />
      </ToggleButton>
      <ToggleButton
        value="italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <FormatItalicIcon />
      </ToggleButton>
      <ToggleButton
        value="strike"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <StrikethroughSIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
