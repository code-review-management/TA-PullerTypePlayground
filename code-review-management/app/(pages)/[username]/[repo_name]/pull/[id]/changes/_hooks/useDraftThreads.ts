import { useState } from "react";
import { Side } from "react-diff-view/types/interface";

/**
 * Docs:
 * 1. https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html
 * 2. https://macarthur.me/posts/template-literal-types/
 * - Referenced to form the following template literal type for `DraftThreadKey`.
 */
type Filename = string;
type LineNumber = number;
type DraftThreadKey = `${Filename}:${LineNumber}:${Side}`;

export type DraftThreads = Record<DraftThreadKey, DraftThreadItem>;

export interface DraftThreadItem {
  filename: string;
  start: number;
  end: number;
  side: Side;
  created: string;
  body: string;
}

/**
 * A hook to maintain a state of draft threads created on a pull request diff.
 * Drafts are comments that the user is in-progress of creating. They are NOT
 * yet published to GitHub. Using the highlight functionality generates a draft
 * for a NEW thread associated with the highlighted lines.
 *
 * TODO: Handle reply drafts when responding to an already published thread.
 * Create a new hook `useDraftReplies` to achieve this.
 *
 * @returns: The `draftThreads` state and `setDraftThreads` setter.
 */
export function useDraftThreads() {
  const [draftThreads, setDraftThreads] = useState<DraftThreads>({});
  return { draftThreads, setDraftThreads };
}

/**
 * Gets the key to index into the `draftThreads` state record.
 *
 * @param filename: The file containing the draft thread.
 * @param lineNumber: The ending line number associated with the draft thread.
 * @param side: The side of the diff associated with the draft thread ("old" or "new").
 * @returns: The key to index into the `draftThreads` state record.
 */
export function getDraftThreadKey(
  filename: string,
  lineNumber: number,
  side: Side,
): DraftThreadKey {
  return `${filename}:${lineNumber}:${side}`;
}
