import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import StateChip from "./StateChip";
import { State } from "@/app/(pages)/_utils/stateConstants";

describe("StateChip", () => {
  it.each(["open", "closed", "merged", "draft"])(
    "renders the provided status as text",
    (state) => {
      render(<StateChip state={state as State} />);
      const capitalizedState = `${state[0].toUpperCase()}${state.slice(1)}`;
      expect(screen.getByText(capitalizedState)).toBeInTheDocument();
    },
  );

  it.each(["open", "closed", "merged", "draft"])(
    "applies the correct CSS class for the %s state",
    (state) => {
      render(<StateChip state={state as State} />);
      expect(screen.getByTestId("state-chip")).toHaveClass(state);
    },
  );

  it.each(["open", "closed", "merged", "draft"])(
    "renders the correct icon for the %s state",
    (state) => {
      render(<StateChip state={state as State} />);
      expect(screen.getByAltText(state)).toBeInTheDocument();
    },
  );
});
