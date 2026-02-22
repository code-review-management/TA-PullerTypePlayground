import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DiffProps } from "react-diff-view";
import { Side } from "react-diff-view/types/interface";
import {
  highlightOnMouseDown,
  highlightOnMouseEnter,
  highlightOnMouseUp,
} from "../_utils/highlight-utils";
import { Drafts } from "./useDrafts";

export interface ActiveHighlight {
  isHighlighting: boolean;
  start: number | null;
  end: number | null;
  side: Side | null;
}

export function useHighlight(
  activePath: string,
  drafts: Drafts,
  setDrafts: Dispatch<SetStateAction<Drafts>>,
) {
  const [activeHighlight, setActiveHighlight] = useState<ActiveHighlight>({
    isHighlighting: false,
    start: null,
    end: null,
    side: null,
  });

  useEffect(() => {
    const handleMouseUp = () => {
      if (activeHighlight.isHighlighting) {
        highlightOnMouseUp(
          activePath,
          activeHighlight,
          setActiveHighlight,
          drafts,
          setDrafts,
        );
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [activePath, activeHighlight, drafts, setDrafts]);

  const highlightEvents: DiffProps["gutterEvents"] = {
    onMouseDown: ({ change, side }) => {
      if (!change || !side) return;
      highlightOnMouseDown(change, side, setActiveHighlight);
    },
    onMouseEnter: ({ change, side }) => {
      if (!change || !side) return;
      highlightOnMouseEnter(change, side, activeHighlight, setActiveHighlight);
    },
  };

  return { activeHighlight, highlightEvents };
}
