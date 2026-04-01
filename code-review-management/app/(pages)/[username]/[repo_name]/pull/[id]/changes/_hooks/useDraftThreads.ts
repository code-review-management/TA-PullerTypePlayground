import { useState } from "react";
import { Side } from "react-diff-view/types/interface";

type Filename = string;
type LineNumber = number;
type DraftThreadKey = `${Filename}:${LineNumber}:${Side}`;

export type DraftThreads = Record<DraftThreadKey, DraftThreadItem>;

export interface DraftThreadItem {
  oldPath: string;
  activePath: string;
  fileStatus: string;
  start: number;
  end: number;
  side: Side;
  body: string;
}

/**
 * A hook to maintain a state of draft threads created on a pull request diff.
 * Drafts are comments that the user is in-progress of creating. They are NOT
 * yet published to GitHub. Using the highlight functionality generates a draft
 * to start a new NEW thread associated with the highlighted lines.
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
 * @param filename: File containing the draft thread.
 * @param lineNumber: Max line number that the draft thread is anchored to.
 * @param side: Side of the diff that the draft thread is on ("old" or "new").
 * @returns: Key to index into the `draftThreads` state record.
 */
export function getDraftThreadKey(
  filename: string,
  lineNumber: number,
  side: Side,
): DraftThreadKey {
  return `${filename}:${lineNumber}:${side}`;
}
