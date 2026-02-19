import styles from "./StateChip.module.css";

/**
 * TODO: Match with GitHub API state responses
 * Move logic to StateChip.tsx
 * Move types to a types file.
 */

export type State = "open" | "closed" | "merged" | "draft";

export const COLOR_CLASSES: Record<State, string> = {
  open: styles.open,
  closed: styles.closed,
  merged: styles.merged,
  draft: styles.draft,
};

export const ICONS: Record<State, string> = {
  open: "pr_open.svg",
  closed: "pr_closed.svg",
  merged: "pr_merged.svg",
  draft: "pr_draft.svg",
};
