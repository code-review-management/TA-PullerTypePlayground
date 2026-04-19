import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import FileStatusChip from "./FileStatusChip";

describe("FileStatusChip", () => {
  it("renders the provided status as text", () => {
    render(<FileStatusChip status="mock-status" />);
    expect(screen.getByText("mock-status")).toBeInTheDocument();
  });

  it.each(["added", "modified", "removed", "renamed"])(
    "applies the correct CSS class for a %s file",
    (status) => {
      render(<FileStatusChip status={status} />);
      expect(screen.getByTestId("file-status-chip")).toHaveClass(status);
    },
  );

  it("applies the fallback CSS class for a file with an unknown status type", () => {
    render(<FileStatusChip status="unknown" />);
    expect(screen.getByTestId("file-status-chip")).toHaveClass("fallback");
  });
});
