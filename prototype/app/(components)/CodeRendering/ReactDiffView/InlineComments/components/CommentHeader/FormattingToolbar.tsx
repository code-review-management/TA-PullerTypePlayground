import CodeIcon from "@mui/icons-material/Code";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
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
 * 
 * TODO: remove hard-coded styling.
 */

export default function FormattingToolbar({
  editor,
}: {
  editor: Editor | null;
}) {
  if (!editor) return null;

  return (
    <ToggleButtonGroup
      size="small"
      sx={{
        ".MuiToggleButton-root": {
          height: "20px",
        },
        ".MuiSvgIcon-root": {
          width: "1rem",
        },
        ".MuiSvgIcon-root": {
          fontSize: "1rem",
        },
        alignSelf: "flex-end",
      }}
    >
      <ToggleButton
        value="code"
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <CodeIcon />
      </ToggleButton>
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
        value="link"
        onClick={() => editor.chain().focus().toggleLink().run()}
      >
        <InsertLinkIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
