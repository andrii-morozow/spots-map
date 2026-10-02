import { describe, expect, it } from "vitest";
import { validateYupSchema } from "formik";
import {
  detailsSchema,
  photosSchema,
  ratingsSchema,
  spotFormSchema,
} from "./spot-form.validation";

const validDetails = {
  title: "Spot",
  city: "Kyiv",
  spotTypes: ["rail"],
  latitude: "0",
  longitude: "0",
};
const validRatings = { difficulty: 1, access: 2, runup: 3, landing: 5 };

describe("spot form schemas", () => {
  it("accepts all four selected ratings using the form field keys", () => {
    expect(ratingsSchema.isValidSync(validRatings)).toBe(true);
  });

  it.each([null, 0, 6, 1.5, "3"])("rejects invalid rating %s", (rating) => {
    for (const field of Object.keys(validRatings)) {
      expect(
        ratingsSchema.isValidSync({ ...validRatings, [field]: rating }),
      ).toBe(false);
    }
  });

  it("requires nonblank details and a supported type", () => {
    expect(detailsSchema.isValidSync(validDetails)).toBe(true);
    for (const field of ["title", "city", "latitude", "longitude"]) {
      expect(detailsSchema.isValidSync({ ...validDetails, [field]: " " })).toBe(
        false,
      );
    }
    for (const spotTypes of [[], ["unknown"]]) {
      expect(detailsSchema.isValidSync({ ...validDetails, spotTypes })).toBe(
        false,
      );
    }
  });

  it("accepts coordinate boundaries and rejects invalid coordinates", () => {
    for (const latitude of ["-90", "90"]) {
      for (const longitude of ["-180", "180"]) {
        expect(
          detailsSchema.isValidSync({ ...validDetails, latitude, longitude }),
        ).toBe(true);
      }
    }
    for (const latitude of ["-91", "91", "Infinity", "abc"]) {
      expect(detailsSchema.isValidSync({ ...validDetails, latitude })).toBe(
        false,
      );
    }
    for (const longitude of ["-181", "181"]) {
      expect(detailsSchema.isValidSync({ ...validDetails, longitude })).toBe(
        false,
      );
    }
  });

  it("requires one populated photo, including after Formik normalizes blank slots", async () => {
    expect(photosSchema.isValidSync({ photos: ["", " "] })).toBe(false);
    await expect(
      validateYupSchema(
        {
          ...validDetails,
          ...validRatings,
          photos: ["", "photo.jpg", " "],
        },
        spotFormSchema,
      ),
    ).resolves.toBeDefined();
  });
});
