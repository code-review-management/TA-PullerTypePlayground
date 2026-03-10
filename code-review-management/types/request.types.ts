import * as z from "zod";

export type CommentCreateRequest = z.infer<typeof CommentCreateRequestSchema>;
export type CommentPatchRequest = z.infer<typeof CommentPatchRequestSchema>;
export type CommentDeleteRequest = z.infer<typeof CommentDeleteRequestSchema>;
export type PRMergeRequest = z.infer<typeof PRMergeRequestSchema>;
export type CreateReviewRequest = z.infer<typeof CreateReviewRequestSchema>;

const side = ["LEFT", "RIGHT"] as const;
const mergeMethod = ["merge", "squash", "rebase"] as const;
const reviewEvent = [
  "APPROVE",
  "REQUEST_CHANGES",
  "COMMENT",
  "PENDING",
] as const;

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

export const PRMergeRequestSchema = z.object({
  commit_title: z.string(),
  commit_message: z.string(),
  sha: z.string().optional(),
  merge_method: z.enum(mergeMethod),
});

export const CreateReviewRequestSchema = z
  .object({
    commit_id: z.string(),
    body: z.string().optional(),
    event: z.enum(reviewEvent),
  })
  .refine(
    (data) => {
      if (data.event == "REQUEST_CHANGES" || data.event == "COMMENT") {
        return data.body;
      }
      return true;
    },
    {
      message: "Must provide body if event is REQUEST_CHANGES or COMMENT",
    },
  );
