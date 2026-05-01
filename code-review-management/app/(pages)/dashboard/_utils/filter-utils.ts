export const FILTERS = [
  "all",
  "requires_review",
  "needs_your_review",
  "reviewed_by_you",
  "authored",
  "assigned",
  "approved",
  "merged",
  "draft",
] as const;

export type Tab = (typeof FILTERS)[number];

const TAB_FILTERS: Tab[] = [
  "all",
  "requires_review",
  "needs_your_review",
  "authored",
  "assigned",
  "merged",
  "draft",
];

const TAB_NAMES: Record<Tab, string> = {
  all: "All",
  requires_review: "Requires review",
  needs_your_review: "Needs your review",
  reviewed_by_you: "Reviewed by you",
  authored: "Opened by you",
  assigned: "Assigned to you",
  approved: "Approved",
  merged: "Merged",
  draft: "Your drafts",
};

const FILTER_STRINGS: Record<Tab, string[]> = {
  all: [""],
  requires_review: ["open", "draft=1", "requires_review"],
  needs_your_review: ["open", "draft=1", "needs_review"],
  reviewed_by_you: ["reviewed"],
  authored: ["authored"],
  assigned: ["assigned"],
  approved: ["approved"],
  merged: ["merged"],
  draft: ["open", "draft"],
};

export type DashboardTabFilter = {
  filter_name: Tab;
  filter_string: string;
  tab_name: string;
};

export function createDashboardTabFilter(filter_name: Tab): DashboardTabFilter {
  return {
    filter_name,
    filter_string: FILTER_STRINGS[filter_name].join("&"),
    tab_name: TAB_NAMES[filter_name],
  };
}

export function getAllTabFilters() {
  return TAB_FILTERS.map((filter_name) =>
    createDashboardTabFilter(filter_name),
  );
}

export function getAllTabFiltersMapped() {
  return new Map(
    TAB_FILTERS.map((filter_name) => [
      filter_name,
      createDashboardTabFilter(filter_name),
    ]),
  );
}
