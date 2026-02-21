import { ReactNode } from "react";
import { ChangeData } from "react-diff-view";
import { Side } from "react-diff-view/types/interface";
import styles from "./Gutter.module.css";

export default function Gutter({
  change,
  side,
  renderDefault,
  wrapInAnchor,
}: {
  change: ChangeData;
  side: Side;
  renderDefault: () => ReactNode;
  wrapInAnchor: (element: ReactNode) => ReactNode;
}) {
  return (
    <div className={styles.gutter}>
      <span className={styles.icon}>+</span>
      <div className={styles.number}>{renderDefault()}</div>
    </div>
  );
}
