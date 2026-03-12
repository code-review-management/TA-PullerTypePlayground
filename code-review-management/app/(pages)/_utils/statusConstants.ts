export type Status = "ready" | "waiting" | "conflict" | "failure";

export const ICONS: Record<Status, string> = {
  ready: "merge_ready.svg",
  waiting: "merge_waiting.svg",
  conflict: "merge_conflict.svg",
  failure: "merge_failure.svg",
};

export const TEXT: Record<Status, string> = {
  ready: "Ready to merge",
  waiting: "Needs review",
  conflict: "Merge conflict",
  failure: "CI failed",
};
