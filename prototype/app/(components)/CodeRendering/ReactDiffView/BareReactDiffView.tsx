import { useEffect, useState } from "react";
import {
  Diff,
  DiffType,
  FileData,
  Hunk,
  HunkData,
  parseDiff,
} from "react-diff-view";
import { readFile } from "./_utilities/file-utilities";
import "react-diff-view/style/index.css";

function renderFile({
  oldRevision,
  newRevision,
  type,
  hunks,
}: {
  oldRevision: string;
  newRevision: string;
  type: DiffType;
  hunks: HunkData[];
}) {
  return (
    <Diff
      key={oldRevision + "-" + newRevision}
      viewType="split"
      diffType={type}
      hunks={hunks}
    >
      {(hunks) => hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk} />)}
    </Diff>
  );
}

export default function BareReactDiffView() {
  const [files, setFiles] = useState<FileData[]>();

  useEffect(() => {
    const readDiff = async () => {
      const data = await readFile();
      setFiles(parseDiff(data));
    };
    readDiff();
  }, []);

  return <div>{files && files.map(renderFile)}</div>;
}
