import { TimelineEvent } from "@/types/github.types";

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
  body?: string | null;
  user?: { login: string };
  submitted_at?: string;
  state?: string;
}

/**
 * Possible states a "review" type event can have
 * Used to check if an event is a review when rendering it in TimelineEvent component.
 */
const REVIEW_STATES = [
  "approved",
  "commented",
  "changes_requested",
  "dismissed",
];

export function isReviewState(state: string) {
  return REVIEW_STATES.includes(state);
}

// Events that follow the single link structure "[actor1] {message}".
const SINGLE_EVENTS = [
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
const DOUBLE_EVENTS = ["assigned", "review_requested"];

// Events that do not follow common "single link" or "double link" structures when rendered
const OTHER_EVENTS = ["committed", "closed", ...REVIEW_STATES];

/**
 * Raw events returned from API response will be parsed into timelineEvents
 * timelineEvents are then rendered in the timeline display
 */
export interface timelineEvent {
  eventObj: TimelineEvent;
  iconName: string;
  message: string;
  displayType: "single_link" | "double_link" | "other" | "hidden";
  eventType: EventType;
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
  head_ref_deleted: "deleted the branch",
  merged: "merged this pull request",
  ready_for_review: "marked this pull request as ready for review",
  renamed: "renamed the pull request to",
  review_dismissed: "dismissed a review",
  review_requested: "requested a review from",
  reviewed: "reviewed",
};

/**
 *
 * @param eventObj eventInterface (interfaced response) object
 * @param eventType
 * @returns The username of "actor1" for this event, or null.
 */
function getActor1(eventObj: TimelineEvent, eventType: EventType) {
  if (eventType === null || eventObj === null) {
    return null;
  }
  if (eventType === "review_requested") {
    return eventObj.review_requester?.login;
  }
  if (eventObj.actor) {
    return eventObj.actor.login;
  }
  return null;
}

/**
 *
 * @param eventObj eventInterface (interfaced response) object
 * @param eventType
 * @returns The username of "actor2" for this event, or null.
 */
function getActor2(eventObj: eventInterface, eventType: EventType) {
  if (eventType === "review_requested") {
    return eventObj.requested_reviewer?.login;
  }
  if (eventType === "assigned") {
    return eventObj.assignee?.login;
  }
  return null;
}

/**
 * export interface timelineEvent {
  eventObj: TimelineEvent;
  iconName: string;
  message: string;
  displayType: "single_link" | "double_link" | "other" | "hidden";
  eventType: EventType;
  actor1: string | null;
  actor2: string | null;
}
 */

/**
 * Parse eventInterface objects into
 * @param eventObj Interfaced raw data from API response.
 * @returns A single timelineEvent object.
 */
function getTimelineEvent(eventObj: TimelineEvent): timelineEvent {
  if (eventObj === null) {
    return {
      eventObj,
      iconName: "",
      message: "",
      displayType: "hidden",
      eventType: "err",
      actor1: null,
      actor2: null,
    };
  }
  const eventType = ((eventObj.event === "reviewed"
    ? eventObj.state?.toLowerCase()
    : eventObj.event) || "err") as EventType;

  const displayType = (() => {
    if (OTHER_EVENTS.includes(eventObj.event)) {
      return "other";
    }
    if (DOUBLE_EVENTS.includes(eventObj.event)) {
      return "double_link";
    }
    if (SINGLE_EVENTS.includes(eventObj.event)) {
      return "single_link";
    }
    return "hidden";
  })();

  // TODO: Get correct approval status even when review is stale/dismissed

  const iconName = (() => {
    if (eventObj.event === "reviewed") {
      return ICONS[(eventObj.state || "err") as EventType];
    }
    return ICONS[eventObj.event as EventType];
  })();

  const message = (() => {
    if (eventObj.event === "reviewed") {
      return MESSAGES[(eventObj.state || "err") as EventType];
    }
    // TODO: Add back in "renamed" event when exists on backend
    // if (eventObj.event === "renamed") {
    //   return `renamed the pull request to ${eventObj.rename?.to || ""}`;
    // }
    return MESSAGES[eventObj.event as EventType];
  })();

  const actor1 = getActor1(eventObj, eventType) || null;
  const actor2 = getActor2(eventObj, eventType) || null;

  return {
    eventObj,
    iconName,
    message,
    displayType,
    eventType,
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
export function processTimeline(timeline: TimelineEvent[]): {
  beforeCloseTimeline: timelineEvent[];
  afterCloseTimeline: timelineEvent[];
} {
  const processedTimeline = timeline
    .toReversed()
    .map((eventObj) => getTimelineEvent(eventObj));
  const closedIdx = processedTimeline.findIndex(
    (event) => event.eventObj && event.eventObj.event === "closed",
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
