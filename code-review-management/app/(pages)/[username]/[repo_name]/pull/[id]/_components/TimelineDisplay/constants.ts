export const event_types = [
  "assigned",
  "committed",
  "head_ref_deleted",
  "merged",
  "ready_for_review",
  "renamed",
  "review_dismissed",
  "review_requested",
  "reviewed",
];

export type EventType = typeof event_types[number];

// export type EventType =
//   | "assigned"
//   | "committed"
//   | "head_ref_deleted"
//   | "merged"
//   | "ready_for_review"
//   | "renamed"
//   | "review_dismissed"
//   | "review_requested"
//   | "reviewed";

export const ICONS: Record<EventType, string> = {
  assigned: "user",
  committed: "commit",
  head_ref_deleted: "branch",
  merged: "merge",
  ready_for_review: "eye",
  renamed: "pencil",
  review_dismissed: "x",
  review_requested: "eye",
  reviewed: "eye",
};
