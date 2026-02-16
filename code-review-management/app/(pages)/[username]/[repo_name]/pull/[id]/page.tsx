'use client';
import styles from "./page.module.css"
import { useParams } from 'next/navigation'

export default function Pull() {
  const params = useParams();
  const {username, repo_name, id} = params;

  return (
    <div className={styles.page}>
        <div>
          Page header
        </div>
        <div className={styles.pageBody}>
          <div className={styles.bodyMain}>
            <div>Body header Viewing pull request {id} from {username}/{repo_name}</div>
            <div>Description</div>
            <div>Timeline</div>
          </div>
          <div className={styles.infoColumn}>
            <div>Status flags</div>
            <div>Reviewers</div>
            <div>Assignees</div>
            <div>CI Checks</div>
          </div>
        </div>
    </div>
  );
}