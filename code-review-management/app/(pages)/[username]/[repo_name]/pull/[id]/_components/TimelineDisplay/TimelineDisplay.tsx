import Divider from "@/app/(pages)/_components/Divider/Divider";
import styles from "./TimelineDisplay.module.css";
import MOCK_TIMELINE from "@/mocks/timeline.json";
import { ReactNode } from "react";
import { EventType, ICONS } from "./constants";
import Image from "next/image";

export default function TimelineDisplay() {
  return (
    <div className={styles.timeline}>
      {MOCK_TIMELINE.toReversed().map((event, idx) => (
        <TimelineEvent key={event.node_id} event_idx={idx} />
      ))}
    </div>
  );
}

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
        {event.actor?.login} renamed to {event.rename?.to}
      </TimelineEventSmall>
    );
  } else if (event.event === "review_requested") {
    return (
      <TimelineEventSmall event_type={event.event}>
        {event.review_requester?.login} requested review from{" "}
        {event.requested_reviewer?.login}
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
        {event.actor?.login} dismissed a review
      </TimelineEventSmall>
    );
  } else if (event.event === "merged") {
    return (
      <TimelineEventSmall event_type={event.event}>
        {event.actor?.login} merged the PR
      </TimelineEventSmall>
    );
  } else if (event.event === "closed") {
    return <Divider />;
    {
      /** TODO: make custom divider */
    }
  } else {
    return (
      <TimelineEventSmall event_type={event.event as EventType}>
        {event.actor?.login} {event.event}
      </TimelineEventSmall>
    );
  }
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
      <div>
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
