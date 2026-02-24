import * as z from "zod";

export type User = z.infer<typeof UserSchema>;
export type Repo = z.infer<typeof RepoSchema>;
export type Issue = z.infer<typeof IssueSchema>;
export type PullRequest = z.infer<typeof PullRequestSchema>;
export type FileDiff = z.infer<typeof FileDiffSchema>;
export type Reaction = z.infer<typeof ReactionSchema>;
export type Comment = z.infer<typeof CommentSchema>;

export const UserSchema = z.object({
  login: z.string(),
  id: z.number(),
  avatar_url: z.string(),
});

export const RepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  owner: UserSchema,
  html_url: z.string(),
  description: z.string().nullable(),
});

export const IssueSchema = z.object({
  url: z.string(),
  id: z.number(),
  number: z.number(),
  state: z.string(),
  title: z.string(),
  user: UserSchema,
  body: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const PullRequestSchema = z.object({
  url: z.string(),
  id: z.number(),
  diff_url: z.string(),
  number: z.number(),
  state: z.string(),
  locked: z.boolean(),
  title: z.string(),
  user: UserSchema.nullable(),
});

export const FileDiffSchema = z.object({
  sha: z.string().nullable(),
  filename: z.string(),
  status: z.string(),
  additions: z.number(),
  deletions: z.number(),
  changes: z.number(),
  contents_url: z.string(),
  patch: z.string().optional(),
});

export const ReactionSchema = z.object({
  total_count: z.number(),
  "+1": z.number(),
  "-1": z.number(),
  laugh: z.number(),
  hooray: z.number(),
  confused: z.number(),
  heart: z.number(),
  rocket: z.number(),
  eyes: z.number(),
});

export const CommentSchema = z.object({
  pull_request_review_id: z.number(),
  id: z.number(),
  diff_hunk: z.string(),
  path: z.string(),
  commit_id: z.string(),
  original_commit_id: z.string(),
  user: UserSchema,
  body: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  reactions: ReactionSchema,
  start_line: z.number().nullable(),
  original_start_line: z.number().nullable(),
  start_side: z.string().nullable(),
  line: z.number().nullable(),
  original_line: z.number().nullable(),
  side: z.string(),
  in_reply_to_id: z.number().nullish(),
  author_association: z.string(),
});
