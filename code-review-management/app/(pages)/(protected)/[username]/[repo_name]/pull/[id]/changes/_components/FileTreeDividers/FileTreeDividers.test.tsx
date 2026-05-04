import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import FileTreeDividers from "./FileTreeDividers";

describe("FileTreeDividers", () => {
  it("renders no dividers when depth is 0", () => {
    render(<FileTreeDividers depth={0} basePadding={16} indentPadding={8} />);
    expect(screen.queryAllByTestId("file-tree-divider")).toHaveLength(0);
  });

  it("renders one divider per depth level", () => {
    render(<FileTreeDividers depth={4} basePadding={16} indentPadding={8} />);
    expect(screen.getAllByTestId("file-tree-divider")).toHaveLength(4);
  });

  it("positions each divider based on its depth, indentPadding, and basePadding", () => {
    render(<FileTreeDividers depth={4} basePadding={16} indentPadding={8} />);
    const dividers = screen.getAllByTestId("file-tree-divider");
    expect(dividers[0]).toHaveStyle({ left: "16px" });
    expect(dividers[1]).toHaveStyle({ left: "24px" });
    expect(dividers[2]).toHaveStyle({ left: "32px" });
    expect(dividers[3]).toHaveStyle({ left: "40px" });
  });
});
