"use client";

import { useEffect, useState } from "react";
import { parseDiff, FileData } from "react-diff-view";
import { readFile } from "./_utilities/file-utilities";
import FileDiff from "./_components/FileDiff/FileDiff";

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
              <FileDiff
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
