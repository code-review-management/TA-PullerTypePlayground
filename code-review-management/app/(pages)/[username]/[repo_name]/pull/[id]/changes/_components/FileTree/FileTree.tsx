import { useMemo, useRef, useState } from "react";
import { useResizableFileTree } from "../../_hooks/useResizableFileTree";
import {
  FileTreeNode,
  filterFileTreeBySearch,
} from "../../_utils/filetree-utils";
import FileTreeRow from "../FileTreeRow/FileTreeRow";
import FileTreeSearchBar from "../FileTreeSearchBar/FileTreeSearchBar";
import styles from "./FileTree.module.css";

/**
 * Tree of pull request files.
 *
 * @param fileTree: Array of `FileTreeNode`s representing the file hierarchy.
 */
export default function FileTree({ fileTree }: { fileTree: FileTreeNode[] }) {
  const treeRef = useRef<HTMLDivElement>(null);
  const { isResizing, isHovered } = useResizableFileTree(treeRef);
  const [searchString, setSearchString] = useState("");

  const filters = useMemo(
    () => filterFileTreeBySearch(fileTree, searchString),
    [fileTree, searchString],
  );

  return (
    <div
      className={`${styles.container} ${isResizing ? styles.resizing : ""} ${isHovered ? styles.hovered : ""}`}
      data-testid="file-tree"
      ref={treeRef}
    >
      <FileTreeSearchBar
        searchString={searchString}
        setSearchString={setSearchString}
      />
      <div className={styles.tree}>
        {fileTree.map((node: FileTreeNode) => (
          <FileTreeRow key={node.name} node={node} filters={filters} />
        ))}
      </div>
    </div>
  );
}
