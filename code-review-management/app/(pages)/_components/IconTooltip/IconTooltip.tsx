import { PositionStrategy, Tooltip } from "react-tooltip";
import styles from "./IconTooltip.module.css";

/**
 * Docs:
 * 1. https://react-tooltip.com/docs/examples/styling#classes
 */

export default function IconTooltip({
  id,
  positionStrategy,
}: {
  id: string;
  positionStrategy?: PositionStrategy;
}) {
  return (
    // Include container arround tooltip to increase CSS specificity for
    // overriding default tooltip style.
    <div className={styles.wrapper}>
      <Tooltip
        id={id}
        noArrow
        opacity={100}
        globalCloseEvents={{ scroll: true }}
        positionStrategy={positionStrategy}
        className={styles.tooltip}
      />
    </div>
  );
}
