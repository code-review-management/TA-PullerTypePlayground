import Image from "next/image";
import styles from "./StateChip.module.css";
import { State, ICONS } from "@/app/(pages)/_utils/stateConstants";

export const COLOR_CLASSES: Record<State, string> = {
  open: styles.open,
  closed: styles.closed,
  merged: styles.merged,
  draft: styles.draft,
};

/**
 * State chip indicating whether a pull request is open, closed, merged, or draft
 * displayed on the body header of the PR view page.
 * @param state: open, closed, merged, or draft
 */
export default function StateChip({ state }: { state: State }) {
  const colorClass = COLOR_CLASSES[state];
  const iconSrc = ICONS[state];
  const stateDisplay = `${state[0].toUpperCase()}${state.slice(1)}`;

  return (
    <div className={`${styles.stateChip} ${colorClass}`}>
      <Image src={`/icons/${iconSrc}`} alt={state} height={16} width={16} />
      <p>{stateDisplay}</p>
    </div>
  );
}
