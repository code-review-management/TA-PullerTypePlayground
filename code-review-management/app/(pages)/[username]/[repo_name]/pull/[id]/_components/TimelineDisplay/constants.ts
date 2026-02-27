export const event_types = [
  "approved",
  "assigned",
  "changes_requested",
  "committed",
  "closed",
  "dismissed",
  "head_ref_deleted",
  "merged",
  "ready_for_review",
  "renamed",
  "review_dismissed",
  "review_requested",
  "reviewed",
];

export type EventType = typeof event_types[number];

export const ICONS: Record<EventType, string> = {
  approved: "approved",
  assigned: "user",
  changes_requested: "changes_requested",
  commented: "eye",
  committed: "commit",
  closed: "",
  dismissed: "eye",
  head_ref_deleted: "branch",
  merged: "merge",
  ready_for_review: "eye",
  renamed: "pencil",
  review_dismissed: "x",
  review_requested: "eye",
  reviewed: "eye",
};

export const APPROVAL_STATE_MESSAGES: Record<EventType, string> = {
  approved: "approved these changes",
  changes_requested: "requested changes",
  commented: "reviewed",
  dismissed: "previously reviewed",
};
