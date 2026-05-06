import DiscussionBox from "../DiscussionBox/DiscussionBox";
import Subheader from "../Subheader/Subheader";
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
      <Subheader>Timeline</Subheader>
      <DiscussionBox />
      <TimelineDisplay username={username} repoName={repoName} id={id} />
    </div>
  );
}
