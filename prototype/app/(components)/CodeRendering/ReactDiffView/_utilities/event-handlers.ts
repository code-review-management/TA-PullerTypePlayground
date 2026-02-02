import { ChangeData } from "react-diff-view";
import { getLineKey } from "./component-helpers";
import { Dispatch, SetStateAction } from "react";

export const handleCopy = (e: React.ClipboardEvent<HTMLDivElement>) => {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed) return;

  e.preventDefault();
  e.clipboardData.setData("text/plain", selection.toString());
};

/**
 * Documentation:
 * 1. https://stackoverflow.com/questions/72383412/react-passing-state-setter-usestate-to-child-component-with-typescript
 * - Referenced for state setter types.
 */

export const handleGutterClick = (
  change: ChangeData | null,
  side: "new" | "old" | undefined,
  activeCommentLine: string,
  setActiveCommentLine: Dispatch<SetStateAction<string>>,
) => {
  if (!change || !side) return;
  const lineKey = getLineKey(change, side);

  // setSelectedLines((prev) => {
  //   const newSelection = new Set(prev);

  //   if (newSelection.has(lineKey)) {
  //     newSelection.delete(lineKey);
  //   } else {
  //     newSelection.add(lineKey);
  //   }

  //   return newSelection;
  // });

  setActiveCommentLine(activeCommentLine === lineKey ? "" : lineKey);
};
