export interface MockPublishedComment {
  user: { login: string; id: number; avatar_url: string };
  id: number; // ID of the pull request review comment
  pull_request_review_id: number | null; // ID of the pull request review to which the comment belongs
  in_reply_to_id?: number; // Comment ID to reply to
  path: string; // Relative path of the file to which the comment applies
  body: string; // Text of the comment
  created_at: string;
  updated_at: string;
  start_line?: number | null; // First line of the range for a multi-line comment
  line?: number; // Line of the blob to which the comment applies. The last line of the range for a multi-line comment
  start_side?: "LEFT" | "RIGHT" | null; // Side of the first line of the range for a multi-line comment
  side?: "LEFT" | "RIGHT"; // Side of the diff to which the comment applies. The side of the last line of the range for a multi-line comment
  subject_type?: "line" | "file"; // Level at which the comment is targeted, can be a diff line or a file
}
