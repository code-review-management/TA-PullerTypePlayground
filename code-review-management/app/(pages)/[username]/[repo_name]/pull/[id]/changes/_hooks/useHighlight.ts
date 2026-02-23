import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
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
 * @param setDraftThreads: The state setter for `draftThreads`.
 * @returns: The `activeHighlight` state and associated gutter events for highlighting.
 */
export function useHighlight(
  filename: string,
  setDraftThreads: Dispatch<SetStateAction<DraftThreads>>,
) {
  const [activeHighlight, _setActiveHighlight] = useState<ActiveHighlight>({
    isHighlighting: false,
    start: null,
    end: null,
    side: null,
  });

  /**
   * We need a ref to access a mutable value that persists across re-renders,
   * and this ref will stay in sync with the `activeHighlight` state. Without
   * it, there are issues where the event handler for `onMouseUp` will access
   * the stale value of `activeHighlight`. This is because React batches state
   * updates, so state updates are not applied immediately. By updating the ref
   * everytime we update the state, we can access the most up-to-date value of
   * `activeHighlight` through this ref before the re-render occurs.
   */
  const activeHighlightRef = useRef(activeHighlight);
  const setActiveHighlightSync = (data: ActiveHighlight) => {
    _setActiveHighlight(data);
    activeHighlightRef.current = data;
  };

  const highlightEvents: DiffProps["gutterEvents"] = {
    // Starts a new highlight session when the user clicks on a gutter.
    onMouseDown: ({ change, side }) => {
      if (!change || !side) return;
      highlightOnMouseDown(change, side, setActiveHighlightSync);
    },
    // Updates the highlighted lines as the user drags their mouse through the gutters.
    onMouseEnter: ({ change, side }) => {
      if (!change || !side) return;
      highlightOnMouseEnter(
        change,
        side,
        activeHighlightRef,
        setActiveHighlightSync,
      );
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
      if (activeHighlightRef.current.isHighlighting) {
        highlightOnMouseUp(
          filename,
          activeHighlightRef,
          setActiveHighlightSync,
          setDraftThreads,
        );
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [filename, setDraftThreads]);

  return { activeHighlight, highlightEvents };
}
