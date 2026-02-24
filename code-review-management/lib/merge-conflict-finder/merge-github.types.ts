import * as z from "zod";

export type GitHubContent = z.infer<typeof GitHubContentSchema>;
export type FileChange = z.infer<typeof FileChangeSchema>;
export type CompareResponse = z.infer<typeof CompareResponseSchema>;

export const GitHubContentSchema = z.object({
  type: z.string(),
  encoding: z.string(),
  size: z.number(),
  name: z.string(),
  path: z.string(),
  content: z.string().optional(), 
  sha: z.string(),
  url: z.string(),
  git_url: z.string().nullable(),
  html_url: z.string().nullable(),
  download_url: z.string().nullable(),
});

export const FileChangeSchema = z.object({
  filename: z.string(),
  status: z.enum([
    'added', 
    'removed', 
    'modified', 
    'renamed', 
    'copied', 
    'changed', 
    'unchanged'
  ]),
});

export const CompareResponseSchema = z.object({
  merge_base_commit: z.object({
    sha: z.string(),
  }),
  files: z.array(FileChangeSchema),
});