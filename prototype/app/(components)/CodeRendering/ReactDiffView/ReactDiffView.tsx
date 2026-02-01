"use client";

import { useEffect, useState } from "react";
import { parseDiff, FileData } from "react-diff-view";
import { readFile } from "./_utilities/read-file";
import DiffFile from "./_components/FileDiff/FileDiff";

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
              <DiffFile
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
