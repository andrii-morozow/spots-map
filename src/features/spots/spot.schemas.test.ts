import { describe, expect, it } from "vitest";
import { spotCreateSchema } from "./spot.schemas";

const input = {
  title: " Test spot ",
  slug: "test-spot",
  latitude: 50.45,
  longitude: 30.52,
};
const completeRatings = { difficulty: 2, access: 5, runup: 3, landing: 4 };

describe("spot API input", () => {
  it("allows incomplete drafts and defaults unanswered ratings to null", () => {
    expect(spotCreateSchema.parse(input)).toMatchObject({
      title: "Test spot",
      status: "draft",
      difficulty: null,
      access: null,
      runup: null,
      landing: null,
    });
  });
  it("requires each rating when publishing", () => {
    expect(
      spotCreateSchema.safeParse({
        ...input,
        ...completeRatings,
        status: "published",
      }).success,
    ).toBe(true);
    for (const key of Object.keys(completeRatings)) {
      expect(
        spotCreateSchema.safeParse({
          ...input,
          ...completeRatings,
          status: "published",
          [key]: null,
        }).success,
      ).toBe(false);
    }
  });
  it.each([0, 6, 1.5, "3"])("rejects invalid rating %s", (rating) => {
    for (const key of Object.keys(completeRatings)) {
      expect(
        spotCreateSchema.safeParse({ ...input, [key]: rating }).success,
      ).toBe(false);
    }
  });
  it("uses the supported taxonomy", () => {
    expect(
      spotCreateSchema.safeParse({
        ...input,
        sportTypes: ["skate", "bmx"],
        spotTypes: ["rail"],
      }).success,
    ).toBe(true);
    expect(
      spotCreateSchema.safeParse({ ...input, sportTypes: ["skateboarding"] })
        .success,
    ).toBe(false);
    expect(
      spotCreateSchema.safeParse({ ...input, spotTypes: ["street"] }).success,
    ).toBe(false);
  });
  it("rejects server-owned fields and photo upload data", () => {
    for (const key of ["id", "createdBy", "createdAt", "updatedAt", "photos"]) {
      expect(
        spotCreateSchema.safeParse({ ...input, [key]: "unexpected" }).success,
      ).toBe(false);
    }
  });
});
