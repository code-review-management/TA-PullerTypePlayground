import { useMemo } from "react";
import { FileDiff } from "@/types/github.types";
import { buildFileTree } from "../../_utils/filetree-utils";
import FileTreeRow from "../FileTreeRow/FileTreeRow";
import styles from "./FileTree.module.css";

export default function FileTree({ files }: { files: FileDiff[] }) {
  const fileTree = useMemo(() => buildFileTree(files), [files]);
  return (
    <div className={styles.tree}>
      {fileTree.map((node) => (
        <FileTreeRow key={node.name} node={node} />
      ))}
    </div>
  );
}
