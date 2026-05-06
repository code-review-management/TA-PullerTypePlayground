import Image from "next/image";
import styles from "./BranchDisplay.module.css";

export default function BranchDisplay({
  headRef,
  baseRef,
}: {
  headRef: string;
  baseRef: string;
}) {
  return (
    <div className={styles.branchDisplay}>
      <div className={styles.branchChip}>
        <p className={styles.branchName}>{headRef}</p>
      </div>
      <Image
        src="/icons/merge_direction.svg"
        width={16}
        height={12}
        alt="Right arrow"
      />
      <div className={styles.branchChip}>
        <p className={styles.branchName}>{baseRef}</p>
      </div>
    </div>
  );
}
