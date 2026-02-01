"use client";

import "./ReactDiffView.css";

import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import {
  parseDiff,
  Diff,
  Hunk,
  DiffType,
  HunkData,
  FileData,
  markEdits,
  tokenize,
} from "react-diff-view";
import { readFile } from "./utilities/read-file";
import FileHeader from "./components/FileHeader";
import Gutter from "./components/Gutter";

function RenderFile({
  oldRevision,
  newRevision,
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
  const tokens = tokenize(hunks, {
    enhancers: [markEdits(hunks, { type: "line" })],
  });

  const handleCopy = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    e.preventDefault();
    e.clipboardData.setData("text/plain", selection.toString());
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
        optimizeSelection
        key={oldRevision + "-" + newRevision}
        viewType="split"
        diffType={type}
        hunks={hunks}
        tokens={tokens}
        renderGutter={Gutter}
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

export default function ReactDiffView() {
  const [files, setFiles] = useState<FileData[]>();

  useEffect(() => {
    const readDiff = async () => {
      const data = await readFile();
      setFiles(parseDiff(data));
    };

    readDiff();
  }, []);

  return (
    <div>
      {files &&
        files.map((file) => {
          return (
            <div key={`${file.oldPath}-${file.newPath}`}>
              <RenderFile
                oldRevision={file.oldRevision}
                newRevision={file.newRevision}
                type={file.type}
                hunks={file.hunks}
                oldPath={file.oldPath}
                newPath={file.newPath}
              />
            </div>
          );
        })}
    </div>
  );
}
