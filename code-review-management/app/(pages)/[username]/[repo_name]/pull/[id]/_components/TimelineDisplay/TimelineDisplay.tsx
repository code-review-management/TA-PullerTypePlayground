import Divider from "@/app/(pages)/_components/Divider/Divider";
import styles from "./TimelineDisplay.module.css";
import { ReactNode } from "react";
import {
  EventType,
  processedTimelineEvent,
  processTimeline,
  isReviewState,
} from "./processTimeline";
import Image from "next/image";
import PRViewComment from "../PRViewComment/PRViewComment";
import UserIcon from "@/app/(pages)/_components/UserIcon/UserIcon";
import { useTimelineQuery } from "@/lib/api/queries/useTimelineQuery";
import { ReviewComment } from "@/types/github.types";

/**
 * Renders the timeline of events.
 */
export default function TimelineDisplay({
  username,
  repoName,
  id,
}: {
  username: string;
  repoName: string;
  id: string;
}) {
  const { data, isPending, isError } = useTimelineQuery(username, repoName, id);

  // TODO: Replace with proper loading/error UI.
  if (isPending) return <div>Loading pull request...</div>;
  if (isError) return <div>Failed to load pull request.</div>;

  // TODO: Use real data instead of MOCK_TIMELINE
  const { beforeCloseTimeline, afterCloseTimeline } = processTimeline(data);

  console.log(beforeCloseTimeline, afterCloseTimeline);

  return (
    <div className={styles.timeline}>
      {afterCloseTimeline.map(
        (event: processedTimelineEvent) =>
          event.eventObj && (
            <TimelineEventDisplay
              key={
                `after-close-timeline-${event.eventKey}`
              }
              event={event}
            />
          ),
      )}
      <div className={styles.beforeCloseTimeline}>
        {beforeCloseTimeline.map(
          (event: processedTimelineEvent) =>
            event.eventObj && (
              <TimelineEventDisplay
                key={
                  `before-close-timeline-${event.eventKey}`
                }
                event={event}
              />
            ),
        )}
        <div className={styles.timelineLineBackground} />
      </div>
    </div>
  );
}

/**
 * Renders an event in the timeline. Content and styling is dynamic based on event type.
 * TODO: Get info not provided by timeline endpoint (commit pfps, branch name)
 * TODO: Use branch name and get commit SHA correctly for merge and delete events
 * @param event Object representing the event from the timeline.
 */
function TimelineEventDisplay({ event }: { event: processedTimelineEvent }) {
  if (event.displayType === "hidden") {
    console.log(`"${event.eventType}" hidden`); // TODO: REMOVE THIS DEBUG PRINT
    return;
  }
  if (event.displayType === "other") {
    if (event.eventType === "committed") {
      return <TimelineCommit event={event} />;
    } else if (event.eventType === "closed") {
      return <Divider />;
      {
        /** TODO: make custom divider */
      }
    } else {
      console.log(`"${event.eventType}" as 'other' display type not supported`); // TODO: REMOVE THIS DEBUG PRINT
      return;
    }
  }
  if (isReviewState(event.eventType)) {
    return <TimelineReview event={event} />;
  }
  if (event.displayType === "single_link") {
    return (
      <TimelineEventSmall eventType={event.eventType} iconName={event.iconName}>
        <p>
          <UserLink username={event.actor1 || ""} /> {event.message}
        </p>
      </TimelineEventSmall>
    );
  }
  if (event.displayType === "double_link") {
    return (
      <TimelineEventSmall eventType={event.eventType} iconName={event.iconName}>
        <p>
          <UserLink username={event.actor1 || ""} /> {event.message}{" "}
          <UserLink username={event.actor2 || ""} />
        </p>
      </TimelineEventSmall>
    );
  } else {
    console.log(`"${event.eventType}" not supported`); // TODO: REMOVE THIS DEBUG PRINT
    return;
  }
}

/**
 * Commit event component displayed in timeline.
 * Displays abbreviated SHA, commit message, and user icon.
 * TODO: Get username from somewhere to be able to get user icon src.
 * TODO: Collapse long commit messages by default and implement interactive expand.
 *
 * @param event: Object representing the event that is the commit.
 */
