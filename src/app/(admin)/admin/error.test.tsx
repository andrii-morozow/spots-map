import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import AdminError from "./error";

it("offers retry and map navigation without exposing the underlying error", () => {
  const reset = vi.fn();
  const error = Object.assign(new Error("private server configuration"), {
    digest: "123456",
  });
  render(<AdminError error={error} reset={reset} />);

  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  expect(reset).toHaveBeenCalledOnce();
  expect(screen.getByRole("link", { name: "Back to map" })).toHaveAttribute(
    "href",
    "/map",
  );
  expect(screen.getByText("Error reference: 123456")).toBeInTheDocument();
  expect(screen.queryByText(error.message)).not.toBeInTheDocument();
});
