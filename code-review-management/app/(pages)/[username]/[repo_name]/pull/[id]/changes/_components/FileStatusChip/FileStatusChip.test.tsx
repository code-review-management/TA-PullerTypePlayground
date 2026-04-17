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
    const chip = screen.getByText("added").parentElement;
    expect(chip).toHaveClass("added");
  });

  it("renders a 'modified' status chip with the correct CSS styling", () => {
    render(<FileStatusChip status="modified" />);
    const chip = screen.getByText("modified").parentElement;
    expect(chip).toHaveClass("modified");
  });

  it("renders a 'removed' status chip with the correct CSS styling", () => {
    render(<FileStatusChip status="removed" />);
    const chip = screen.getByText("removed").parentElement;
    expect(chip).toHaveClass("removed");
  });

  it("renders a 'renamed' status chip with the correct CSS styling", () => {
    render(<FileStatusChip status="renamed" />);
    const chip = screen.getByText("renamed").parentElement;
    expect(chip).toHaveClass("renamed");
  });

  it("renders an unknown status chip with the fallback CSS styling", () => {
    render(<FileStatusChip status="unknown-status" />);
    const chip = screen.getByText("unknown-status").parentElement;
    expect(chip).toHaveClass("fallback");
  });
});
