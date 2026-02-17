"use client";

import { Box } from "@mui/material";
import { ReactNode, useState } from "react";
import { ChangeData } from "react-diff-view";
import { BsChatFill } from "react-icons/bs";
import { getLineKey } from "../utils/component-helpers";

/**
 * Documentation:
 * 1. https://github.com/otakustay/react-diff-view/blob/df623b0028afc460e45f5a9b7294ac1d9e20833c/src/context/index.ts#L8
 * - Referenced for `renderGutter` types.
 *
 * 2. https://github.com/otakustay/react-diff-view/issues/59
 */

export default function Gutter({
  change,
  side,
  renderDefault,
  wrapInAnchor,
  selectedLines,
}: {
  change: ChangeData;
  side: "new" | "old";
  renderDefault: () => ReactNode;
  wrapInAnchor: (element: ReactNode) => ReactNode;
  selectedLines: Set<string>;
}) {
  const [isGutterHovered, setIsGutterHovered] = useState(false);
  const lineKey = getLineKey(change, side);
  const isSelected = selectedLines.has(lineKey);

  return (
    <Box
      onMouseEnter={() => setIsGutterHovered(true)}
      onMouseLeave={() => setIsGutterHovered(false)}
      sx={{
        display: "flex",
        alignItems: "center",
      }}
      className={isSelected ? "gutter-selected" : ""}
    >
      <BsChatFill
        size={10}
        style={{
          color: "rgb(63, 65, 68)",
          marginRight: "auto",
          visibility: isGutterHovered ? "visible" : "hidden",
          flexShrink: 0,
        }}
      />
      {wrapInAnchor(renderDefault())}
    </Box>
  );
}
