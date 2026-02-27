import * as z from "zod";

export type CommentCreateRequest = z.infer<typeof CommentCreateRequestSchema>;

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
