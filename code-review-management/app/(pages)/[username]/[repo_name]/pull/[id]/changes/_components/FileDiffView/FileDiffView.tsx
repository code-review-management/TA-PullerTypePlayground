import { Roboto_Mono } from "next/font/google";
import { Diff, FileData, Hunk, HunkData, ViewType } from "react-diff-view";
import FileDiffHeader from "../FileDiffHeader/FileDiffHeader";

import styles from "./FileDiffView.module.css";
import "react-diff-view/style/index.css";
import "./ReactDiffView.css";

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

/**
 * Docs:
 * 1. https://github.com/otakustay/react-diff-view?tab=readme-ov-file#render-diff-hunks
 */

export default function FileDiffView({
  oldRevision,
  newRevision,
  oldPath,
  newPath,
  diffType,
  viewType,
  hunks,
}: {
  oldRevision: string;
  newRevision: string;
  oldPath: string;
  newPath: string;
  diffType: FileData["type"];
  viewType: ViewType;
  hunks: HunkData[];
}) {
  return (
    <div className={`${styles.fileDiffView} ${robotoMono.variable}`}>
      <FileDiffHeader diffType={diffType} oldPath={oldPath} newPath={newPath} />
      <Diff
        key={oldRevision + "-" + newRevision}
        viewType={viewType}
        diffType={diffType}
        hunks={hunks}
      >
        {(hunks) =>
          hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk} />)
        }
      </Diff>
    </div>
  );
}
