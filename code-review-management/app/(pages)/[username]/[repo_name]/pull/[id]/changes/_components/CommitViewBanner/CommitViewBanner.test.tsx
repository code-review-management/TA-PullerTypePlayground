import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import CommitViewBanner from "./CommitViewBanner";

describe("CommitViewBanner", () => {
  it("renders message with shortened SHA", () => {
    render(<CommitViewBanner sha={"ab102f9301df14"} />);
    expect(screen.getByTestId("commit-view-banner")).toHaveTextContent(
      "Commenting is disabled while viewing commit ab102f9",
    );
  });
});
