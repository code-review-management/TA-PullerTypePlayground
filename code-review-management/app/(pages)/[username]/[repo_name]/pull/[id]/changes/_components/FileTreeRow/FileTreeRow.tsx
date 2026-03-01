import { useState } from "react";
import { FileTreeNode } from "../../_utils/filetree-utils";
import FileTreeDividers from "../FileTreeDividers/FileTreeDividers";
import FileTreeIcon from "../FileTreeIcon/FileTreeIcon";
import styles from "./FileTreeRow.module.css";

const BASE_PADDING = 8;
const INDENT_PADDING = 16;

/**
 * Renders a single row in the file tree. Represents either a file or a
 * directory. If the current row is a directory, recursively renders its
 * children below it.
 *
 * @param node: `FileTreeNode` object representing the node to render.
 * @param depth: How many levels deep the row is nested. Defaults to 0.
 */
export default function FileTreeRow({
  node,
  depth = 0,
}: {
  node: FileTreeNode;
  depth?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const onFolderClick = () => setIsExpanded((prev) => !prev);

  return (
    <>
      <div
        className={styles.row}
        onClick={node.type === "directory" ? onFolderClick : undefined}
      >
        <FileTreeDividers
          depth={depth}
          basePadding={BASE_PADDING}
          indentPadding={INDENT_PADDING}
        />
        <div
          className={styles.label}
          style={{ paddingLeft: depth * INDENT_PADDING + BASE_PADDING }}
        >
          <FileTreeIcon node={node} isExpanded={isExpanded} />
          <span className={styles.filename}>{node.name}</span>
        </div>
      </div>
      {node.type === "directory" &&
        node.children.map((child) => (
          <div key={child.name} className={!isExpanded ? styles.collapsed : ""}>
            <FileTreeRow node={child} depth={depth + 1} />
          </div>
        ))}
    </>
  );
}
