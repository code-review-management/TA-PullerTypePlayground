'use client';
import Divider from "@/app/(pages)/_components/Divider/Divider";
import PullBodyDescription from "./_components/PullBodyDescription/PullBodyDescription";
import PullBodyHeader from "./_components/PullBodyHeader/PullBodyHeader";
import styles from "./page.module.css"
import MOCK_PULL from "@/mocks/pull.json"
import StatusSection from "./_components/StatusSection/StatusSection";
// import { useParams } from 'next/navigation'

export default function Pull() {
  // TODO: Use params to fetch PR info
  // const params = useParams();
  // const {username, repo_name, id} = params;

  return (
    <div className={styles.page}>
        <div>
          Page header
        </div>
        <div className={styles.pageBody}>
          <div className={styles.bodyMain}>
            <PullBodyHeader />
            <Divider />
            <PullBodyDescription username={MOCK_PULL.user} createdAt={MOCK_PULL.created_at} description={MOCK_PULL.description} />
            <div>Timeline</div>
          </div>
          <div className={styles.infoColumn}>
            <StatusSection />
            <Divider />
            <div>Reviewers</div>
            <Divider />
            <div>Assignees</div>
            <Divider />
            <div>CI Checks</div>
            <Divider />
          </div>
        </div>
    </div>
  );
}
