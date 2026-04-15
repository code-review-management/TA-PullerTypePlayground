import { RefObject, useEffect, useState } from "react";

export function useResizableFileTree(
  treeRef: RefObject<HTMLDivElement | null>,
) {
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

    // Only start dragging if the click lands within the right-side border of
    // the file tree.
    function startResize(e: MouseEvent) {
      // e.offsetX: Current mouse position relative to the tree's left-edge.
      // tree.offsetWidth: Current tree's width.
      if (tree && e.offsetX >= tree.offsetWidth - BORDER_SIZE) {
        e.preventDefault();

        // e.clientX: Current mouse position relative to the entire viewport.
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
  }, [treeRef]);

  return { isResizing, isHovered };
}
