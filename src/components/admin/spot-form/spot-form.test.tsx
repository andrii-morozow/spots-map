import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SpotForm } from "@/components/admin/spot-form/spot-form";

describe("SpotForm", () => {
  it("requires a name and coordinates, then shows only Submit on the final step", async () => {
    const user = userEvent.setup();
    render(<SpotForm />);

    const next = screen.getByRole("button", { name: "Next" });
    expect(next).toBeDisabled();
    expect(
      screen.queryByRole("button", { name: "Back" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Submit" }),
    ).not.toBeInTheDocument();

    screen.getByRole("combobox", { name: "Type" }).focus();
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");
    await user.type(screen.getByLabelText("Name"), "North Point Skatepark");
    await user.type(screen.getByLabelText("Latitude"), "41.3851");
    expect(next).toBeDisabled();

    await user.type(screen.getByLabelText("Longitude"), "2.1734");
    expect(next).toBeEnabled();
    await user.click(next);
    expect(screen.getByLabelText("Difficulty")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Submit" }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByLabelText("Name")).toHaveValue("North Point Skatepark");
    expect(screen.getByRole("combobox", { name: "Type" })).toHaveTextContent(
      "rail",
    );
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByPlaceholderText("Photo URL 1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: "Next" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Back" }),
    ).not.toBeInTheDocument();

    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    try {
      await user.click(screen.getByRole("button", { name: "Submit" }));
      expect(log).toHaveBeenCalledWith(
        "spot payload",
        expect.objectContaining({
          title: "North Point Skatepark",
          spot_types: ["rail"],
          slug: "north-point-skatepark",
          description: null,
          photos: [],
          latitude: 41.3851,
          longitude: 2.1734,
        }),
      );
      expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
      expect(screen.getByLabelText("Name")).toHaveValue("");
    } finally {
      log.mockRestore();
    }
  });

  it("lets the user add and edit photo URLs on step 3", async () => {
    const user = userEvent.setup();
    render(<SpotForm />);
    await user.type(screen.getByLabelText("Name"), "Spot");
    await user.type(screen.getByLabelText("Latitude"), "41");
    await user.type(screen.getByLabelText("Longitude"), "2");
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(
      screen.queryByPlaceholderText("Photo URL 2"),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Add photo" }));

    expect(screen.getByPlaceholderText("Photo URL 1")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Photo URL 2")).toHaveValue("");
    await user.type(
      screen.getByPlaceholderText("Photo URL 1"),
      "https://example.com/spot.jpg",
    );
    expect(screen.getByPlaceholderText("Photo URL 1")).toHaveValue(
      "https://example.com/spot.jpg",
    );
  });
});
