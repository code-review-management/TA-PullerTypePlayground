import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { getExampleFileTree1 } from "@/mocks/tests/filetree";
import { useResizableFileTree } from "../../_hooks/useResizableFileTree";
import FileTree from "./FileTree";

jest.mock("../../_hooks/useResizableFileTree", () => ({
  useResizableFileTree: jest.fn(() => ({
    isResizing: false,
    isHovered: false,
  })),
}));

jest.mock("../FileTreeRow/FileTreeRow", () => ({
  __esModule: true,
  default: () => <div data-testid="file-tree-row" />,
}));

jest.mock("../FileTreeSearchBar/FileTreeSearchBar", () => ({
  __esModule: true,
  default: () => <div data-testid="file-tree-search-bar" />,
}));

jest.mock("@components/IconTooltip/IconTooltip", () => ({
  __esModule: true,
  default: ({ id }: { id: string }) => (
    <div data-testid="icon-tooltip" data-tooltip-id={id} />
  ),
}));

describe("FileTree", () => {
  const mockFileTree = getExampleFileTree1();

  it("renders the icon tooltip", () => {
    render(<FileTree fileTree={mockFileTree} />);
    expect(screen.getByTestId("icon-tooltip")).toBeInTheDocument();
  });

  it("passes the correct id to the icon tooltip", () => {
    render(<FileTree fileTree={mockFileTree} />);
    expect(screen.getByTestId("icon-tooltip")).toHaveAttribute(
      "data-tooltip-id",
      "tooltip-file-tree-row",
    );
  });

  it("renders the file tree search bar", () => {
    render(<FileTree fileTree={mockFileTree} />);
    expect(screen.getByTestId("file-tree-search-bar")).toBeInTheDocument();
  });

  it("renders no rows when the tree is empty", () => {
    render(<FileTree fileTree={[]} />);
    expect(screen.queryAllByTestId("file-tree-row")).toHaveLength(0);
  });

  it("renders a row for each root-level node in the tree", () => {
    render(<FileTree fileTree={mockFileTree} />);
    expect(screen.getAllByTestId("file-tree-row")).toHaveLength(3);
  });

  it("applies the resizing class while the tree is being resized", () => {
    jest.mocked(useResizableFileTree).mockReturnValueOnce({
      isResizing: true,
      isHovered: false,
    });

    render(<FileTree fileTree={mockFileTree} />);
    expect(screen.getByTestId("file-tree")).toHaveClass("resizing");
  });

  it("applies the hovered class while the tree border is being hovered", () => {
    jest.mocked(useResizableFileTree).mockReturnValueOnce({
      isResizing: false,
      isHovered: true,
    });

    render(<FileTree fileTree={mockFileTree} />);
    expect(screen.getByTestId("file-tree")).toHaveClass("hovered");
  });

  it("applies no conditional classes while not being resized or hovered", () => {
    render(<FileTree fileTree={mockFileTree} />);
    expect(screen.getByTestId("file-tree")).not.toHaveClass("resizing");
    expect(screen.getByTestId("file-tree")).not.toHaveClass("hovered");
  });
});
