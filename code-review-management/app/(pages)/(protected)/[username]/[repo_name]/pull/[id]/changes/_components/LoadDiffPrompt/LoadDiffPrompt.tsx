import { Dispatch, SetStateAction } from "react";
import styles from "./LoadDiffPrompt.module.css";

export type LoadDiffReason = {
  removed: boolean;
  size: "size-limit" | "line-limit" | null;
};

const SIZE_PHRASE = {
  "size-limit": "exceeds 1MB",
  "line-limit": "exceeds 500 lines",
};

export default function LoadDiffPrompt({
  setIsDiffLoaded,
  reason,
}: {
  setIsDiffLoaded: Dispatch<SetStateAction<boolean>>;
  reason: LoadDiffReason | null;
}) {
  return (
    <div className={styles.container}>
      <button className={styles.load} onClick={() => setIsDiffLoaded(true)}>
        Load diff
      </button>
      {reason && <p className={styles.reason}>{getDescription(reason)}</p>}
    </div>
  );
}
function getDescription({ removed, size }: LoadDiffReason): string {
  if (removed && size) {
    return `This file was removed and ${SIZE_PHRASE[size]}. Expanding may reduce performance.`;
  }
  if (removed) return "This file was removed.";
  return `This diff ${SIZE_PHRASE[size!]}. Expanding may reduce performance.`;
}
