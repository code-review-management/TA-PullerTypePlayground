import { Dispatch, SetStateAction } from "react";
import styles from "./LoadRemovedFile.module.css";

export default function LoadRemovedFile({
  setIsDiffLoaded,
}: {
  setIsDiffLoaded: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className={styles.container}>
      <button className={styles.load} onClick={() => setIsDiffLoaded(true)}>
        Load diff
      </button>
      <p className={styles.description}>This file was removed.</p>
    </div>
  );
}
