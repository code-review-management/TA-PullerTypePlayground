"use client";

import { Box } from "@mui/material";
import { ReactNode, useState } from "react";
import { BsChatFill } from "react-icons/bs";

/**
 * Documentation:
 * 1. https://github.com/otakustay/react-diff-view/blob/df623b0028afc460e45f5a9b7294ac1d9e20833c/src/context/index.ts#L8
 *    Referenced for `renderGutter` types.
 *
 * 2. https://github.com/otakustay/react-diff-view/issues/59
 */

export default function Gutter({
  renderDefault,
  wrapInAnchor,
}: {
  renderDefault: () => ReactNode;
  wrapInAnchor: (element: ReactNode) => ReactNode;
}) {
  const [isGutterHovered, setIsGutterHovered] = useState(false);

  return (
    <Box
      onMouseEnter={() => setIsGutterHovered(true)}
      onMouseLeave={() => setIsGutterHovered(false)}
      sx={{
        display: "flex",
        alignItems: "center",
      }}
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
