import Divider from "@/app/(pages)/_components/Divider/Divider";
import styles from "./TimelineDisplay.module.css";
import MOCK_TIMELINE from "@/mocks/timeline.json";
import { ReactNode } from "react";
import {
  EventType,
  timelineEvent,
  processTimeline,
  review_states,
} from "./processTimeline";
import Image from "next/image";
import Link from "next/link";
import PRViewComment from "../PRViewComment/PRViewComment";

/**
 * Renders the timeline of events.
 */
export default function TimelineDisplay() {
  // TODO: Use real data instead of MOCK_TIMELINE
  const { beforeCloseTimeline, afterCloseTimeline } =
    processTimeline(MOCK_TIMELINE);

  return (
    <div className={styles.timeline}>
      {afterCloseTimeline.map((event: timelineEvent) => (
        <TimelineEvent key={event.event_obj.node_id} event={event} />
      ))}
      <div className={styles.beforeCloseTimeline}>
        {beforeCloseTimeline.map((event: timelineEvent) => (
          <TimelineEvent key={event.event_obj.node_id} event={event} />
        ))}
        <div className={styles.timelineLineBackground} />
      </div>
    </div>
  );
}

/**
 * Renders an event in the timeline. Content and styling is dynamic based on event type.
 *
 * TODO: Separate different event type components this code is very ugly lol
 * TODO: Use schemas for different event types instead of this YOLOed interface
 * TODO: Get info not provided by timeline endpoint (commit pfps, linked issue, branch name)
 *
 * @param event Object representing the event from the timeline.
 */
function TimelineEvent({ event }: { event: timelineEvent }) {
  if (event.display_type === "hidden") {
    console.log(`"${event.event_type}" hidden`); // TODO: REMOVE THIS DEBUG PRINT
    return;
  }
  if (event.display_type === "other") {
    if (event.event_type === "committed") {
      const abbr_sha = event.event_obj.sha?.slice(0, 7);
      return (
        <TimelineEventSmall
          event_type={event.event_type}
          icon_name={event.icon_name}
        >
          <div className={styles.committedLine}>
            <p className={styles.commitLineText}>
              {/** TODO: Link to commit on GH */}
              <Link className={styles.commitSha} href={""}>
                #{abbr_sha}
              </Link>{" "}
              {event.event_obj.message}
            </p>
            {/** TODO: Replace with user icon component */}
            <div className={styles.tempUserIcon}>
              <Image src="/mock/octocat.png" alt="@octocat" fill />
            </div>{" "}
          </div>
        </TimelineEventSmall>
      );
    } else if (event.event_type === "closed") {
      return <Divider />;
      {
        /** TODO: make custom divider */
      }
    } else {
      console.log(
        `"${event.event_type}" as 'other' display type not supported`,
      ); // TODO: REMOVE THIS DEBUG PRINT
      return;
    }
  }
  if (review_states.includes(event.event_type)) {
    if (event.event_obj.body === null) {
      return (
        <TimelineEventSmall
          event_type={event.event_type}
          icon_name={event.icon_name}
        >
          <p>
            <UserLink username={event.event_obj.user?.login || ""} />{" "}
            {event.message}
          </p>
        </TimelineEventSmall>
      );
    }
    const comment_date = new Date(event.event_obj.submitted_at || "") || "";
    const month = comment_date.toLocaleString("default", { month: "short" });
    const timeString = comment_date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const formatted_date = `${month} ${comment_date.getDay()}, ${comment_date.getFullYear()} at ${timeString}`;

    return (
      <>
        <TimelineEventSmall
          event_type={event.event_type}
          icon_name={event.icon_name}
        >
          <p>
            <UserLink username={event.event_obj.user?.login || ""} />{" "}
            {event.message}
          </p>
        </TimelineEventSmall>
        <PRViewComment
          username={event.event_obj.user?.login || ""}
          createdAt={formatted_date}
          description={event.event_obj.body || ""}
          inTimeline
        />
      </>
    );
  }
  if (event.display_type === "single_link") {
    return (
      <TimelineEventSmall
        event_type={event.event_type}
        icon_name={event.icon_name}
      >
        <p>
          <UserLink username={event.actor1 || ""} /> {event.message}
        </p>
      </TimelineEventSmall>
    );
  }
  if (event.display_type === "double_link") {
    return (
      <TimelineEventSmall
        event_type={event.event_type}
        icon_name={event.icon_name}
      >
        <p>
          <UserLink username={event.actor1 || ""} /> {event.message}{" "}
          <UserLink username={event.actor2 || ""} />
        </p>
      </TimelineEventSmall>
    );
  } else {
    console.log(`"${event.event_type}" not supported`); // TODO: REMOVE THIS DEBUG PRINT
    return;
  }
}

/**
 * A one-line event on the timeline including a small icon placed on the timeline "line"
 * and custom content to the right of it.
 *
 * @param event_type: Type of the event
 * @param children: Inner React node
 * @param icon_name: Name of the icon, used to form the Image src displayed
 */
function TimelineEventSmall({
  event_type,
  children,
  icon_name,
}: {
  event_type: EventType;
  children: ReactNode;
  icon_name: string;
}) {
  const large_icon_event_types = ["approved", "changes_requested"];
  const is_large_icon = large_icon_event_types.includes(event_type);
  const icon_size = is_large_icon ? 30 : 20;

  return (
    <div className={styles.eventSmall}>
      <div
        className={`${styles.timelineIcon} ${!is_large_icon && styles.timelineIconPadded}`}
      >
        <Image
          src={`/icons/timeline/${icon_name}.svg`}
          alt="timeline_commit"
          height={icon_size}
          width={icon_size}
        />
      </div>
      {children}
    </div>
  );
}

/**
 * Creates a Link element that displays a GitHub username and links to that GitHub profile.
 * Styled for PR view timeline usage.
 * @param username: GitHub username of the user this links to.
 */
function UserLink({ username }: { username: string }) {
  return (
    <Link href={`https://github.com/${username}`} className={styles.userLink}>
      {username}
    </Link>
  );
}
