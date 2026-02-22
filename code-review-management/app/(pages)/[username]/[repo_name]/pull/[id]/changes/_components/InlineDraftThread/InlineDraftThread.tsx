import { DraftThreadItem } from "../../_hooks/useDraftThreads";

/**
 * A draft thread anchored to specific lines in a file diff. Will contain an
 * editor where the user can draft a comment that will begin a new thread upon
 * submission.
 * 
 * @param draft: `DraftThreadItem` object containing data about the draft thread.
 */
export default function InlineDraftThread({
  draft,
}: {
  draft: DraftThreadItem;
}) {
  return <div>Draft created at {draft.created}, {draft.start}, {draft.end} </div>;
}
