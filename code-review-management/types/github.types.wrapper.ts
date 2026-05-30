import {
  CommentSchema,
  CommitSchema,
  FileDiffSchema,
  PullRequestSchema,
  RepoSchema,
  TimelineEventSchema,
} from "@/types/github.types";
import * as z from "zod";

export type RepoV2 = z.infer<typeof RepoSchemaV2>;
export type PullRequestV2 = z.infer<typeof PullRequestSchemaV2>;
export type CommentV2 = z.infer<typeof CommentSchemaV2>;
export type TimelineEventV2 = z.infer<typeof TimelineEventSchemaV2>;
export type FileDiffV2 = z.infer<typeof FileDiffSchemaV2>;
export type CommitV2 = z.infer<typeof CommitSchemaV2>;

export const RepoSchemaV2 = z.object({
  data: z.array(RepoSchema),
  prev: z.number().optional(),
  next: z.number().optional(),
  first: z.number().optional(),
  last: z.number().optional(),
});

export const PullRequestSchemaV2 = z.object({
  data: z.array(PullRequestSchema),
  prev: z.number().optional(),
  next: z.number().optional(),
  first: z.number().optional(),
  last: z.number().optional(),
  totalCount: z.number(),
});

export const CommentSchemaV2 = z.object({
  data: z.array(CommentSchema),
  prev: z.number().optional(),
  next: z.number().optional(),
  first: z.number().optional(),
  last: z.number().optional(),
});

export const TimelineEventSchemaV2 = z.object({
  data: z.array(TimelineEventSchema),
  prev: z.number().optional(),
  next: z.number().optional(),
  first: z.number().optional(),
  last: z.number().optional(),
});

export const FileDiffSchemaV2 = z.object({
  data: z.array(FileDiffSchema),
  prev: z.number().optional(),
  next: z.number().optional(),
  first: z.number().optional(),
  last: z.number().optional(),
});

export const CommitSchemaV2 = z.object({
  data: z.array(CommitSchema),
  prev: z.number().optional(),
  next: z.number().optional(),
  first: z.number().optional(),
  last: z.number().optional(),
});
