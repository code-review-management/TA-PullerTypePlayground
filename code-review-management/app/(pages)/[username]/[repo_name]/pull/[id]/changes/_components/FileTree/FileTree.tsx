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

    function resize(e: MouseEvent) {
      if (tree) {
        const dx = e.clientX - startX; // How far the mouse has moved from where the drag started.
        tree.style.width = startTreeWidth + dx + "px";
      }
    }

    function onMouseDown(e: MouseEvent) {
      /**
       * Only start dragging if the click lands within the right-side border of
       * the file tree.
       *
       * e.offsetX: Current mouse position relative to the tree's left-edge.
       * e.clientX: Current mouse position relative to the entire viewport.
       * tree.offsetWidth: Current tree's width.
       */
      if (tree && e.offsetX >= tree.offsetWidth - BORDER_SIZE) {
        e.preventDefault();

        startX = e.clientX;
        startTreeWidth = tree.offsetWidth;

        setIsResizing(true);
        document.body.style.cursor = "ew-resize";
        document.addEventListener("mousemove", resize, false);
      }
    }

    function onMouseUp() {
      setIsResizing(false);
      document.body.style.cursor = "auto";
      document.removeEventListener("mousemove", resize, false);
    }

    function onMouseMove(e: MouseEvent) {
      if (tree) {
        if (e.offsetX >= tree.offsetWidth - BORDER_SIZE) {
          setIsHovered(true);
        } else {
          setIsHovered(false);
        }
      }
    }

    function onMouseLeave() {
      if (tree) {
        setIsHovered(false);
      }
    }

    tree.addEventListener("mousedown", onMouseDown, false);
    tree.addEventListener("mousemove", onMouseMove, false);
    tree.addEventListener("mouseleave", onMouseLeave, false);
    document.addEventListener("mouseup", onMouseUp, false);

    return () => {
      tree.removeEventListener("mousedown", onMouseDown, false);
      tree.addEventListener("mousemove", onMouseMove, false);
      tree.addEventListener("mouseleave", onMouseLeave, false);
      document.removeEventListener("mouseup", onMouseUp, false);
      document.removeEventListener("mousemove", resize, false);
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
