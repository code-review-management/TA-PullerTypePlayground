"use client";

import { useEffect, useState } from "react";
import { FileData, parseDiff } from "react-diff-view";
import { readSampleDiff } from "./_utilities/file-utilities";
import FileDiff from "./_components/FileDiff/FileDiff";

/**
 * Documentation:
 * 1. https://www.npmjs.com/package/react-diff-view
 * - Referenced section "Render diff hunks" to setup component.
 */

export default function ReactDiffView() {
  const [files, setFiles] = useState<FileData[]>();

  useEffect(() => {
    const getParsedDiff = async () => {
      const diffString = await readSampleDiff();
      const parsedDiff = parseDiff(diffString);
      setFiles(parsedDiff);
    };

    getParsedDiff();
  }, []);

  return (
    <>
      {files &&
        files.map((file) => {
          return (
            <FileDiff
              key={`${file.oldRevision}-${file.newRevision}`}
              type={file.type}
              hunks={file.hunks}
              oldPath={file.oldPath}
              newPath={file.newPath}
            />
          );
        })}
    </>
  );
}
