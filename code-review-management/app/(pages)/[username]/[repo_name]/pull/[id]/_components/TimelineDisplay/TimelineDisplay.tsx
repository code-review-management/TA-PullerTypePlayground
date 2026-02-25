import Divider from "@/app/(pages)/_components/Divider/Divider";
import styles from "./TimelineDisplay.module.css";
import MOCK_TIMELINE from "@/mocks/timeline.json";
import { ReactNode } from "react";
import { GoBookmark, GoCommit, GoEye, GoGitBranch, GoGitMerge, GoPencil, GoX } from "react-icons/go";

export default function TimelineDisplay() {
  return (
    <div className={styles.timeline}>
      {MOCK_TIMELINE.map((event, idx) => (
        <TimelineEvent key={event.node_id} event_idx={idx} />
      ))}
    </div>
  );
}

function TimelineEvent({ event_idx }: { event_idx: number }) {
  const event = MOCK_TIMELINE[event_idx];

  if (event.event === "committed") {
    const abbr_sha = event.sha?.slice(0, 7);
    return (
      <TimelineEventSmall event_type={event.event}>
        commit {abbr_sha}: {event.message}
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
    return <TimelineEventSmall event_type={event.event}>{event.actor?.login} dismissed a review</TimelineEventSmall>;
  } else if (event.event === "merged") {
    return <TimelineEventSmall event_type={event.event}>{event.actor?.login} merged the PR</TimelineEventSmall>;
  } else if (event.event === "closed") {
    return <Divider />; {/** TODO: make custom divider */}
  } else {
    return (
      <TimelineEventSmall event_type={event.event}>
        {event.actor?.login} {event.event}
      </TimelineEventSmall>
    );
  }
}

function TimelineEventSmall({
  event_type,
  children,
}: {
  event_type: string;
  children: ReactNode;
}) {
  const icon = (() => {
    switch (event_type) {
      case "committed":
        return <GoCommit className={styles.timelineIcon} />;
      case "renamed":
        return <GoPencil className={styles.timelineIcon} />;
      case "ready_for_review":
        return <GoEye className={styles.timelineIcon} />;
      case "review_requested":
        return <GoEye className={styles.timelineIcon} />;
      case "reviewed":
        return <GoEye className={styles.timelineIcon} />;
      case "review_dismissed":
        return <GoX className={styles.timelineIcon} />;
      case "merged":
        return <GoGitMerge className={styles.timelineIcon} />;
      case "head_ref_deleted":
        return <GoGitBranch className={styles.timelineIcon} />;
      case "connected":
        return <GoBookmark className={styles.timelineIcon} />
      default:
        return <div />;
    }
  })();

  return (
    <div className={styles.eventSmall}>
      <div>{icon}</div>
      {children}
    </div>
  );
}
