/**
 * Type for an "event type".
 * These are possible values for "event" field of objects returned in timeline event API response.
 */
export type EventType =
  | "approved"
  | "assigned"
  | "changes_requested"
  | "commented"
  | "committed"
  | "closed"
  | "dismissed"
  | "head_ref_deleted"
  | "merged"
  | "ready_for_review"
  | "renamed"
  | "review_dismissed"
  | "review_requested"
  | "reviewed"
  | "err";

/**
 * Interface representing object structure for events in array returned by API response.
 * Note almost all fields are optional because different event types have different structures.
 */
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

/**
 * Possible states a "review" type event can have
 * Used to check if an event is a review when rendering it in TimelineEvent component.
 */
export const review_states = [
  "approved",
  "commented",
  "changes_requested",
  "dismissed",
];

// Events that follow the single link structure "[actor1] {message}".
const single_events = [
  "approved",
  "changes_requested",
  "commented",
  "dismissed",
  "head_ref_deleted",
  "merged",
  "ready_for_review",
  "renamed",
  "review_dismissed",
  "reviewed",
];

/**
 * Events that follow the double link structure "[actor1] {message} [actor2]" when rendered
 * For example: "octocat requested a review from octodog"
 */
const double_events = ["assigned", "review_requested"];

// Events that do not follow common "single link" or "double link" structures when rendered
const other_events = ["committed", "closed", ...review_states];

/**
 * Raw events returned from API response will be parsed into timelineEvents
 * timelineEvents are then rendered in the timeline display
 */
export interface timelineEvent {
  event_obj: eventInterface;
  icon_name: string;
  message: string;
  display_type: "single_link" | "double_link" | "other" | "hidden";
  event_type: EventType;
  actor1: string | null;
  actor2: string | null;
}

/**
 * Map event types to icons
 */
const ICONS: Record<EventType, string> = {
  approved: "approved",
  assigned: "user",
  changes_requested: "changes_requested",
  commented: "eye",
  committed: "commit",
  closed: "",
  dismissed: "eye",
  err: "",
  head_ref_deleted: "branch",
  merged: "merge",
  ready_for_review: "eye",
  renamed: "pencil",
  review_dismissed: "x",
  review_requested: "eye",
  reviewed: "eye",
};

/**
 * Map event types to message texts
 */
const MESSAGES: Record<EventType, string> = {
  approved: "approved these changes",
  assigned: "assigned this to",
  changes_requested: "requested changes",
  closed: "",
  commented: "reviewed",
  committed: "",
  dismissed: "previously reviewed",
  err: "Error! Could not fetch event message",
  head_ref_deleted: "deleted branch ??",
  merged: "merged commit ??",
  ready_for_review: "marked this pull request as ready for review",
  renamed: "renamed the pull request to",
  review_dismissed: "dismissed a review",
  review_requested: "requested a review from",
  reviewed: "reviewed",
};

/**
 *
 * @param event_obj eventInterface (interfaced response) object
 * @param event_type
 * @returns The username of "actor1" for this event, or null.
 */
function getActor1(event_obj: eventInterface, event_type: EventType) {
  if (event_type === "review_requested") {
    return event_obj.review_requester?.login;
  }
  if (event_obj.actor) {
    return event_obj.actor.login;
  }
  return null;
}

/**
 *
 * @param event_obj eventInterface (interfaced response) object
 * @param event_type
 * @returns The username of "actor2" for this event, or null.
 */
function getActor2(event_obj: eventInterface, event_type: EventType) {
  if (event_type === "review_requested") {
    return event_obj.requested_reviewer?.login;
  }
  if (event_type === "assigned") {
    return event_obj.assignee?.login;
  }
  return null;
}

/**
 * Parse eventInterface objects into
 * @param event_obj Interfaced raw data from API response.
 * @returns A single timelineEvent object.
 */
function getTimelineEvent(event_obj: eventInterface): timelineEvent {
  const event_type = ((event_obj.event === "reviewed"
    ? event_obj.state?.toLowerCase()
    : event_obj.event) || "err") as EventType;

  const display_type = (() => {
    if (other_events.includes(event_obj.event)) {
      return "other";
    }
    if (double_events.includes(event_obj.event)) {
      return "double_link";
    }
    if (single_events.includes(event_obj.event)) {
      return "single_link";
    }
    return "hidden";
  })();

  // TODO: Get correct approval status even when review is stale/dismissed

  const icon_name = (() => {
    if (event_obj.event === "reviewed") {
      const approval_state = (event_obj.state || "err") as EventType;
      return ICONS[approval_state];
    }
    return ICONS[event_obj.event as EventType];
  })();

  const message = (() => {
    if (event_obj.event === "reviewed") {
      const approval_state = (event_obj.state || "err") as EventType;
      return MESSAGES[approval_state];
    }
    if (event_obj.event === "renamed") {
      return `renamed the pull request to ${event_obj.rename?.to || ""}`;
    }
    return MESSAGES[event_obj.event as EventType];
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

/**
 * Given interfaced raw timeline API, return two arrays of processed "timelineEvent" objects.
 * @param timeline Raw timeline API data, interfaced.
 * @returns {beforeCloseTimeline, afterCloseTimeline}
 *    beforeCloseTimeline: All events before the pull request was closed, if it was closed. Otherwise contains all events.
 *    afterCloseTimeline: All events including and after the pull request was closed, if it was closed. Otherwise is empty.
 */
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
