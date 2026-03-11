import * as z from "zod";

export type User = z.infer<typeof UserSchema>;
export type UserIdentity = z.infer<typeof UserIdentitySchema>;
export type Repo = z.infer<typeof RepoSchema>;
export type Issue = z.infer<typeof IssueSchema>;
export type Branch = z.infer<typeof BranchSchema>;
export type PullRequest = z.infer<typeof PullRequestSchema>;
export type FileDiff = z.infer<typeof FileDiffSchema>;
export type Reaction = z.infer<typeof ReactionSchema>;
export type Comment = z.infer<typeof CommentSchema>;
export type PRMerge = z.infer<typeof PRMergeSchema>;
export type ReviewComment = z.infer<typeof ReviewCommentSchema>;
export type TimelineEvent = z.infer<typeof TimelineEventSchema>;

// Timeline sub-types
export type ReviewRequestEvent = z.infer<typeof ReviewRequestEventSchema>;
export type ReviewDismissedEvent = z.infer<typeof ReviewDismissedEventSchema>;
export type CommentEvent = z.infer<typeof CommentEventSchema>;
export type CommittedEvent = z.infer<typeof CommittedEventSchema>;
export type ReviewedEvent = z.infer<typeof ReviewedEventSchema>;
export type CommitCommentEvent = z.infer<typeof CommitCommentEventSchema>;
export type AssignIssueEvent = z.infer<typeof AssignIssueEventSchema>;
export type StateChangeEvent = z.infer<typeof StateChangeEventSchema>;

const issueState = ["open", "closed"] as const;
const side = ["LEFT", "RIGHT"] as const;
const subjectType = ["line", "file"] as const;
const authorAssociation = [
  "COLLABORATOR",
  "CONTRIBUTOR",
  "FIRST_TIMER",
  "FIRST_TIME_CONTRIBUTOR",
  "MANNEQUIN",
  "MEMBER",
  "NONE",
  "OWNER",
] as const;
const repoVisibility = ["public", "private", "internal"] as const;

export const UserSchema = z.object({
  login: z.string(),
  id: z.number(),
  avatar_url: z.string(),
});

export const UserIdentitySchema = z.object({
  date: z.string(),
  email: z.string(),
  name: z.string(),
});

export const RepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  owner: UserSchema,
  html_url: z.string(),
  description: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  pushed_at: z.string(),
  stargazers_count: z.number(),
  watchers_count: z.number(),
  open_issues_count: z.number(),
  has_pull_requests: z.boolean(),
  visibility: z.enum(repoVisibility),
});

export const BranchSchema = z.object({
  label: z.string(),
  ref: z.string(),
  sha: z.string(),
  user: UserSchema,
  repo: RepoSchema,
});

export const PullRequestSchema = z.object({
  url: z.string(),
  id: z.number(),
  diff_url: z.string(),
  number: z.number(),
  state: z.enum(issueState),
  locked: z.boolean(),
  title: z.string(),
  user: UserSchema.nullable(),
  body: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  closed_at: z.string().nullable(),
  merged_at: z.string().nullable(),
  merge_commit_sha: z.string().nullable(),
  assignees: z.array(UserSchema).nullable(),
  requested_reviewers: z.array(UserSchema).nullable(),
  head: BranchSchema,
  base: BranchSchema,
  author_association: z.enum(authorAssociation),
  draft: z.boolean(),
  assignee: UserSchema.nullable(),
  merged: z.boolean(),
  mergeable: z.boolean().nullable(),
  rebaseable: z.boolean().nullable(),
  mergeable_state: z.string(),
  merged_by: UserSchema.nullable(),
  comments: z.number(),
  review_comments: z.number(),
  commits: z.number(),
  additions: z.number(),
  deletions: z.number(),
  changed_files: z.number(),
});

