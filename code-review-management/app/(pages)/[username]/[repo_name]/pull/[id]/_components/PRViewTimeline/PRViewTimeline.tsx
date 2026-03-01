import DiscussionBox from "../DiscussionBox/DiscussionBox";
import TimelineDisplay from "../TimelineDisplay/TimelineDisplay";
import styles from "./PRViewTimeline.module.css";

export default function PRViewTimeline() {
  return (
    <div className={styles.timeline}>
      <h4>Timeline</h4>
      <DiscussionBox />
      <TimelineDisplay />
    </div>
  );
}
