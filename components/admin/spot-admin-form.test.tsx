import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SpotAdminForm } from "@/components/admin/spot-admin-form";

describe("SpotAdminForm", () => {
  it("requires a name and coordinates, then preserves them when going back", async () => {
    const user = userEvent.setup();
    render(<SpotAdminForm />);

    const next = screen.getByRole("button", { name: "Next" });
    expect(next).toBeDisabled();

    await user.type(screen.getByLabelText("Name"), "North Point Skatepark");
    await user.type(screen.getByLabelText("Latitude"), "41.3851");
    expect(next).toBeDisabled();

    await user.type(screen.getByLabelText("Longitude"), "2.1734");
    expect(next).toBeEnabled();
    await user.click(next);
    expect(screen.getByRole("button", { name: "Save spot" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByLabelText("Name")).toHaveValue("North Point Skatepark");
    expect(screen.getByLabelText("Latitude")).toHaveValue("41.3851");
    expect(screen.getByLabelText("Longitude")).toHaveValue("2.1734");
  });

  it("lets the user add another photo URL field", async () => {
    const user = userEvent.setup();
    render(<SpotAdminForm />);

    expect(screen.queryByPlaceholderText("Photo URL 2")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Add photo" }));

    expect(screen.getByPlaceholderText("Photo URL 1")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Photo URL 2")).toHaveValue("");
  });
});
