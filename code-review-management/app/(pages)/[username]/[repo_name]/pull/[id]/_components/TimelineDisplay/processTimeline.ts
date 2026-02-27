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
  "err",
];

export type EventType = typeof event_types[number];

interface eventInterface {
  event: string;
  node_id: string;
  sha?: string;
  message?: string;
  actor?: { login: string };
  rename?: {
    from: string;
    to: string;
  };
  review_requester?: { login: string };
  requested_reviewer?: { login: string };
  assignee?: { login: string };
  body?: string;
  user?: { login: string };
  submitted_at?: string;
  state?: string;
}

export const review_states = ["approved", "commented", "changes_requested", "dismissed"];

const other_events = ["committed", "closed"];

const double_events = ["assigned", "review_requested"];

export interface timelineEvent {
  event_obj: eventInterface;
  icon_name: string;
  message: string;
  display_type: "single_link" | "double_link" | "other";
  event_type: EventType;
  actor1: string | null;
  actor2: string | null;
}

const ICONS: Record<EventType, string> = {
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

const MESSAGES: Record<EventType, string> = {
  approved: "approved these changes",
  assigned: "assigned this to",
  changes_requested: "requested changes",
  commented: "reviewed",
  dismissed: "previously reviewed",
  head_ref_deleted: "deleted branch ??",
  merged: "merged commit ??",
  ready_for_review: "marked this pull request as ready for review",
  renamed: "renamed the pull request to",
  review_dismissed: "dismissed a review",
  review_requested: "requested a review from",
  reviewed: "reviewed",
};

function getActor1(event_obj: eventInterface, event_type: string) {
  if (event_type === "review_requested") {
    return event_obj.review_requester?.login;
  }
  if (event_obj.actor) {
    return event_obj.actor.login;
  }
  return null;
}

function getActor2(event_obj: eventInterface, event_type: string) {
  if (event_type === "review_requested") {
    return event_obj.requested_reviewer?.login;
  }
  if (event_type === "assigned") {
    return event_obj.assignee?.login;
  }
  return null;
}

function getTimelineEvent(event_obj: eventInterface): timelineEvent {
  const event_type = (event_obj.event === "reviewed" ? event_obj.state?.toLowerCase() : event_obj.event) || "err";

  const display_type = (() => {
    if (other_events.includes(event_obj.event)) {
      return "other";
    }
    if (double_events.includes(event_obj.event)) {
      return "double_link";
    }
    return "single_link";
  })();

  // TODO: Get correct approval status even when review is stale/dismissed

  const icon_name = (() => {
    if (event_obj.event === "reviewed") {
      const approval_state = event_obj.state || "";
      return ICONS[approval_state];
    }
    return ICONS[event_obj.event];
  })();

  const message = (() => {
    if (event_obj.event === "reviewed") {
      const approval_state = event_obj.state || "";
      return MESSAGES[approval_state];
    }
    if (event_obj.event === "renamed") {
      return `renamed the pull request to ${event_obj.rename?.to || ""}`
    }
    return MESSAGES[event_obj.event];
  })();

  const actor1 = getActor1(event_obj, event_type) || null;
  const actor2 = getActor2(event_obj, event_type) || null;

  return {
    event_obj,
    icon_name,
    message,
    display_type,
    event_type,
    actor1,
    actor2,
  };
}

export function processTimeline(timeline: eventInterface[]): {
  beforeCloseTimeline: timelineEvent[];
  afterCloseTimeline: timelineEvent[];
} {
  const processedTimeline = timeline
    .toReversed()
    .map((event_obj) => getTimelineEvent(event_obj));
  const closedIdx = processedTimeline.findIndex(
    (event) => event.event_obj.event === "closed",
  );
  if (closedIdx !== -1) {
    return {
      beforeCloseTimeline: processedTimeline.slice(closedIdx, timeline.length),
      afterCloseTimeline: processedTimeline.slice(0, closedIdx),
    };
  } else {
    return { beforeCloseTimeline: processedTimeline, afterCloseTimeline: [] };
  }
}
