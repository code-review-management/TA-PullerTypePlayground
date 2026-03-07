import { PullRequest } from "@/types/github.types";
import { State } from "../_components/StateChip/stateConstants";

export function getPullState(pull: PullRequest): State {
  if (pull.draft) return "draft";
  if (pull.merged) return "merged";
  return pull.state;
}
