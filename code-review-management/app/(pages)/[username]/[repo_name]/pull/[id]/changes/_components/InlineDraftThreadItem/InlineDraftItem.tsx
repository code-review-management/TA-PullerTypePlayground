import { DraftThreadItem } from "../../_hooks/useDraftThreads";

export default function InlineDraftThreadItem({
  draft,
}: {
  draft: DraftThreadItem;
}) {
  return <div>Draft created at {draft.created}</div>;
}
