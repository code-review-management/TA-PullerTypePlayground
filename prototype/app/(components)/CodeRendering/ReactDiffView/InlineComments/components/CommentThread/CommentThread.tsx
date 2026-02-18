import { useState } from "react";
import { Stack } from "@mui/material";
import { MockCommentThread } from "../../sample-data/MockComments";
import CommentItem from "../CommentItem/CommentItem";

/**
 * TODO: create state updater function when comment item is edit/published.
 * TODO: consider polling and avoid overrwriting current drafts/edits + edge cases.
 * TODO: remove hard-coded styling.
 */

export default function CommentThread({
  thread,
}: {
  thread: MockCommentThread;
}) {
  const STYLE_CONTAINER_BORDER_COLOR = "rgb(225, 222, 222)";
  const [comments, setComments] = useState(thread.comments);

  return (
    <Stack
      spacing={1}
      sx={{
        m: 1,
        p: 1,
        borderRadius: 1,
        border: `1px solid ${STYLE_CONTAINER_BORDER_COLOR}`,
      }}
    >
      {comments.length === 0 ? (
        <CommentItem type="is-draft" username={"octocat"} /> // TODO: replace with logged-in user
      ) : (
        comments.map((comment) => {
          return (
            <CommentItem
              type="is-published"
              key={comment.id}
              content={comment.content}
              username={comment.username}
              date={comment.date}
            />
          );
        })
      )}
    </Stack>
  );
}
