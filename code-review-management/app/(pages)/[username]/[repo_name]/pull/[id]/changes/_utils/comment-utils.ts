import { Dispatch, SetStateAction } from "react";
import { Side } from "react-diff-view/types/interface";
import {
  DraftThreadItem,
  DraftThreads,
  getDraftThreadKey,
} from "../_hooks/useDraftThreads";

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
