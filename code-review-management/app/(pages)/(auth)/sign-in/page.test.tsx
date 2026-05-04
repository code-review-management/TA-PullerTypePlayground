import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import { signIn } from "@/lib/auth";
import userEvent from "@testing-library/user-event";
import SignIn from "./page";

jest.mock("@/lib/auth", () => ({
  signIn: jest.fn(),
}));

describe("SignIn", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the brand heading", () => {
    render(<SignIn />);
    expect(
      screen.getByRole("heading", { level: 1, name: "PullerType" }),
    ).toBeInTheDocument();
  });

  it("renders the welcome back message", () => {
    render(<SignIn />);
    expect(screen.getByText("Welcome back to PullerType")).toBeInTheDocument();
  });

  it("renders the notice message", () => {
    const { container } = render(<SignIn />);
    expect(container).toHaveTextContent(
      "By signing up, you acknowledge that you read and agree to our Privacy Policy.",
    );
  });

  it("renders the privacy policy as a link", () => {
    render(<SignIn />);
    expect(
      screen.getByRole("link", { name: "Privacy Policy" }),
    ).toBeInTheDocument();
  });

  it("renders the form", () => {
    render(<SignIn />);
    expect(screen.getByTestId("sign-in-form")).toBeInTheDocument();
  });

  describe("sign in button", () => {
    it("renders with the correct text", () => {
      render(<SignIn />);
      expect(screen.getByRole("button")).toHaveTextContent(
        "Sign in with GitHub",
      );
    });

    it("renders with the GitHub logo", () => {
      render(<SignIn />);
      const button = screen.getByRole("button");
      expect(within(button).getByAltText("GitHub")).toBeInTheDocument();
    });

    it("renders inside the form", () => {
      render(<SignIn />);
      const button = screen.getByRole("button");
      expect(screen.getByTestId("sign-in-form")).toContainElement(button);
    });

    it("is of type submit", () => {
      render(<SignIn />);
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });

    it("calls the sign in function when clicked", async () => {
      const user = userEvent.setup();
      render(<SignIn />);
      await user.click(screen.getByRole("button"));
      expect(signIn).toHaveBeenCalled();
    });

    it("calls the sign in function with the correct arguments when clicked", async () => {
      const user = userEvent.setup();
      render(<SignIn />);
      await user.click(screen.getByRole("button"));
      expect(signIn).toHaveBeenCalledWith("github", {
        redirectTo: "/dashboard",
      });
    });
  });
});
