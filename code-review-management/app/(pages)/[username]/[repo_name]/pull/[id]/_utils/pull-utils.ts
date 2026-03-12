import { PullRequest } from "@/types/github.types";
import { State } from "@/app/(pages)/_utils/stateConstants";

export function getPullState(pull: PullRequest): State {
  if (pull.draft) return "draft";
  if (pull.merged_at !== null) return "merged";
  return pull.state;
}

export function canMerge(pull: PullRequest) {
  return (
    !pull.draft &&
    pull.state === "open" &&
    pull.mergeable &&
    (pull.mergeable_state === "clean" || pull.mergeable_state === "unstable")
  );
}
