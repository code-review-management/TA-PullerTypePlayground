import { useEffect, useRef } from "react";
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

  useEffect(() => {
    const tree = treeRef.current;
    if (!tree) return;

    const BORDER_SIZE = 4;
    let mousePosition: number;

    function resize(e: MouseEvent) {
      if (tree) {
        const dx = e.x - mousePosition;
        mousePosition = e.x;
        tree.style.width =
          parseInt(getComputedStyle(tree, "").width) + dx + "px";
      }
    }

    function onMouseDown(e: MouseEvent) {
      if (tree && e.offsetX >= tree.offsetWidth - BORDER_SIZE) {
        e.preventDefault();
        mousePosition = e.x;
        document.addEventListener("mousemove", resize, false);
      }
    }

    function onMouseUp() {
      document.removeEventListener("mousemove", resize, false);
    }

    tree.addEventListener("mousedown", onMouseDown, false);
    document.addEventListener("mouseup", onMouseUp, false);

    return () => {
      tree.removeEventListener("mousedown", onMouseDown, false);
      document.removeEventListener("mouseup", onMouseUp, false);
      document.removeEventListener("mousemove", resize, false);
    };
  }, []);

  return (
    <div className={styles.tree} ref={treeRef}>
      {fileTree.map((node: FileTreeNode) => (
        <FileTreeRow key={node.name} node={node} />
      ))}
    </div>
  );
}
