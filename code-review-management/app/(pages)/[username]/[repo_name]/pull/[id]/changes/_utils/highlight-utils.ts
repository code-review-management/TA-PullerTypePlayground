import { Dispatch, SetStateAction } from "react";
import { ChangeData } from "react-diff-view";
import { Side } from "react-diff-view/types/interface";
import { DraftThreads } from "../_hooks/useDraftThreads";
import { ActiveHighlight } from "../_hooks/useHighlight";
import { getLineNumber } from "./diff-utils";

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

export function highlightOnMouseUp(
  activePath: string,
  activeHighlight: ActiveHighlight,
  setActiveHighlight: Dispatch<SetStateAction<ActiveHighlight>>,
  draftThreads: DraftThreads,
  setDraftThreads: Dispatch<SetStateAction<DraftThreads>>,
) {
  setActiveHighlight((prev) => ({
    ...prev,
    isHighlighting: false,
  }));

  if (!activeHighlight.start || !activeHighlight.end || !activeHighlight.side)
    return;

  const minLine = Math.min(activeHighlight.start, activeHighlight.end);
  const maxLine = Math.max(activeHighlight.start, activeHighlight.end);
  const draftThreadKey = `${activePath}:${maxLine}:${activeHighlight.side}`;

  if (draftThreadKey in draftThreads) return;

  setDraftThreads((prev) => ({
    ...prev,
    [draftThreadKey]: {
      filename: activePath,
      start: minLine,
      end: maxLine,
      side: activeHighlight.side,
      created: new Date().toISOString(),
      body: "",
    },
  }));
}

export function isInsideHighlightRange(
  line: number,
  side: Side,
  activeHighlight: ActiveHighlight,
) {
  if (!activeHighlight.start || !activeHighlight.end || !activeHighlight.side)
    return false;

  const minLine = Math.min(activeHighlight.start, activeHighlight.end);
  const maxLine = Math.max(activeHighlight.start, activeHighlight.end);

  return activeHighlight.side === side && line >= minLine && line <= maxLine;
}
