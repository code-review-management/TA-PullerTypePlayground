import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import BranchDisplay from "./BranchDisplay";

describe("BranchDisplay", () => {
  const MOCK_HEADREF = "mock_headref";
  const MOCK_BASEREF = "mock_baseref";

  it("renders the headref and baseref as text", () => {
    render(<BranchDisplay headRef={MOCK_HEADREF} baseRef={MOCK_BASEREF} />);
    expect(screen.getByText(MOCK_HEADREF)).toBeInTheDocument();
    expect(screen.getByText(MOCK_BASEREF)).toBeInTheDocument();
  });

  it("renders a merge direction arrow image", () => {
    render(<BranchDisplay headRef={MOCK_HEADREF} baseRef={MOCK_BASEREF} />);
    expect(screen.getByAltText("Right arrow")).toBeInTheDocument();
  });
});