// Not in use
export const IssueSchema = z.object({
  url: z.string(),
  id: z.number(),
  number: z.number(),
  state: z.enum(issueState),
  title: z.string(),
  user: UserSchema.nullable(),
  body: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  assignees: z.array(UserSchema).nullable(),
  locked: z.boolean(),
  repository: RepoSchema,
  pull_request: PullRequestSchema,
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
  start_side: z.enum(side).nullable(),
  line: z.number().nullable(),
  original_line: z.number().nullable(),
  side: z.enum(side),
  in_reply_to_id: z.number().nullish(),
  author_association: z.enum(authorAssociation),
  subject_type: z.enum(subjectType),
});

export const PRMergeSchema = z.object({
  sha: z.string(),
  merged: z.boolean(),
  message: z.string(),
});

export const ReviewCommentSchema = z.object({
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
  in_reply_to_id: z.number().nullish(),
  author_association: z.enum(authorAssociation),
  subject_type: z.enum(subjectType).nullish(),
});

export const CommitCommentSchema = z.object({
  id: z.number(),
  body: z.string(),
  path: z.string().nullable(),
  line: z.number().nullable(),
  commit_id: z.string(),
  user: UserSchema,
  created_at: z.string(),
  updated_at: z.string(),
  author_association: z.enum(authorAssociation),
  reactions: ReactionSchema,
});

export const ReviewRequestEventSchema = z.object({
  id: z.number(),
  url: z.string(),
  actor: UserSchema,
  event: z.enum(["review_requested", "review_request_removed"]),
  created_at: z.string(),
  review_requester: UserSchema,
  requested_reviewer: UserSchema,
});

export const ReviewDismissedEventSchema = z.object({
  id: z.number(),
  url: z.string(),
  actor: UserSchema,
  event: z.literal("review_dismissed"),
  created_at: z.string(),
  dismissed_review: z.object({
    state: z.string(),
    review_id: z.number(),
    dismissal_message: z.string().nullable(),
    dismissal_commit_id: z.string().optional(),
  }),
});

export const CommentEventSchema = z.object({
  id: z.number(),
  url: z.string(),
  actor: UserSchema,
  event: z.enum(["commented", "comment_deleted"]),
  created_at: z.string(),
  updated_at: z.string(),
  body: z.string(),
  user: UserSchema,
  author_association: z.enum(authorAssociation),
  reactions: ReactionSchema,
});

export const CommittedEventSchema = z.object({
  event: z.literal("committed"),
  sha: z.string(),
  url: z.string(),
  author: UserIdentitySchema,
  committer: UserIdentitySchema,
  message: z.string(),
});

export const LineCommentEventSchema = z.object({
  event: z.literal("commented"),
  comments: z.array(CommentSchema),
});

export const ReviewedEventSchema = z.object({
  id: z.number(),
  event: z.literal("reviewed"),
  user: UserSchema,
  body: z.string().nullable(),
  state: z.string(),
  submitted_at: z.string(),
  updated_at: z.string(),
  author_association: z.enum(authorAssociation),
  comments: z.array(ReviewCommentSchema).optional(),
});

export const CommitCommentEventSchema = z.object({
  event: z.literal("commented"),
  commit_id: z.number(),
  comments: z.array(CommitCommentSchema),
});

export const AssignIssueEventSchema = z.object({
  id: z.number(),
  url: z.string(),
  actor: UserSchema,
  event: z.enum(["assigned", "unassigned"]),
  created_at: z.string(),
  assignee: UserSchema,
});

export const StateChangeEventSchema = z.object({
  id: z.number(),
  url: z.string(),
  actor: UserSchema,
  event: z.enum(["closed", "merged", "reopened"]),
  created_at: z.string(),
  state_reason: z.string().nullish(),
});

export const TimelineEventSchema = z
  .union([
    ReviewRequestEventSchema, // event: review_requested, review_request_removed
    ReviewDismissedEventSchema, // event: review_dismissed
    CommentEventSchema, // event: commented, comment_deleted
    CommittedEventSchema, // event: committed
    ReviewedEventSchema, // event: reviewed
    AssignIssueEventSchema, // event: assigned, unassigned
    StateChangeEventSchema, // event: closed, merged, reopened
  ])
  .nullable();
