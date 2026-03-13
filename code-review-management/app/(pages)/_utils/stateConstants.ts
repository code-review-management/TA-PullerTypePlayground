export type State = "open" | "closed" | "merged" | "draft";

export const ICONS: Record<State, string> = {
  open: "pr_open.svg",
  closed: "pr_closed.svg",
  merged: "pr_merged.svg",
  draft: "pr_draft.svg",
};
