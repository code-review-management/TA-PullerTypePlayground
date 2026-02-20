import Image from "next/image";
import styles from "./StatusFlagChip.module.css";
import { Status, COLOR_CLASSES, ICONS, TEXT } from "./statusConstants";

/**
 * Status flag chip indicating a merge conflict, waiting for reviewers, CI failure,
 * or ready to merge status for a PR. Multiple chips may be displayed in the
 * status section of the PR view page.
 * @param state: ready, waiting, conflict, or failure
 */
export default function StatusFlagChip({ status }: { status: Status }) {
  const colorClass = COLOR_CLASSES[status];
  const iconSrc = ICONS[status];
  const textDisplay = TEXT[status];

  return (
    <div className={`${styles.statusFlagChip} ${colorClass}`}>
      <Image src={`/icons/${iconSrc}`} alt={status} height={20} width={20} />
      <p>{textDisplay}</p>
    </div>
  );
}
