/**
 * These fields and their types are based on what's returned from the
 * corresponding REST API by Octokit (octokit.rest.pulls.listReviewComments).
 */
export interface MockPublishedComment {
  user: { login: string; id: number; avatar_url: string };
  id: number;
  pull_request_review_id: number | null;
  in_reply_to_id?: number;
  path: string;
  body: string;
  created_at: string;
  updated_at: string;
  start_line?: number | null; // First line of a multi-line comment
  line?: number; // Last line of a multi-line comment
  start_side?: "LEFT" | "RIGHT" | null; // Side of the first line of a multi-line comment
  side?: "LEFT" | "RIGHT"; // Side of the last line of a multi-line comment
  subject_type?: "line" | "file"; // Level at which the comment is targeted
}

export interface MockPublishedThread {
  id: number;
  path: string;
  start_line?: number | null;
  line?: number;
  start_side?: "LEFT" | "RIGHT" | null;
  side?: "LEFT" | "RIGHT";
  subject_type?: "line" | "file";
  comments: MockPublishedComment[];
}
