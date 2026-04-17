import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { FileDiff } from "@/types/github.types";
import { FileTreeNode } from "../../_utils/filetree-utils";
import FileTreeIcon from "./FileTreeIcon";

describe("FileTreeIcon", () => {
  const directoryNode: FileTreeNode = {
    type: "directory",
    name: "src",
    children: [],
  };

  const createFileNode = (status: string): FileTreeNode => ({
    type: "file",
    name: "index.ts",
    fileDiff: { status } as FileDiff,
  });

  describe("directory nodes", () => {
    it("renders an open folder icon when expanded", () => {
      render(<FileTreeIcon node={directoryNode} isExpanded />);
      expect(screen.getByAltText("Open folder")).toBeInTheDocument();
    });

    it("renders a closed folder icon when not expanded", () => {
      render(<FileTreeIcon node={directoryNode} isExpanded={false} />);
      expect(screen.getByAltText("Closed folder")).toBeInTheDocument();
    });
  });

  describe("file nodes", () => {
    it.each(["added", "modified", "removed", "renamed"])(
      "renders the correct status icon for a %s file",
      (status) => {
        render(
          <FileTreeIcon node={createFileNode(status)} isExpanded={false} />,
        );
        expect(screen.getByAltText(status)).toBeInTheDocument();
      },
    );

    it("renders nothing for an unknown status type", () => {
      const { container } = render(
        <FileTreeIcon node={createFileNode("unknown")} isExpanded={false} />,
      );
      expect(container).toBeEmptyDOMElement();
    });
  });
});
