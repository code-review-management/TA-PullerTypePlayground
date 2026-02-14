'use client';
import styles from "./page.module.css"
import { useParams } from 'next/navigation'

export default function Pull() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className={styles.page}>
        Viewing pull request {id}
    </div>
  );
}