'use client';
import styles from "./page.module.css"
import { useParams } from 'next/navigation'

export default function Pull() {
  const params = useParams();
  const {username, repo_name, id} = params;

  return (
    <div className={styles.page}>
        Viewing pull request {id} from {username}/{repo_name}
    </div>
  );
}