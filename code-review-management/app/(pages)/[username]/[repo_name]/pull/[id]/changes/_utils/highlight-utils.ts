import { Dispatch, SetStateAction } from "react";
import { ChangeData } from "react-diff-view";
import { Side } from "react-diff-view/types/interface";
import { Drafts } from "../_hooks/useDrafts";
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
  drafts: Drafts,
  setDrafts: Dispatch<SetStateAction<Drafts>>,
) {
  setActiveHighlight((prev) => ({
    ...prev,
    isHighlighting: false,
  }));

  if (!activeHighlight.start || !activeHighlight.end || !activeHighlight.side)
    return;

  const minLine = Math.min(activeHighlight.start, activeHighlight.end);
  const maxLine = Math.max(activeHighlight.start, activeHighlight.end);
  const draftKey = `${activePath}:${maxLine}:${activeHighlight.side}`;

  if (draftKey in drafts) return;

  setDrafts((prev) => ({
    ...prev,
    [draftKey]: {
      path: activePath,
      body: "",
      startLine: minLine,
      endLine: maxLine,
      side: activeHighlight.side,
      createdAt: new Date().toISOString(),
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
