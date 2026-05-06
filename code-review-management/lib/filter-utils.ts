// Filter names
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

export type Filter = (typeof FILTERS)[number];

// Map filter names to tab names (displayed on tab filter UI)
const TAB_NAMES: Record<Filter, string> = {
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

// Map filter names to query parameters for `usePullsQuery`
const FILTER_STRINGS: Record<Filter, string[]> = {
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
  filter_name: Filter;
  filter_string: string;
  tab_name: string;
};

export function getFilterObj(filter_name: Filter): DashboardTabFilter {
  return {
    filter_name,
    filter_string: FILTER_STRINGS[filter_name].join("&"),
    tab_name: TAB_NAMES[filter_name],
  };
}

/**
 * Returns information about all currently available filter types
 * in a Map format.
 *
 * @returns Map of filter names to `DashboardTabFilter` objects.
 */
export function getAllFiltersMap(): Map<Filter, DashboardTabFilter> {
  return new Map(
    FILTERS.map((filter_name) => [filter_name, getFilterObj(filter_name)]),
  );
}
