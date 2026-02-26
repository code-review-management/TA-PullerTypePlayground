import Divider from "@/app/(pages)/_components/Divider/Divider";
import styles from "./TimelineDisplay.module.css";
import MOCK_TIMELINE from "@/mocks/timeline.json";
import { ReactNode } from "react";
import { EventType, ICONS } from "./constants";
import Image from "next/image";
import Link from "next/link";

export default function TimelineDisplay() {
  return (
    <div className={styles.timeline}>
      {MOCK_TIMELINE.toReversed().map((event, idx) => (
        <TimelineEvent key={event.node_id} event_idx={idx} />
      ))}
      <div className={styles.timelineLineBackground}/>
    </div>
  );
}

/**
 * TODO: Separate different event type components this code is very ugly lol
 * TODO: Use schemas for different event types instead of hacky idx fix
 * TODO: Get info not provided by timeline endpoint (commit pfps, linked issue, branch name)
 * @param event_idx IDX of the event to be displayed from the timeline. Used to avoid typing problems for now (temporary)
 */
function TimelineEvent({ event_idx }: { event_idx: number }) {
  const timeline = MOCK_TIMELINE.toReversed();
  const event = timeline[event_idx];

  if (event.event === "committed") {
    const abbr_sha = event.sha?.slice(0, 7);
    return (
      <TimelineEventSmall event_type={event.event}>
        <div className={styles.committedLine}>
          <p className={styles.commitLineText}>
            <span className={styles.commitSha}>#{abbr_sha}</span>{" "}
            {event.message}
          </p>
          {/** TODO: Replace with user icon component */}
          <div className={styles.tempUserIcon}>
            <Image src="/mock/octocat.png" alt="@octocat" fill />
          </div>{" "}
        </div>
      </TimelineEventSmall>
    );
  } else if (event.event === "renamed") {
    return (
      <TimelineEventSmall event_type={event.event}>
        <p>
          <UserLink username={event.actor?.login || ""} /> renamed the pull
          request to {event.rename?.to}
        </p>
      </TimelineEventSmall>
    );
  } else if (event.event === "review_requested") {
    return (
      <TimelineEventSmall event_type={event.event}>
        <p>
          <UserLink username={event.review_requester?.login || ""} /> requested
          a review from{" "}
          <UserLink username={event.requested_reviewer?.login || ""} />
        </p>
      </TimelineEventSmall>
    );
  } else if (event.event === "reviewed") {
    return (
      <div>
        reviewed by {event.user?.login}: {event.body}
      </div>
    );
  } else if (event.event === "review_dismissed") {
    return (
      <TimelineEventSmall event_type={event.event}>
        <p>
          <UserLink username={event.actor?.login || ""} /> dismissed a review
        </p>
      </TimelineEventSmall>
    );
  } else if (event.event === "merged") {
    return (
      <TimelineEventSmall event_type={event.event}>
        <p>
          <UserLink username={event.actor?.login || ""} /> merged commit
        </p>
      </TimelineEventSmall>
    );
  } else if (event.event === "closed") {
    return <Divider />;
    {
      /** TODO: make custom divider */
    }
  } else if (event.event === "ready_for_review") {
    return (
      <TimelineEventSmall event_type={event.event}>
        <p>
          <UserLink username={event.actor?.login || ""} />{" "}
          marked this pull request as ready for review
        </p>
      </TimelineEventSmall>
    );
  } else if (event.event === "connected") {
    return (
      <TimelineEventSmall event_type={event.event}>
        <p>
          <UserLink username={event.actor?.login || ""} />{" "}
          connected this pull request to issue....??
        </p>
      </TimelineEventSmall>
    );
  } else if (event.event === "head_ref_deleted") {
    return (
      <TimelineEventSmall event_type={event.event}>
        <p>
          <UserLink username={event.actor?.login || ""} />{" "}
          deleted branch.....
        </p>
      </TimelineEventSmall>
    );
  } else {
    return (
      <TimelineEventSmall event_type={event.event as EventType}>
        <p>
          {event.actor?.login} {event.event}
        </p>
      </TimelineEventSmall>
    );
  }
}

function UserLink({ username }: { username: string }) {
  return <Link href={`https://github.com/${username}`} className={styles.userLink}>{username}</Link>;
}

function TimelineEventSmall({
  event_type,
  children,
}: {
  event_type: EventType;
  children: ReactNode;
}) {
  return (
    <div className={styles.eventSmall}>
      <div className={styles.timelineIcon}>
        <Image
          src={`/icons/timeline/${ICONS[event_type]}.svg`}
          alt="timeline_commit"
          height={20}
          width={20}
        />
      </div>
      {children}
    </div>
  );
}
