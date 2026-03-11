import DiscussionBox from "../DiscussionBox/DiscussionBox";
import TimelineDisplay from "../TimelineDisplay/TimelineDisplay";
import styles from "./PRViewTimeline.module.css";

export default function PRViewTimeline({
  username,
  repoName,
  id,
}: {
  username: string;
  repoName: string;
  id: string;
}) {
  return (
    <div className={styles.timeline}>
      <h4>Timeline</h4>
      <DiscussionBox />
      <TimelineDisplay username={username} repoName={repoName} id={id} />
    </div>
  );
}
