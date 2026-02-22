import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DiffProps } from "react-diff-view";
import { Side } from "react-diff-view/types/interface";
import {
  highlightOnMouseDown,
  highlightOnMouseEnter,
  highlightOnMouseUp,
} from "../_utils/highlight-utils";
import { DraftThreads } from "./useDraftThreads";

export interface ActiveHighlight {
  isHighlighting: boolean;
  start: number | null; // Number of the first line clicked to begin highlight.
  end: number | null; // Number of the last line entered before ending highlight.
  side: Side | null;
}

/**
 * A hook to maintain the active highlight state in a file diff. Registers event
 * handlers to keep track of when the user's mouse clicks down and drags through
 * the gutters. When the user's mouse is released, a new draft thread is
 * generated and associated with those highlighted lines.
 *
 * @param filename: The file associated with this active highlight state.
 * @param draftThreads: The state of draft threads in the pull request diff.
 * @param setDraftThreads: The state setter for `draftThreads`.
 * @returns: The `activeHighlight` state and associated gutter events for highlighting.
 */
export function useHighlight(
  filename: string,
  draftThreads: DraftThreads,
  setDraftThreads: Dispatch<SetStateAction<DraftThreads>>,
) {
  const [activeHighlight, setActiveHighlight] = useState<ActiveHighlight>({
    isHighlighting: false,
    start: null,
    end: null,
    side: null,
  });

  const highlightEvents: DiffProps["gutterEvents"] = {
    // Starts a new highlight session when the user clicks on a gutter.
    onMouseDown: ({ change, side }) => {
      if (!change || !side) return;
      highlightOnMouseDown(change, side, setActiveHighlight);
    },
    // Updates the highlighted lines as the user drags their mouse through the gutters.
    onMouseEnter: ({ change, side }) => {
      if (!change || !side) return;
      highlightOnMouseEnter(change, side, activeHighlight, setActiveHighlight);
    },
  };

  /**
   * Registers an event listener to stop highlighting when the user's mouse is
   * released. This is registered as a document listener – NOT as a gutter event
   * – because the user might drag their cursor outside the gutter, then release
   * their mouse.
   */
  useEffect(() => {
    const handleMouseUp = () => {
      if (activeHighlight.isHighlighting) {
        highlightOnMouseUp(
          filename,
          activeHighlight,
          setActiveHighlight,
          draftThreads,
          setDraftThreads,
        );
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [filename, activeHighlight, draftThreads, setDraftThreads]);

  return { activeHighlight, highlightEvents };
}
