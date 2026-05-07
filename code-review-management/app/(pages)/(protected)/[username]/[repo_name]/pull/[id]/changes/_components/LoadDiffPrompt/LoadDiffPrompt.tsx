import { Dispatch, SetStateAction } from "react";
import styles from "./LoadDiffPrompt.module.css";

export type LoadDiffReason = "size-limit" | "line-limit" | "removed";

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
function getDescription(reason: LoadDiffReason): string {
  const SIZE_PHRASE = {
    "size-limit": "exceeds 1MB",
    "line-limit": "exceeds 500 lines",
  };

  if (reason === "removed") return "This file was removed.";
  return `Large diffs ${SIZE_PHRASE[reason]} are not rendered by default.`;
}
