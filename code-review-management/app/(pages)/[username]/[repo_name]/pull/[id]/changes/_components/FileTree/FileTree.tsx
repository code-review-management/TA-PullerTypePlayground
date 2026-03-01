import { useMemo } from "react";
import { FileDiff } from "@/types/github.types";
import { buildFileTree, FileTreeNode } from "../../_utils/filetree-utils";
import FileTreeRow from "../FileTreeRow/FileTreeRow";
import styles from "./FileTree.module.css";

/**
 * Tree of pull request files.
 * 
 * @param files: List of `FileDiff` objects for each of the pull request files.
 */
export default function FileTree({ files }: { files: FileDiff[] }) {
  const fileTree = useMemo(() => buildFileTree(files), [files]);
  return (
    <div className={styles.tree}>
      {fileTree.map((node: FileTreeNode) => (
        <FileTreeRow key={node.name} node={node} />
      ))}
    </div>
  );
}
