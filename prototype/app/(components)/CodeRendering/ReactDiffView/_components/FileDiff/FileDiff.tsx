import "./FileDiff.css";

import { Box } from "@mui/material";
import { ReactNode, useState } from "react";
import {
  Diff,
  Hunk,
  DiffType,
  HunkData,
  markEdits,
  tokenize,
  ChangeData,
  getChangeKey,
} from "react-diff-view";

import { getLineKey } from "../../_utilities/get-line-key";

import CommentWidget from "../CommentEditorWidget/CommentWidget";
import FileHeader from "../FileHeader/FileHeader";
import Gutter from "../Gutter/Gutter";

export default function FileDiff({
  type,
  hunks,
  oldPath,
  newPath,
}: {
  oldRevision: string;
  newRevision: string;
  type: DiffType;
  hunks: HunkData[];
  oldPath: string;
  newPath: string;
}) {
  const [selectedLines, setSelectedLines] = useState<Set<string>>(new Set());
  const [activeCommentLine, setActiveCommentLine] = useState<string | null>();

  const widgets = hunks.reduce((acc: Record<string, ReactNode>, hunk) => {
    hunk.changes.forEach((change) => {
      // fix to account for normal lines
      const lineKey = getLineKey(change, change.type === "delete" ? "old" : "new");
      const changeKey = getChangeKey(change);

      if (activeCommentLine === lineKey) {
        acc[changeKey] = <CommentWidget />;
      }
    });
    return acc;
  }, {});

  const tokens = tokenize(hunks, {
    enhancers: [markEdits(hunks, { type: "line" })],
  });

  const handleCopy = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    e.preventDefault();
    e.clipboardData.setData("text/plain", selection.toString());
  };

  const handleGutterClick = (
    change: ChangeData | null,
    side: "new" | "old" | undefined,
  ) => {
    if (!change || !side) return;

    const lineKey = getLineKey(change, side);
    console.log("Selected: " + lineKey);

    // setSelectedLines((prev) => {
    //   const newSelection = new Set(prev);

    //   if (newSelection.has(lineKey)) {
    //     newSelection.delete(lineKey);
    //   } else {
    //     newSelection.add(lineKey);
    //   }

    //   return newSelection;
    // });
    setActiveCommentLine(activeCommentLine === lineKey ? null : lineKey);
  };

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
        // "& .diff-code": {
        //   fontFamily: robotoMono.style.fontFamily,
        // }
      }}
      onCopy={handleCopy}
    >
      <FileHeader newPath={newPath} />
      <Diff
        optimizeSelection
        key={oldPath + "-" + newPath}
        viewType="split"
        diffType={type}
        hunks={hunks}
        tokens={tokens}
        renderGutter={renderGutter}
        gutterEvents={{
          onClick: ({ change, side }) => handleGutterClick(change, side),
        }}
        widgets={widgets}

        // gutterType="anchor"
        // generateAnchorID={}
      >
        {(hunks) =>
          hunks.map((hunk) => {
            return (
              // <>
              // {/* <Decoration>{hunk.content}</Decoration> */}
              <Hunk key={"hunk-" + hunk.content} hunk={hunk} />
              // </>
            );
          })
        }
      </Diff>
    </Box>
  );
}
