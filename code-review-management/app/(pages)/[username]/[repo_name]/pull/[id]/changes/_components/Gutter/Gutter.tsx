import { ReactNode } from "react";
import { ChangeData } from "react-diff-view";
import { Side } from "react-diff-view/types/interface";
import { ActiveHighlight } from "../../_hooks/useHighlight";
import { getLineNumber } from "../../_utils/diff-utils";
import { isInsideHighlightRange } from "../../_utils/highlight-utils";
import styles from "./Gutter.module.css";

export default function Gutter({
  change,
  side,
  renderDefault,
  wrapInAnchor,
  activeHighlight,
}: {
  change: ChangeData;
  side: Side;
  renderDefault: () => ReactNode;
  wrapInAnchor: (element: ReactNode) => ReactNode;
  activeHighlight: ActiveHighlight;
}) {
  const line = getLineNumber(change, side);
  const isHighlighted = isInsideHighlightRange(line, side, activeHighlight);

  return (
    <div
      className={`${styles.gutter} ${isHighlighted ? "diff-gutter-highlighted" : ""}`}
    >
      <span className="diff-gutter-icon">+</span>
      <div className={styles.number}>{renderDefault()}</div>
    </div>
  );
}
