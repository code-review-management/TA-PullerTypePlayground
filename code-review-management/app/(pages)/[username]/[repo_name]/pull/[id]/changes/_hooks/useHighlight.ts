import { useState } from "react";
import { DiffProps } from "react-diff-view";
import { Side } from "react-diff-view/types/interface";
import {
  highlightOnMouseDown,
  highlightOnMouseEnter,
} from "../_utils/highlight-utils";

export interface ActiveHighlight {
  isHighlighting: boolean;
  start: number | null;
  end: number | null;
  side: Side | null;
}

export function useHighlight() {
  const [activeHighlight, setActiveHighlight] = useState<ActiveHighlight>({
    isHighlighting: false,
    start: null,
    end: null,
    side: null,
  });

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
