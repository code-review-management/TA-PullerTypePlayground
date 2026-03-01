import { useState } from "react";
import { FileTreeNode } from "../../_utils/filetree-utils";
import FileTreeDividers from "../FileTreeDividers/FileTreeDividers";
import styles from "./FileTreeRow.module.css";

export default function FileTreeRow({
  node,
  depth = 0,
}: {
  node: FileTreeNode;
  depth?: number;
}) {
  const BASE_PADDING = 8;
  const INDENT_PADDING = 16;
  const [isExpanded, setIsExpanded] = useState(true);

  const onFolderClick = () => {
    setIsExpanded((prev) => !prev);
  };

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
          style={{
            paddingLeft: depth * INDENT_PADDING + BASE_PADDING,
          }}
        >
          {node.name}
        </div>
      </div>
      {node.type === "directory" &&
        isExpanded &&
        node.children.map((child) => (
          <FileTreeRow key={child.name} node={child} depth={depth + 1} />
        ))}
    </>
  );
}
