import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import {
  getExampleDirectoryNode1,
  getExampleFileNode1,
} from "@/mocks/tests/filetree";
import FileTreeRow from "./FileTreeRow";

describe("FileTreeRow", () => {
  const mockFile = getExampleFileNode1();

  it("renders the file name", () => {
    render(<FileTreeRow node={mockFile} />);
    expect(screen.getByText("index.ts")).toBeInTheDocument();
  });

  it("renders as an anchor link to the file diff", () => {
    render(<FileTreeRow node={mockFile} />);
    expect(
      document.querySelector('a[href="#file-index.ts"]'),
    ).toBeInTheDocument();
  });

  it("renders anchor href using fileDiff.filename, not node name (file basename)", () => {
    const nestedFile = getExampleDirectoryNode1().children[1];

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
