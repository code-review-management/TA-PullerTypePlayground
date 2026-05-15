import { useState } from "react";

type Filename = string;
type ParentId = number;
type DraftReplyKey = `${Filename}:${ParentId}`;

export type DraftReplies = Record<DraftReplyKey, DraftReplyItem>;

export interface DraftReplyItem {
  filename: string;
  parentId: number;
  body: string;
}

export function useDraftReplies() {
  const [draftReplies, setDraftReplies] = useState<DraftReplies>({});
  return { draftReplies, setDraftReplies };
}

export function getDraftReplyKey(
  filename: string,
  parentId: number,
): DraftReplyKey {
  return `${filename}:${parentId}`;
}
