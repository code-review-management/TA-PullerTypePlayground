export const FILTERS = [
  "All",
  "Needs your review",
  "Waiting for review",
  "Ready for review",
  "Approved",
  "Merged",
  "Draft",
] as const;

export type Tab = (typeof FILTERS)[number];
