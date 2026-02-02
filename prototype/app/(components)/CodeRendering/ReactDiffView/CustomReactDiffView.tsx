"use client";

import { useEffect, useState } from "react";
import { parseDiff, FileData } from "react-diff-view";
import { readFile } from "./_utilities/file-utilities";
import FileDiff from "./_components/FileDiff/FileDiff";
import { Box } from "@mui/material";

export default function CustomReactDiffView() {
  const [files, setFiles] = useState<FileData[]>();

  useEffect(() => {
    const readDiff = async () => {
      const data = await readFile();
      setFiles(parseDiff(data));
    };
    readDiff();
  }, []);

  return (
    <Box>
      {files &&
        files.map((file) => {
          return (
            <Box key={`${file.oldPath}-${file.newPath}`}>
              <FileDiff
                type={file.type}
                hunks={file.hunks}
                oldPath={file.oldPath}
                newPath={file.newPath}
              />
            </Box>
          );
        })}
    </Box>
  );
}
