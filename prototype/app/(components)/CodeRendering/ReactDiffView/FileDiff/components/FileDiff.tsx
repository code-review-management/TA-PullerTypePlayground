import { Box } from "@mui/material";
import { Fragment, ReactNode, useState } from "react";
import {
  Diff,
  Hunk,
  DiffType,
  HunkData,
  ChangeData,
  getChangeKey,
  Decoration,
  ViewType,
} from "react-diff-view";

import { getLineKey, getTokens } from "../utils/component-helpers";
import { handleCopy, handleGutterClick } from "../utils/event-handlers";
import { MockComments } from "../../InlineComments/sample-data/MockComments";

import CommentThread from "../../InlineComments/components/CommentThread/CommentThread";
import FileHeader from "./FileHeader";
import Gutter from "./Gutter";

import "./FileDiff.css";
import "prismjs/themes/prism.css";
import "react-diff-view/style/index.css";

export default function FileDiff({
  type,
  hunks,
  oldPath,
  newPath,
  viewType,
}: {
  type: DiffType;
  hunks: HunkData[];
  oldPath: string;
  newPath: string;
  viewType: ViewType;
}) {
  const [selectedLines, setSelectedLines] = useState<Set<string>>(new Set());
  const [activeCommentLine, setActiveCommentLine] = useState<string>("");

  const widgets = hunks.reduce((acc: Record<string, ReactNode>, hunk) => {
    hunk.changes.forEach((change) => {
      const lineKey = getLineKey(
        change,
        change.type === "delete" ? "old" : "new", // fix to account for normal lines
      );
      const changeKey = getChangeKey(change);

      if (activeCommentLine === lineKey) {
        acc[changeKey] = <CommentThread thread={MockComments} />;
      }
    });
    return acc;
  }, {});

  const renderGutter = ({
    change,
    side,
    renderDefault,
    wrapInAnchor,
  }: {
    change: ChangeData;
    side: "new" | "old";
    renderDefault: () => ReactNode;
    wrapInAnchor: (element: ReactNode) => ReactNode;
  }) => {
    return (
      <Gutter
        change={change}
        side={side}
        renderDefault={renderDefault}
        wrapInAnchor={wrapInAnchor}
        selectedLines={selectedLines}
      />
    );
  };

  return (
    <Box
      sx={{
        marginBottom: "16px",
        boxShadow: "0 0 4px #46464626",
        borderRadius: 1,
        border: "0.5px solid rgb(209, 217, 224)",
        overflow: "hidden",
      }}
      onCopy={handleCopy}
    >
      <FileHeader newPath={newPath} />
      <Diff
        diffType={type}
        gutterEvents={{
          onClick: ({ change, side }) =>
            handleGutterClick(
              change,
              side,
              activeCommentLine,
              setActiveCommentLine,
            ),
        }}
        hunks={hunks}
        key={oldPath + "-" + newPath}
        optimizeSelection
        renderGutter={renderGutter}
        tokens={getTokens(hunks, newPath)}
        viewType={viewType}
        widgets={widgets}
        // gutterType="anchor"
        // generateAnchorID={}
      >
        {(hunks) =>
          hunks.map((hunk) => {
            return (
              <Fragment key={"hunk-" + hunk.content}>
                <Decoration>{hunk.content}</Decoration>
                <Hunk hunk={hunk} />
              </Fragment>
            );
          })
        }
      </Diff>
    </Box>
  );
}
