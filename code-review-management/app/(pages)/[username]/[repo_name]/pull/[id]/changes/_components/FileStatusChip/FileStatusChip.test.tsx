import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import FileStatusChip from "./FileStatusChip";

describe("FileStatusChip", () => {
  it("renders the provided status as text", () => {
    render(<FileStatusChip status="mock-status" />);
    expect(screen.getByText("mock-status")).toBeDefined();
  });

  it.each(["added", "modified", "removed", "renamed"])(
    "renders a %s file status chip with the correct CSS class",
    (status) => {
      render(<FileStatusChip status={status} />);
      expect(screen.getByTestId("file-status-chip")).toHaveClass(status);
    },
  );

  it("renders an unknown file status chip with the fallback CSS class", () => {
    render(<FileStatusChip status="unknown" />);
    expect(screen.getByTestId("file-status-chip")).toHaveClass("fallback");
  });
});
