import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PhotoStep } from "./photo-step";

describe("PhotoStep", () => {
  it("accepts dropped images and explains rejected file types", async () => {
    const addPhotos = vi.fn();
    render(
      <PhotoStep
        photos={[]}
        invalid={false}
        addPhotos={addPhotos}
        removePhoto={vi.fn()}
      />,
    );
    const dropzone = screen.getByRole("button", { name: "Add photos" });
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [new File(["text"], "notes.txt", { type: "text/plain" })],
      },
    });
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please choose PNG or JPEG images.",
    );
    expect(addPhotos).not.toHaveBeenCalled();
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [new File(["image"], "spot.jpg", { type: "image/jpeg" })],
      },
    });
    await waitFor(() =>
      expect(addPhotos).toHaveBeenCalledWith([
        expect.stringMatching(/^data:image\/jpeg;base64,/),
      ]),
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
