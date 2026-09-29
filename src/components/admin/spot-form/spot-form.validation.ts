import { spotTypes } from "@/constants/spot";
import type { Rating } from "@/types/spot";
import type { SpotFormValues } from "./spot-form.types";

function validCoordinate(value: string, min: number, max: number) {
  const number = Number(value);
  return (
    value.trim() !== "" &&
    Number.isFinite(number) &&
    number >= min &&
    number <= max
  );
}

export function getDetailsFieldErrors(values: SpotFormValues) {
  const errors: Partial<Record<keyof SpotFormValues, string>> = {};
  if (!values.title.trim()) errors.title = "Enter a name.";
  if (!values.city.trim()) errors.city = "Enter a city.";
  if (
    !values.spotTypes.length ||
    !values.spotTypes.every((type) => spotTypes.includes(type))
  ) {
    errors.spotTypes = "Choose a type.";
  }
  if (!validCoordinate(values.latitude, -90, 90)) {
    errors.latitude =
      "Enter latitude between -90 and 90, using a decimal point.";
  }
  if (!validCoordinate(values.longitude, -180, 180)) {
    errors.longitude =
      "Enter longitude between -180 and 180, using a decimal point.";
  }
  return errors;
}

export function getDetailsErrors(values: SpotFormValues): string[] {
  return Object.values(getDetailsFieldErrors(values));
}

export function hasRequiredDetails(values: SpotFormValues) {
  return getDetailsErrors(values).length === 0;
}

export function getRatingFieldErrors(values: SpotFormValues) {
  const errors: Partial<Record<keyof SpotFormValues, string>> = {};
  for (const [key, label] of [
    ["difficulty", "Difficulty"],
    ["availability", "Availability"],
    ["entrance", "Entrance"],
    ["landing", "Landing"],
  ] as const) {
    if (!isRating(values[key])) errors[key] = `Select a rating for ${label}.`;
  }
  return errors;
}

export function getRatingErrors(values: SpotFormValues): string[] {
  return Object.values(getRatingFieldErrors(values));
}

export function validateSpotForm(values: SpotFormValues) {
  return {
    ...getDetailsFieldErrors(values),
    ...getRatingFieldErrors(values),
    ...(!hasRequiredPhotos(values)
      ? { photos: "Add at least one photo." }
      : {}),
  };
}

export function isRating(value: unknown): value is Rating {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 5
  );
}

export function hasRequiredRatings(
  values: SpotFormValues,
): values is SpotFormValues & {
  difficulty: Rating;
  availability: Rating;
  entrance: Rating;
  landing: Rating;
} {
  return (
    isRating(values.difficulty) &&
    isRating(values.availability) &&
    isRating(values.entrance) &&
    isRating(values.landing)
  );
}

export function hasRequiredPhotos(values: SpotFormValues) {
  return values.photos.some((photo) => photo.trim() !== "");
}
