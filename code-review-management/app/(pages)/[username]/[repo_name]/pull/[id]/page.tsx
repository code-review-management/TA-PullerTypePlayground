"use client";
import Divider from "@/app/(pages)/_components/Divider/Divider";
import PullBodyDescription from "./_components/PullBodyDescription/PullBodyDescription";
import PullBodyHeader from "./_components/PullBodyHeader/PullBodyHeader";
import styles from "./page.module.css";
import MOCK_PULL from "@/mocks/pull.json";
import StatusSection from "./_components/StatusSection/StatusSection";
import Reviewers from "./_components/Reviewers/Reviewers";
import Assignees from "./_components/Assignees/Assignees";
import CISection from "./_components/CISection/CISection";
import PRHeader from "./_components/PRHeader/PRHeader";
// import { useParams } from 'next/navigation'

// Pull Request View page.
export default function Pull() {
  // TODO: Use params to fetch PR info
  // const params = useParams();
  // const {username, repo_name, id} = params;

  return (
    <div className={styles.page}>
      <PRHeader />
      <div className={styles.pageBody}>
        <div className={styles.bodyMain}>
          <PullBodyHeader />
          <Divider />
          <PullBodyDescription
            username={MOCK_PULL.user}
            createdAt={MOCK_PULL.created_at}
            description={MOCK_PULL.description}
          />
          {/* <div className={styles.timelinePlaceholder}>Timeline</div>
          <div className={styles.timelinePlaceholder}>Timeline</div>
          <div className={styles.timelinePlaceholder}>Timeline</div>
          <div className={styles.timelinePlaceholder}>Timeline</div>
          <div className={styles.timelinePlaceholder}>Timeline</div>
          <div className={styles.timelinePlaceholder}>Timeline</div>
          <div className={styles.timelinePlaceholder}>Timeline</div>
          <div className={styles.timelinePlaceholder}>Timeline</div>
          <div className={styles.timelinePlaceholder}>Timeline</div>
          <div className={styles.timelinePlaceholder}>Timeline</div>
          <div className={styles.timelinePlaceholder}>Timeline</div>
          <div className={styles.timelinePlaceholder}>Timeline</div> */}
        </div>
        <div className={styles.infoColumn}>
          <StatusSection />
          <Divider />
          <Reviewers />
          <Divider />
          <Assignees />
          <Divider />
          <CISection />
          <Divider />
        </div>
      </div>
    </div>
  );
}
