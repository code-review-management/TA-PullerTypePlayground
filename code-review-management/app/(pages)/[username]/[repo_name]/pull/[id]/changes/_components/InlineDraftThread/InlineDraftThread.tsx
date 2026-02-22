import { DraftThreadItem } from "../../_hooks/useDraftThreads";

export default function InlineDraftThread({
  draft,
}: {
  draft: DraftThreadItem;
}) {
  return <div>Draft created at {draft.created}</div>;
}
