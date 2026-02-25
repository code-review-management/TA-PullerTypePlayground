import styles from "./TimelineDisplay.module.css";
import MOCK_TIMELINE from "@/mocks/timeline.json";

export default function TimelineDisplay() {
  return (
    <div className={styles.timeline}>
      {MOCK_TIMELINE.map((event, idx) => (
        <TimelineEvent key={event.node_id} event_idx={idx}/>
      ))}
    </div>
  );
}

function TimelineEvent({
    event_idx
}: {
    event_idx: number
}) {
    const event = MOCK_TIMELINE[event_idx];

    if (event.event === "committed") {
        const abbr_sha = event.sha?.slice(0, 7);
        return (
            <div>commit {abbr_sha}: {event.message}</div>
        );
    }

    else if (event.event === "renamed") {
        return (
            <div>{event.actor?.login} renamed to {event.rename?.to}</div>
        );
    }

    else if (event.event === "review_requested") {
        return (
            <div>{event.review_requester?.login} requested review from {event.requested_reviewer?.login}</div>
        );
    }

    else if (event.event === "reviewed") {
        return (
            <div>reviewed by {event.user?.login}: {event.body}</div>
        );
    }

    else if (event.event === "review_dismissed") {
        return (
            <div>{event.actor?.login} dismissed a review</div>
        );
    }

    else if (event.event === "merged") {
        return (
            <div>{event.actor?.login} merged the PR</div>
        );
    }

    else if (event.event === "closed") {
        return (
            <div>{event.actor?.login} closed the PR</div>
        );
    }

    else {
        return (
            <div>{event.actor?.login} {event.event}</div>
        );
    }
}
