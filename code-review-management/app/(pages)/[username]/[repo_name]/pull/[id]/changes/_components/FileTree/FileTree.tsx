import { useEffect, useRef, useState } from "react";
import { FileTreeNode } from "../../_utils/filetree-utils";
import FileTreeRow from "../FileTreeRow/FileTreeRow";
import styles from "./FileTree.module.css";

/**
 * Tree of pull request files.
 *
 * @param fileTree: Array of `FileTreeNode`s representing the file hierarchy.
 */
export default function FileTree({ fileTree }: { fileTree: FileTreeNode[] }) {
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const treeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tree = treeRef.current;
    if (!tree) return;

    const BORDER_SIZE = 4; // Width of the right-side border used for resizing.
    let startX: number; // Viewport x-coordinate at mouse down (e.clientX).
    let startTreeWidth: number; // Tree width at mouse down (tree.offsetWidth).

    function applyResize(e: MouseEvent) {
      if (tree) {
        const dx = e.clientX - startX; // How far the mouse has moved from where the drag started.
        tree.style.width = startTreeWidth + dx + "px";
      }
    }

    /**
     * Only start dragging if the click lands within the right-side border of
     * the file tree.
     *
     * e.offsetX: Current mouse position relative to the tree's left-edge.
     * e.clientX: Current mouse position relative to the entire viewport.
     * tree.offsetWidth: Current tree's width.
     */
    function startResize(e: MouseEvent) {
      if (tree && e.offsetX >= tree.offsetWidth - BORDER_SIZE) {
        e.preventDefault();

        startX = e.clientX;
        startTreeWidth = tree.offsetWidth;

        setIsResizing(true);
        document.body.style.cursor = "ew-resize";
        document.addEventListener("mousemove", applyResize, false);
      }
    }

    function stopResize() {
      setIsResizing(false);
      document.body.style.cursor = "auto";
      document.removeEventListener("mousemove", applyResize, false);
    }

    function updateHoverState(e: MouseEvent) {
      if (tree && e.offsetX >= tree.offsetWidth - BORDER_SIZE) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    }

    function clearHoverState() {
      if (tree) setIsHovered(false);
    }

    tree.addEventListener("mousemove", updateHoverState, false);
    tree.addEventListener("mouseleave", clearHoverState, false);
    tree.addEventListener("mousedown", startResize, false);
    document.addEventListener("mouseup", stopResize, false);

    return () => {
      tree.removeEventListener("mousemove", updateHoverState, false);
      tree.removeEventListener("mouseleave", clearHoverState, false);
      tree.removeEventListener("mousedown", startResize, false);
      document.removeEventListener("mouseup", stopResize, false);
      document.removeEventListener("mousemove", applyResize, false);
    };
  }, []);

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
