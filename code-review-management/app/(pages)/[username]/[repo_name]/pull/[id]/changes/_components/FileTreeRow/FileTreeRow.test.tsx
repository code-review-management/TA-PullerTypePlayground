import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import {
  getExampleDirectoryNode1,
  getExampleFileNode1,
} from "@/mocks/tests/filetree";
import FileTreeRow from "./FileTreeRow";

describe("FileTreeRow", () => {
  const user = userEvent.setup();
  const mockDirectory = getExampleDirectoryNode1();
  const mockFile = getExampleFileNode1();

  describe("directory nodes", () => {
    it("renders the directory name", () => {
      render(<FileTreeRow node={mockDirectory} />);
      expect(screen.getByText("src")).toBeInTheDocument();
    });

    it("does not render as an anchor link", () => {
      render(<FileTreeRow node={mockDirectory} />);
      expect(
        document.querySelector('a[href="#file-src"]'),
      ).not.toBeInTheDocument();
    });

    it("renders its immediate children", () => {
      render(<FileTreeRow node={mockDirectory} />);
      expect(screen.getByText("pages")).toBeInTheDocument();
      expect(screen.getByText("utils.ts")).toBeInTheDocument();
    });

    it("renders its nested children", () => {
      render(<FileTreeRow node={mockDirectory} />);
      expect(screen.getByText("home.tsx")).toBeInTheDocument();
      expect(screen.getByText("layout.tsx")).toBeInTheDocument();
    });

    it("does not collapse any children by default", () => {
      const { container } = render(<FileTreeRow node={mockDirectory} />);
      expect(container.getElementsByClassName("collapsed")).toHaveLength(0);
    });

    it("collapses its immediate children when clicked", async () => {
      const { container } = render(<FileTreeRow node={mockDirectory} />);
      await user.click(screen.getByText("src"));
      const collapsed = container.getElementsByClassName("collapsed");

      expect(collapsed).toHaveLength(2);
      expect(collapsed[0]).toHaveTextContent("pages");
      expect(collapsed[1]).toHaveTextContent("utils.ts");
    });

    it("un-collapses its immediate children when clicked again", async () => {
      const { container } = render(<FileTreeRow node={mockDirectory} />);
      await user.click(screen.getByText("src"));
      await user.click(screen.getByText("src"));
      expect(container.getElementsByClassName("collapsed")).toHaveLength(0);
    });

    it("re-expanding a parent keeps the collapsed state of child directories", async () => {
      const { container } = render(<FileTreeRow node={mockDirectory} />);
      await user.click(screen.getByText("pages"));
      await user.click(screen.getByText("src"));
      await user.click(screen.getByText("src"));

      const collapsed = container.getElementsByClassName("collapsed");
      expect(collapsed).toHaveLength(2);
      expect(collapsed[0]).toHaveTextContent("home.tsx");
      expect(collapsed[1]).toHaveTextContent("layout.tsx");
    });
  });

  describe("file nodes", () => {
    const nestedFile = mockDirectory.children[1];

    it("renders the file's basename as its label", () => {
      render(<FileTreeRow node={nestedFile} />);
      expect(screen.getByText("utils.ts")).toBeInTheDocument();
    });

    it("renders as an anchor link to the file diff", () => {
      render(<FileTreeRow node={mockFile} />);
      expect(
        document.querySelector('a[href="#file-index.ts"]'),
      ).toBeInTheDocument();
    });

    it("uses the full file path as the anchor href, not just the basename", () => {
      render(<FileTreeRow node={nestedFile} />);
      expect(
        document.querySelector('a[href="#file-src/utils.ts"]'),
      ).toBeInTheDocument();
      expect(
        document.querySelector('a[href="#file-utils.ts"]'),
      ).not.toBeInTheDocument();
    });

    it("renders no child nodes", () => {
      render(<FileTreeRow node={mockFile} />);
      expect(screen.queryAllByTestId("directory-child")).toHaveLength(0);
    });
  });
});
