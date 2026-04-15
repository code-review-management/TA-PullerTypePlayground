import { useRef } from "react";
import { useResizableFileTree } from "../../_hooks/useResizableFileTree";
import { FileTreeNode } from "../../_utils/filetree-utils";
import FileTreeRow from "../FileTreeRow/FileTreeRow";
import styles from "./FileTree.module.css";

/**
 * Tree of pull request files.
 *
 * @param fileTree: Array of `FileTreeNode`s representing the file hierarchy.
 */
export default function FileTree({ fileTree }: { fileTree: FileTreeNode[] }) {
  const treeRef = useRef<HTMLDivElement>(null);
  const { isResizing, isHovered } = useResizableFileTree(treeRef);

  return (
    <div
      className={`${styles.container} ${isResizing ? styles.resizing : ""} ${isHovered ? styles.hovered : ""}`}
      ref={treeRef}
    >
      <div className={styles.tree}>
        {fileTree.map((node: FileTreeNode) => (
          <FileTreeRow key={node.name} node={node} />
        ))}
      </div>
    </div>
  );
}
