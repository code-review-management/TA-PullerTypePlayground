import { useState } from "react";

interface DraftThread {
  startLine: number;
  endLine: number;
  content: string;
}

interface DraftThreadBySide {
  old?: DraftThread;
  new?: DraftThread;
}

type LineNumber = number;
export type DraftThreadIndex = Map<LineNumber, DraftThreadBySide>;

/**
 * Maintain a state of draft threads the user has created but not yet published
 * via the GitHub API.
 */

export function useDraftThreads() {
  const [draftThreads, setDraftThreads] = useState<DraftThreadIndex>(new Map());
  return { draftThreads, setDraftThreads };
}
