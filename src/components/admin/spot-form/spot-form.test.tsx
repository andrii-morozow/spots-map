import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SpotForm } from "./spot-form";

async function fillDetails(user: ReturnType<typeof userEvent.setup>) {
  screen.getByRole("combobox", { name: "Type" }).focus();
  await user.keyboard("{ArrowDown}{Enter}");
  await user.type(
    screen.getByRole("textbox", { name: "Name" }),
    "North Point Skatepark",
  );
  await user.type(screen.getByRole("textbox", { name: "City" }), "Barcelona");
  await user.type(screen.getByRole("textbox", { name: "Latitude" }), "41.3851");
  await user.type(screen.getByRole("textbox", { name: "Longitude" }), "2.1734");
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
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveAttribute(
      "aria-invalid",
      "false",
    );
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByRole("combobox", { name: "Type" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await fillDetails(user);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue(
      "North Point Skatepark",
    );
    expect(screen.getByRole("textbox", { name: "City" })).toHaveValue(
      "Barcelona",
    );
    expect(screen.getByRole("combobox", { name: "Type" })).toHaveTextContent(
      "rail",
    );
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(
      screen.getByRole("group", { name: "Difficulty" }),
    ).toBeInTheDocument();
  });

  it("displays six decimals without changing entered coordinate precision", async () => {
    const user = userEvent.setup();
    render(<SpotForm />);
    const latitude = screen.getByRole("textbox", { name: "Latitude" });
    const longitude = screen.getByRole("textbox", { name: "Longitude" });
    await user.type(latitude, "88.23432423");
    expect(latitude).toHaveValue("88.23432423");
    await user.tab();
    expect(latitude).toHaveValue("88.234324");
    await user.click(latitude);
    expect(latitude).toHaveValue("88.23432423");
    await user.type(longitude, "0");
    await user.tab();
    expect(longitude).toHaveValue("0.000000");
    await user.clear(latitude);
    await user.type(latitude, "90.00000001");
    await user.tab();
    expect(latitude).toHaveValue("90.00000001");
    await user.clear(longitude);
    await user.tab();
    expect(longitude).toHaveValue("");
  });

  it("requires details, all four ratings, and a photo before submitting", async () => {
    const user = userEvent.setup();
    render(<SpotForm />);
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
    await fillDetails(user);
    await user.clear(screen.getByRole("textbox", { name: "Latitude" }));
    await user.type(
      screen.getByRole("textbox", { name: "Latitude" }),
      "41.38512345",
    );
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.queryByLabelText("Status")).not.toBeInTheDocument();
    for (const label of ["Difficulty", "Availability", "Entrance", "Landing"]) {
      const group = screen.getByRole("group", { name: label });
      expect(within(group).getAllByRole("radio")).toHaveLength(5);
      expect(
        within(group).queryByRole("radio", { checked: true }),
      ).not.toBeInTheDocument();
    }
    const difficulty = screen.getByRole("group", { name: "Difficulty" });
    expect(
      within(difficulty).getByText("Select a number to see what it means."),
    ).toBeInTheDocument();
    await rate(user, "Difficulty", "1");
    expect(
      within(difficulty).getByRole("radio", { name: "1" }),
    ).toHaveAccessibleDescription("Very easy — suitable for beginners.");
    await rate(user, "Difficulty", "2");
    expect(
      within(difficulty).getByRole("radio", { name: "2" }),
    ).toHaveAccessibleDescription("Easy — basic skills needed.");
    expect(
      within(difficulty).queryByText("Very easy — suitable for beginners."),
    ).not.toBeInTheDocument();
    await rate(user, "Availability", "5");
    await rate(user, "Entrance", "3");
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.queryByLabelText("Photo URL 1")).not.toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Landing" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await rate(user, "Landing", "4");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue(
      "North Point Skatepark",
    );
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

    const submit = screen.getByRole("button", { name: "Submit spot" });
    expect(submit).toBeEnabled();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    await user.click(submit);
    expect(screen.getByLabelText("Choose photos")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    const photo = new File(["photo"], "spot.png", { type: "image/png" });
    await user.upload(screen.getByLabelText("Choose photos"), [photo, photo]);
    expect(await screen.findByAltText("Spot photo 2")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Remove photo 1" }));
    expect(screen.queryByAltText("Spot photo 2")).not.toBeInTheDocument();
    expect(screen.getByAltText("Spot photo 1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit spot" })).toBeEnabled();

    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    try {
      await user.click(screen.getByRole("button", { name: "Submit spot" }));
      expect(log).toHaveBeenCalledWith(
        "spot payload",
        expect.objectContaining({
          title: "North Point Skatepark",
          city: "Barcelona",
          spot_types: ["rail"],
          latitude: 41.38512345,
          longitude: 2.1734,
          difficulty: 2,
          availability: 5,
          entrance: 3,
          landing: 4,
          photos: [expect.stringMatching(/^data:image\/png;base64,/)],
        }),
      );
      expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
      expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("");
    } finally {
      log.mockRestore();
    }
  });

  it("blocks missing city, invalid coordinates, and direct submission of an incomplete form", async () => {
    const user = userEvent.setup();
    const { container } = render(<SpotForm />);
    expect(screen.getByRole("textbox", { name: "Latitude" })).toHaveAttribute(
      "placeholder",
      "-90.0000 to 90.0000",
    );
    expect(screen.getByRole("textbox", { name: "Longitude" })).toHaveAttribute(
      "placeholder",
      "-180.0000 to 180.0000",
    );
    await fillDetails(user);
    const next = screen.getByRole("button", { name: "Next" });
    await user.clear(screen.getByRole("textbox", { name: "City" }));
    expect(next).toBeEnabled();
    await user.click(next);
    expect(screen.getByRole("textbox", { name: "City" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
    await user.type(screen.getByRole("textbox", { name: "City" }), "Barcelona");
    for (const value of ["abc", "91", "-91", "Infinity", " "]) {
      await user.clear(screen.getByRole("textbox", { name: "Latitude" }));
      await user.type(screen.getByRole("textbox", { name: "Latitude" }), value);
      expect(next).toBeEnabled();
      await user.click(next);
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: "Latitude" })).toHaveAttribute(
        "aria-invalid",
        "true",
      );
      expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
    }
    await user.clear(screen.getByRole("textbox", { name: "Latitude" }));
    await user.type(screen.getByRole("textbox", { name: "Latitude" }), "0");
    await user.clear(screen.getByRole("textbox", { name: "Longitude" }));
    await user.type(screen.getByRole("textbox", { name: "Longitude" }), "181");
    expect(next).toBeEnabled();
    await user.click(next);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Longitude" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
    await user.clear(screen.getByRole("textbox", { name: "Longitude" }));
    await user.type(screen.getByRole("textbox", { name: "Longitude" }), "0");
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
