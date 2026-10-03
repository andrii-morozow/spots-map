import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PublicMap from "./page";

const session = vi.hoisted(() => ({ isLoaded: true, isSignedIn: false }));

vi.mock("@clerk/nextjs", () => ({
  useUser: () => session,
  UserButton: () => <button aria-label="Account menu" />,
  SignInButton: ({ children }: { children: ReactNode }) => (
    <div data-testid="sign-in-modal-trigger">{children}</div>
  ),
  SignUpButton: ({ children }: { children: ReactNode }) => (
    <div data-testid="sign-up-modal-trigger">{children}</div>
  ),
}));

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <div role="img" aria-label={alt} />,
}));

describe("public map authentication controls", () => {
  beforeEach(() => {
    session.isLoaded = true;
    session.isSignedIn = false;
  });

  it("offers both auth actions and instructions to signed-out visitors", () => {
    render(<PublicMap />);

    expect(
      screen.queryByRole("button", { name: "Account menu" }),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("sign-in-modal-trigger")).toBeInTheDocument();
    expect(screen.getByTestId("sign-up-modal-trigger")).toBeInTheDocument();
    for (const button of screen.getAllByRole("button")) {
      expect(button).toBeEnabled();
    }
    expect(screen.getByText(/App is under construction/)).toBeInTheDocument();
    expect(screen.getByText(/If you want to help/)).toBeInTheDocument();
    expect(
      screen.getByText(/If you already get claws dirty/),
    ).toBeInTheDocument();
  });

  it("removes modal triggers and messages when the visitor signs in", () => {
    const { rerender } = render(<PublicMap />);
    session.isSignedIn = true;
    rerender(<PublicMap />);

    expect(screen.getByRole("button", { name: "Account menu" })).toBeEnabled();
    expect(
      screen.queryByTestId("sign-in-modal-trigger"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("sign-up-modal-trigger"),
    ).not.toBeInTheDocument();
    for (const button of screen.getAllByRole("button", { name: /crab/ })) {
      expect(button).toBeDisabled();
    }
    expect(
      screen.queryByText(/App is under construction/),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/If you want to help/)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/If you already get claws dirty/),
    ).not.toBeInTheDocument();
  });

  it("keeps auth actions disabled while the session is loading", () => {
    session.isLoaded = false;
    render(<PublicMap />);

    expect(
      screen.queryByRole("button", { name: "Account menu" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("sign-in-modal-trigger"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("sign-up-modal-trigger"),
    ).not.toBeInTheDocument();
    for (const button of screen.getAllByRole("button")) {
      expect(button).toBeDisabled();
    }
    expect(
      screen.queryByText(/App is under construction/),
    ).not.toBeInTheDocument();
  });
});
