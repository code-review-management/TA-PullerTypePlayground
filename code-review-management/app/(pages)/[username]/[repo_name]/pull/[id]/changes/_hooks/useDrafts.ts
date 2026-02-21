import { useState } from "react";
import { Side } from "react-diff-view/types/interface";

/**
 * Drafts are comments that the user is in-progress of creating. They are not
 * yet published to GitHub. Using the highlight functionality generates a draft
 * for a NEW thread.
 *
 * Supports only "line" subject types, not files.
 *
 * TODO: Handle reply drafts when responding to an already published thread.
 * Create a new hook for handling replies.
 */

/**
 * Docs:
 * 1. https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html
 */
type FileName = string;
type LineNumber = string;
type DraftKey = `${FileName}:${LineNumber}:${Side}`;

export type Drafts = Record<DraftKey, DraftItem>;

export interface DraftItem {
  path: string;
  body: string;
  startLine: number;
  endLine: number;
  side: Side;
  createdAt: string;
}

export function useDrafts() {
  const [drafts, setDrafts] = useState<Drafts>({});
  return { drafts, setDrafts };
}
