import { Dispatch, SetStateAction } from "react";
import { Side } from "react-diff-view/types/interface";
import {
  DraftThreadItem,
  DraftThreads,
  getDraftThreadKey,
} from "../_hooks/useDraftThreads";
import {
  PublishedThreadItem,
  PublishedThreads,
  PublishedThreadsByLine,
} from "../_hooks/usePublishedThreads";

/**
 * Deletes the given draft thread from the state.
 *
 * @param draft: `DraftThreadItem` representing the draft to delete.
 * @param setDraftThreads: Draft thread state setter.
 */
export function deleteDraftThread(
  draft: DraftThreadItem,
  setDraftThreads: Dispatch<SetStateAction<DraftThreads>>,
) {
  setDraftThreads((prev) => {
    const key = getDraftThreadKey(draft.activePath, draft.end, draft.side);
    const draftThreads = { ...prev };
    delete draftThreads[key];
    return draftThreads;
  });
}

/**
 * Gets the correct path to pass to the GitHub API when publishing a draft
 * thread. If the file has a "renamed" status, the LHS of the diff is associated
 * with the old path whereas the RHS of the diff is associated with the new path.
 *
 * @param oldPath: Old path of the file.
 * @param activePath: Active path of the file (display-value in file diff header).
 * @param fileStatus: Status of the file calculated by GitHub (e.g., removed, renamed).
 * @param side: Side of the diff that the comment is made on.
 * @returns: The correct path to associate with the draft thread.
 */
export function getDraftThreadFilePath(
  oldPath: string,
  activePath: string,
  fileStatus: string,
  side: Side,
) {
  return fileStatus === "renamed" && side === "old" ? oldPath : activePath;
}

export function getPublishedThreadsByLine(
  publishedThreads: PublishedThreads,
  oldPath: string,
  activePath: string,
  fileStatus: string,
) {
  const activePathThreads: PublishedThreadsByLine =
    publishedThreads.get(activePath) ?? new Map();
  const oldPathThreads: PublishedThreadsByLine =
    publishedThreads.get(oldPath) ?? new Map();
  const merged: PublishedThreadsByLine = new Map();

  if (fileStatus !== "renamed") return activePathThreads;

  for (const [line, thread] of activePathThreads) {
    merged.set(line, { left: [...thread.left], right: [...thread.right] });
  }

  for (const [line, thread] of oldPathThreads) {
    const existing = merged.get(line);
    if (existing) {
      existing.left.push(...thread.left);
      existing.right.push(...thread.right);
    } else {
      merged.set(line, { left: [...thread.left], right: [...thread.right] });
    }
  }

  const byCreatedDate = (a: PublishedThreadItem, b: PublishedThreadItem) =>
    new Date(a.comments[0].created_at).getTime() -
    new Date(b.comments[0].created_at).getTime();

  for (const threads of merged.values()) {
    threads.left.sort(byCreatedDate);
    threads.right.sort(byCreatedDate);
  }

  return merged;
}
