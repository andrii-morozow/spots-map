import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SpotForm } from "./spot-form";

async function fillDetails(user: ReturnType<typeof userEvent.setup>) {
  screen.getByRole("combobox", { name: "Type" }).focus();
  await user.keyboard("{ArrowDown}{Enter}");
  await user.type(screen.getByLabelText("Name"), "North Point Skatepark");
  await user.type(screen.getByLabelText("City"), "Barcelona");
  await user.type(screen.getByLabelText("Latitude"), "41.3851");
  await user.type(screen.getByLabelText("Longitude"), "2.1734");
}

async function rate(
  user: ReturnType<typeof userEvent.setup>,
  label: string,
  value: string,
) {
  await user.click(
    within(screen.getByRole("group", { name: label })).getByRole("radio", {
      name: value,
    }),
  );
}

describe("SpotForm", () => {
  it("enables Next when returning to valid details before completing ratings", async () => {
    const user = userEvent.setup();
    render(<SpotForm />);
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent("Enter a name.");
    expect(screen.getByRole("status")).toHaveTextContent("Choose a type.");
    await fillDetails(user);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByLabelText("Name")).toHaveValue("North Point Skatepark");
    expect(screen.getByLabelText("City")).toHaveValue("Barcelona");
    expect(screen.getByRole("combobox", { name: "Type" })).toHaveTextContent(
      "rail",
    );
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(
      screen.getByRole("group", { name: "Difficulty" }),
    ).toBeInTheDocument();
  });

  it("requires details, all four ratings, and a photo before submitting", async () => {
    const user = userEvent.setup();
    render(<SpotForm />);
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    await fillDetails(user);
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.queryByLabelText("Status")).not.toBeInTheDocument();
    for (const label of ["Difficulty", "Availability", "Entrance", "Landing"]) {
      const group = screen.getByRole("group", { name: label });
      expect(within(group).getAllByRole("radio")).toHaveLength(5);
      expect(
        within(group).queryByRole("radio", { checked: true }),
      ).not.toBeInTheDocument();
    }
    await rate(user, "Difficulty", "2");
    await rate(user, "Availability", "5");
    await rate(user, "Entrance", "3");
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Select a rating for Landing.",
    );
    expect(screen.queryByLabelText("Photo URL 1")).not.toBeInTheDocument();
    await rate(user, "Landing", "4");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByLabelText("Name")).toHaveValue("North Point Skatepark");
    expect(screen.getByRole("combobox", { name: "Type" })).toHaveTextContent(
      "rail",
    );
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(
      within(screen.getByRole("group", { name: "Availability" })).getByRole(
        "radio",
        { name: "5" },
      ),
    ).toBeChecked();
    await user.click(screen.getByRole("button", { name: "Next" }));

    const submit = screen.getByRole("button", { name: "Submit" });
    expect(submit).toBeDisabled();
    await user.type(screen.getByLabelText("Photo URL 1"), "   ");
    expect(submit).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Add photo" }));
    await user.type(
      screen.getByLabelText("Photo URL 2"),
      "https://example.com/spot.jpg",
    );
    expect(submit).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(
      within(screen.getByRole("group", { name: "Landing" })).getByRole(
        "radio",
        { name: "4" },
      ),
    ).toBeChecked();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByLabelText("Photo URL 2")).toHaveValue(
      "https://example.com/spot.jpg",
    );
    expect(screen.getByRole("button", { name: "Submit" })).toBeEnabled();

    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    try {
      await user.click(screen.getByRole("button", { name: "Submit" }));
      expect(log).toHaveBeenCalledWith(
        "spot payload",
        expect.objectContaining({
          title: "North Point Skatepark",
          city: "Barcelona",
          spot_types: ["rail"],
          latitude: 41.3851,
          longitude: 2.1734,
          difficulty: 2,
          availability: 5,
          entrance: 3,
          landing: 4,
          photos: ["https://example.com/spot.jpg"],
        }),
      );
      expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
      expect(screen.getByLabelText("Name")).toHaveValue("");
    } finally {
      log.mockRestore();
    }
  });

  it("blocks missing city, invalid coordinates, and direct submission of an incomplete form", async () => {
    const user = userEvent.setup();
    const { container } = render(<SpotForm />);
    await fillDetails(user);
    const next = screen.getByRole("button", { name: "Next" });
    await user.clear(screen.getByLabelText("City"));
    expect(next).toBeDisabled();
    await user.click(next);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    await user.type(screen.getByLabelText("City"), "Barcelona");
    for (const value of ["abc", "91", "-91", "Infinity", " "]) {
      await user.clear(screen.getByLabelText("Latitude"));
      await user.type(screen.getByLabelText("Latitude"), value);
      expect(next).toBeDisabled();
      await user.click(next);
      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.getByLabelText("Name")).toBeInTheDocument();
    }
    await user.clear(screen.getByLabelText("Latitude"));
    await user.type(screen.getByLabelText("Latitude"), "0");
    await user.clear(screen.getByLabelText("Longitude"));
    await user.type(screen.getByLabelText("Longitude"), "181");
    expect(next).toBeDisabled();
    await user.click(next);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    await user.clear(screen.getByLabelText("Longitude"));
    await user.type(screen.getByLabelText("Longitude"), "0");
    expect(next).toBeEnabled();
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    try {
      fireEvent.submit(container.querySelector("form")!);
      expect(log).not.toHaveBeenCalled();
      expect(
        screen.getByRole("group", { name: "Difficulty" }),
      ).toBeInTheDocument();
      fireEvent.submit(container.querySelector("form")!);
      expect(log).not.toHaveBeenCalled();
    } finally {
      log.mockRestore();
    }
  });
});
