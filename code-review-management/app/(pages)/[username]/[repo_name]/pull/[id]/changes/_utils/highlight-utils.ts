import { Dispatch, SetStateAction } from "react";
import { ChangeData } from "react-diff-view";
import { Side } from "react-diff-view/types/interface";
import { ActiveHighlight } from "../_hooks/useHighlight";
import { getLineNumber } from "./diff-utils";

export function isInsideHighlightRange(
  line: number,
  side: Side,
  activeHighlight: ActiveHighlight,
) {
  if (!activeHighlight.start || !activeHighlight.end || !activeHighlight.side)
    return false;

  const min = Math.min(activeHighlight.start, activeHighlight.end);
  const max = Math.max(activeHighlight.start, activeHighlight.end);

  return activeHighlight.side === side && line >= min && line <= max;
}

export function highlightOnMouseDown(
  change: ChangeData,
  side: Side,
  setActiveHighlight: Dispatch<SetStateAction<ActiveHighlight>>,
) {
  const line = getLineNumber(change, side);
  setActiveHighlight((prev) => ({
    ...prev,
    isHighlighting: true,
    start: line,
    end: line,
    side: side,
  }));
}

export function highlightOnMouseEnter(
  change: ChangeData,
  side: Side,
  activeHighlight: ActiveHighlight,
  setActiveHighlight: Dispatch<SetStateAction<ActiveHighlight>>,
) {
  if (!activeHighlight.isHighlighting || side !== activeHighlight.side) return;

  const line = getLineNumber(change, side);
  setActiveHighlight((prev) => ({
    ...prev,
    end: line,
  }));
}
