import * as z from "zod";

export type CommentCreateRequest = z.infer<typeof CommentCreateRequestSchema>;
export type CommentPatchRequest = z.infer<typeof CommentPatchRequestSchema>;
export type CommentDeleteRequest = z.infer<typeof CommentDeleteRequestSchema>;

const side = ["LEFT", "RIGHT"] as const;

export const CommentCreateRequestSchema = z
  .object({
    body: z.string(),
    commit_id: z.string(),
    path: z.string(),
    side: z.enum(side).optional(),
    line: z.number().optional(),
    start_line: z.number().optional(),
    start_side: z.enum(side).optional(),
    in_reply_to: z.number().optional(),
  })
  .refine(
    (data) =>
      (data.side != null &&
        data.line != null &&
        data.start_line != null &&
        data.start_side != null &&
        data.in_reply_to == null) ||
      (data.side == null &&
        data.line == null &&
        data.start_line == null &&
        data.start_side == null &&
        data.in_reply_to != null),
    {
      message:
        "Must provide either comment location information OR an in reply to ID.",
    },
  );

export const CommentPatchRequestSchema = z.object({
  comment_id: z.number(),
  body: z.string().nonempty(),
});

export const CommentDeleteRequestSchema = z.object({
  comment_id: z.number(),
});
