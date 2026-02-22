import * as z from "zod";

export type User = z.infer<typeof UserSchema>;
export type Repo = z.infer<typeof RepoSchema>;
export type Issue = z.infer<typeof IssueSchema>;
export type PullRequest = z.infer<typeof PullRequestSchema>;
export type FileDiff = z.infer<typeof FileDiffSchema>;

export const UserSchema = z.object({
  login: z.string(),
  id: z.number(),
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