function TimelineCommit({ event }: { event: processedTimelineEvent }) {
  if (!event.eventObj) {
    return;
  }
  const abbr_sha = "sha" in event.eventObj ? event.eventObj.sha?.slice(0, 7) : "";
  const message = "message" in event.eventObj ? event.eventObj.message : "";
  return (
    <TimelineEventSmall eventType={event.eventType} iconName={event.iconName}>
      <div className={styles.committedLine}>
        <p className={styles.commitLineText}>
          {/** TODO: Link to commit on GH */}
          <a className={styles.commitSha} href={""}>
            #{abbr_sha}
          </a>{" "}
          {message}
        </p>
        <UserIcon avatarUrl="/mock/octocat.png" username="octocat" size={18} />
      </div>
    </TimelineEventSmall>
  );
}

/**
 * Renders a review event on the timeline.
 * Note there are two types of reviews that can be rendered on the timeline: review with comment (body)
 *      and review without comment (body).
 * @param event: Object representing the event that is the review.
 */
function TimelineReview({ event }: { event: processedTimelineEvent }) {
  if (!event.eventObj) {
    return;
  }

  console.log(event.eventObj);

  if ("comments" in event.eventObj && event.eventObj.comments && event.eventObj.comments.length > 0) {
    return event.eventObj.comments.map((comment: ReviewComment) => 
      <PRViewComment
        key={`timeline-review-${comment.id}`}
        username={comment.user?.login || ""}
        createdAt={comment.created_at || ""}
        description={comment.body || ""}
        avatarUrl={comment.user?.avatar_url}
        inTimeline
      />
    )
  }

  // Review with reviews

  // Review without comment (body)
  if ("body" in event.eventObj && event.eventObj.body === null) {
    return (
      <TimelineEventSmall eventType={event.eventType} iconName={event.iconName}>
        <p>
          <UserLink username={event.eventObj.user?.login || ""} />{" "}
          {event.message}
        </p>
      </TimelineEventSmall>
    );
  }

  // Review with comment (body)
  else {
    return <TimelineReviewWithComment event={event} />;
  }
}

/**
 * Renders a review event that has a comment (body).
 * Uses the same comment comopnent as the pull body description (`PullBodyDescription`).
 * @param event: Object representing the event that is the review.
 */
function TimelineReviewWithComment({ event }: { event: processedTimelineEvent }) {
  if (!event.eventObj) {
    return;
  }

  return (
    <>
      <TimelineEventSmall eventType={event.eventType} iconName={event.iconName}>
        <p>
          <UserLink username={event.actor1 || ""} />{" "}
          {event.message}
        </p>
      </TimelineEventSmall>
      <PRViewComment
        username={event.actor1 || ""}
        createdAt={"submitted_at" in event.eventObj ? event.eventObj.submitted_at : ""}
        description={"body" in event.eventObj ? event.eventObj.body || "" : ""}
        inTimeline
      />
    </>
  );
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
  eventType,
  children,
  iconName,
}: {
  eventType: EventType;
  children: ReactNode;
  iconName: string;
}) {
  const largeIconEventTypes = ["approved", "changes_requested"];
  const isLargeIcon = largeIconEventTypes.includes(eventType);
  const iconSize = isLargeIcon ? 30 : 20;

  return (
    <div className={styles.eventSmall}>
      <div
        className={`${styles.timelineIcon} ${!isLargeIcon && styles.timelineIconPadded}`}
      >
        <Image
          src={`/icons/timeline/${iconName}.svg`}
          alt={`${iconName}`}
          height={iconSize}
          width={iconSize}
        />
      </div>
      {children}
    </div>
  );
}

/**
 * Creates a link element that displays a GitHub username and links to that GitHub profile.
 * Styled for PR view timeline usage.
 * @param username: GitHub username of the user this links to.
 */
function UserLink({ username }: { username: string }) {
  return (
    <a href={`https://github.com/${username}`} className={styles.userLink}>
      {username}
    </a>
  );
}
