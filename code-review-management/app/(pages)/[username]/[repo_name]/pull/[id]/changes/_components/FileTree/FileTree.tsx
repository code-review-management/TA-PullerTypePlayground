import { useMemo, useState } from "react";
import { FileDiff } from "@/types/github.types";
import { buildFileTree, FileTreeNode } from "../../_utils/filetree-utils";
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

function FileTreeRow({
  node,
  depth = 0,
}: {
  node: FileTreeNode;
  depth?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const xPadding = depth * 16 + 8;

  return (
    <>
      <div
        className={styles.row}
        style={{ paddingLeft: xPadding, paddingRight: xPadding }}
        onClick={
          node.type === "directory"
            ? () => setIsExpanded((prev) => !prev)
            : undefined
        }
      >
        {node.name}
      </div>
      {node.type === "directory" &&
        isExpanded &&
        node.children.map((child) => (
          <FileTreeRow key={child.name} node={child} depth={depth + 1} />
        ))}
    </>
  );
}
