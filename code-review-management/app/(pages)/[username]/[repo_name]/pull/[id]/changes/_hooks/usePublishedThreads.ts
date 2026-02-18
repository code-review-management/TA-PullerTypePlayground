import { useEffect, useState } from "react";
import { readFile } from "@/lib/file-utils";
import {
  MockPublishedComment,
  MockPublishedThread,
} from "@/mocks/types/comments";

/*
 * Since the GitHub API returns all pull request comments as a flat array, we
 * need to build the structure of the comment relationships. This includes
 * the following:
 *   - Identifying which comments are part of the same thread
 *   - Identifying the parent comment in a thread
 *   - Ordering the comments within a thread by time created
 *   - Mapping a thread to the file, line number, and side of the diff that it
 *     belongs to
 *
 * For now, we do this pre-processing here and assume the data we retrieve is
 * sorted by time created (which is supported by the GitHub API).
 *
 * We build a hash-map from filename -> line-number -> side -> array of threads
 */

type FileName = string;
type LineNumber = number;

export type PublishedThreads = Map<FileName, PublishedThreadsByLine>;
export type PublishedThreadsByLine = Map<LineNumber, PublishedThreadsBySide>;

/**
 * When building the array of 'MockPublishedThread', the threads are ordered
 * by their creation time (again, assuming the data we retrieve from GitHub
 * is sorted this way). The 'combined' field combines the threads on the left-
 * side of the diff and right-side of the diff (for the same line number) while
 * maintaining this ordering. This is necessary for when the diff is in
 * 'unified' view, so we can display comments on unchanged lines in the correct
 * order.
 */
export interface PublishedThreadsBySide {
  combined: MockPublishedThread[];
  left: MockPublishedThread[];
  right: MockPublishedThread[];
}

export function usePublishedThreads() {
  const [publishedThreads, setPublishedThreads] = useState<PublishedThreads>();

  useEffect(() => {
    const getPublishedThreads = async () => {
      const response = await readFile("/mocks/responses/comments.json");
      const comments: MockPublishedComment[] = JSON.parse(response);
      const threads = buildCommentRelations(comments);
      setPublishedThreads(threads);
    };

    getPublishedThreads();
  }, []);

  return { publishedThreads };
}

function buildCommentRelations(comments: MockPublishedComment[]) {
  const threadsByFile = groupThreadsByFile(comments);
  const publishedThreads: PublishedThreads = new Map();

  for (const [filename, threads] of threadsByFile) {
    publishedThreads.set(filename, groupThreadsByLineAndSide(threads));
  }

  return publishedThreads;
}

/**
 * This function takes a flat array of comments from the GitHub API and returns
 * Map<FileName, MockPublishedThread[]>: a mapping from the filename to an array
 * of comment threads belonging to that file. This array of threads is ordered
 * by their creation time, assuming that the GitHub API returns the data in this
 * sorted order.
 */
function groupThreadsByFile(comments: MockPublishedComment[]) {
  const threadsByFile: Map<FileName, MockPublishedThread[]> = new Map();

  for (const comment of comments) {
    if (!threadsByFile.has(comment.path)) {
      threadsByFile.set(comment.path, []);
    }

    /**
     * If the comment's 'inReplyTo' field is populated, then it is a REPLY for a
     * thread. We push this comment in the existing array for that corresponding
     * thread.
     *
     * Note: An array is used but it is O(n) time to find the correct thread.
     * This can potentially be refactored to use a Map.
     */
    if (comment.in_reply_to_id) {
      const parent = threadsByFile.get(comment.path)!.find((thread) => thread.id === comment.in_reply_to_id);
      parent?.comments.push(comment);
    } else {
    /**
     * If the comment's 'inReplyTo' field is NOT populated, then it is the
     * PARENT for a thread. We push this comment as a new thread belonging to
     * the corresponding file.
     */
      threadsByFile.get(comment.path)!.push({
        id: comment.id,
        path: comment.path,
        start_side: comment.start_side,
        side: comment.side,
        start_line: comment.start_line,
        line: comment.line,
        subject_type: comment.subject_type,
        comments: [comment],
      });
    }
  }

  return threadsByFile;
}

function groupThreadsByLineAndSide(threads: MockPublishedThread[]) {
  const threadsByLine: PublishedThreadsByLine = new Map();

  for (const thread of threads) {
    const { line, side, subject_type } = thread;

    if (!line || !side || subject_type !== "line") continue;

    if (!threadsByLine.has(line)) {
      threadsByLine.set(line, { left: [], right: [], combined: [] });
    }

    const diffSide = side === "LEFT" ? "left" : "right";

    // Use non-null assertion since it's guaranteed that 'line' is a key in
    // 'threadsByLine' since we set it above if it does not exist.
    threadsByLine.get(line)![diffSide].push(thread);
    threadsByLine.get(line)!.combined.push(thread);
  }

  return threadsByLine;
}
