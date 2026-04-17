import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import FileStatusChip from "./FileStatusChip";

describe("FileStatusChip", () => {
  it("renders the provided status as text", () => {
    render(<FileStatusChip status="mock-status" />);
    expect(screen.getByText("mock-status")).toBeDefined();
  });

  it("renders an 'added' status chip with the correct CSS styling", () => {
    render(<FileStatusChip status="added" />);
    expect(screen.getByTestId("file-status-chip")).toHaveClass("added");
  });

  it("renders a 'modified' status chip with the correct CSS styling", () => {
    render(<FileStatusChip status="modified" />);
    expect(screen.getByTestId("file-status-chip")).toHaveClass("modified");
  });

  it("renders a 'removed' status chip with the correct CSS styling", () => {
    render(<FileStatusChip status="removed" />);
    expect(screen.getByTestId("file-status-chip")).toHaveClass("removed");
  });

  it("renders a 'renamed' status chip with the correct CSS styling", () => {
    render(<FileStatusChip status="renamed" />);
    expect(screen.getByTestId("file-status-chip")).toHaveClass("renamed");
  });

  it("renders an unknown status chip with the fallback CSS styling", () => {
    render(<FileStatusChip status="unknown-status" />);
    expect(screen.getByTestId("file-status-chip")).toHaveClass("fallback");
  });
});
