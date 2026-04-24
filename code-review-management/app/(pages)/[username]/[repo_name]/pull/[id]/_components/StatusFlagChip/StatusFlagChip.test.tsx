import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import StatusFlagChip from "./StatusFlagChip";
import { Status, TEXT } from "@/app/(pages)/_utils/statusConstants";

describe("StateChip", () => {
  it.each(["ready", "waiting", "conflict", "failure"])(
    "renders the provided status' text message",
    (status) => {
      render(<StatusFlagChip status={status as Status} />);
      expect(screen.getByText(TEXT[status as Status])).toBeInTheDocument();
    },
  );

  it.each(["ready", "waiting", "conflict", "failure"])(
    "applies the correct CSS class for the %s status",
    (status) => {
      render(<StatusFlagChip status={status as Status} />);
      expect(screen.getByTestId("status-flag-chip")).toHaveClass(status);
    },
  );

  it.each(["ready", "waiting", "conflict", "failure"])(
    "renders the correct icon for the %s status",
    (status) => {
      render(<StatusFlagChip status={status as Status} />);
      expect(screen.getByAltText(status)).toBeInTheDocument();
    },
  );
});
