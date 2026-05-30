"use client";

import { useEffect, useState } from "react";
import { FileData, parseDiff, ViewType } from "react-diff-view";
import { Box, Button, Stack } from "@mui/material";
import { readSampleDiff } from "./FileDiff/utils/file-utilities";
import FileDiff from "./FileDiff/components/FileDiff";

/**
 * Documentation:
 * 1. https://www.npmjs.com/package/react-diff-view
 * - Referenced section "Render diff hunks" to setup component.
 * 
 * TODO: responsive switching between unified and split on smaller screens
 * TODO: fetch API data for PR diff, PR files
 */

export default function ReactDiffView() {
  const [files, setFiles] = useState<FileData[]>();
  const [viewType, setViewType] = useState<ViewType>("split");

  useEffect(() => {
    const getParsedDiff = async () => {
      const diffString = await readSampleDiff();
      const parsedDiff = parseDiff(diffString);
      setFiles(parsedDiff);
    };

    getParsedDiff();
  }, []);

  return (
    <Stack spacing={2}>
      <Button
        onClick={() => {
          setViewType((prevViewType) =>
            prevViewType === "split" ? "unified" : "split",
          );
        }}
        sx={{
          alignSelf: "flex-end",
        }}
      >
        Toggle View
      </Button>
      <Box>
        {/* left side: insert file tree that stays as you scroll */}
        {files &&
          files.map((file) => {
            return (
              <FileDiff
                key={`${file.oldRevision}-${file.newRevision}`}
                type={file.type}
                hunks={file.hunks}
                oldPath={file.oldPath}
                newPath={file.newPath}
                viewType={viewType}
              />
            );
          })}
      </Box>
    </Stack>
  );
}
