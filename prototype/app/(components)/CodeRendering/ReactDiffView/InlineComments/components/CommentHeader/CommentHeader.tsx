import { Stack } from "@mui/material";
import { type Editor } from "@tiptap/react";
import FormattingToolbar from "./FormattingToolbar";
import PublishedOptionsMenu from "./PublishedOptionsMenu";
import UserDateLabels from "./UserDateLabels";

type CommentHeaderProps =
  | {
      type: "is-draft";
      editor: Editor | null;
      username: string;
    }
  | {
      type: "is-published";
      editor: Editor | null;
      isEditEnabled: boolean;
      username: string;
      date: string;
      enableEditMode: () => void;
      // Include more props specific to published comments like comment ID,
      // thread ID, resolved status, etc. Depending on the data needed, there
      // might be a better way to organize the props than discriminating union
      // types.
    };

export default function CommentHeader(props: CommentHeaderProps) {
  const isEditEnabled = props.type === "is-draft" || props.isEditEnabled;

  return (
    <Stack
      direction="row"
      sx={{ justifyContent: "space-between", alignItems: "center" }}
    >
      <UserDateLabels
        username={props.username}
        date={props.type === "is-published" ? props.date : undefined}
      />
      {isEditEnabled ? (
        <FormattingToolbar editor={props.editor} />
      ) : (
        <PublishedOptionsMenu enableEditMode={props.enableEditMode} />
      )}
    </Stack>
  );
}
