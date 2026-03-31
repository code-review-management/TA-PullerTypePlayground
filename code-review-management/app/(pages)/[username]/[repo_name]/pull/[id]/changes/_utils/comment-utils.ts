import { Dispatch, SetStateAction } from "react";
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
    const key = getDraftThreadKey(draft.filename, draft.end, draft.side);
    const draftThreads = { ...prev };
    delete draftThreads[key];
    return draftThreads;
  });
}
