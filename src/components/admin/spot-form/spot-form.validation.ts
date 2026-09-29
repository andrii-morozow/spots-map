import { yupToFormErrors } from "formik";
import {
  array,
  mixed,
  object,
  string,
  ValidationError,
  type AnyObjectSchema,
} from "yup";
import { spotTypes } from "@/constants/spot";
import type { Rating, SpotType } from "@/types/spot";
import type { SpotFormValues } from "./spot-form.types";

function coordinateSchema(label: string, min: number, max: number) {
  const message = `Enter ${label} between ${min} and ${max}, using a decimal point.`;
  return string()
    .trim()
    .required(message)
    .test("coordinate", message, (value) => {
      if (!value) return true;
      const number = Number(value);
      return Number.isFinite(number) && number >= min && number <= max;
    });
}

function ratingSchema(label: string) {
  const message = `Select a rating for ${label}.`;
  return mixed<Rating>().oneOf([1, 2, 3, 4, 5], message).required(message);
}

export const detailsSchema = object({
  title: string().trim().required("Enter a name."),
  city: string().trim().required("Enter a city."),
  spotTypes: array()
    .of(
      mixed<SpotType>()
        .oneOf(spotTypes, "Choose a type.")
        .required("Choose a type."),
    )
    .min(1, "Choose a type.")
    .required("Choose a type."),
  latitude: coordinateSchema("latitude", -90, 90),
  longitude: coordinateSchema("longitude", -180, 180),
});

export const ratingsSchema = object({
  difficulty: ratingSchema("Difficulty"),
  availability: ratingSchema("Availability"),
  entrance: ratingSchema("Entrance"),
  landing: ratingSchema("Landing"),
});

export const photosSchema = object({
  photos: array()
    .of(string().optional())
    .required("Add at least one photo.")
    .test("required-photo", "Add at least one photo.", (photos) =>
      photos?.some((photo) => Boolean(photo?.trim())),
    ),
});

export const spotFormSchema = detailsSchema
  .concat(ratingsSchema)
  .concat(photosSchema);

function getValidationError(schema: AnyObjectSchema, values: SpotFormValues) {
  try {
    schema.validateSync(values, { abortEarly: false });
    return null;
  } catch (error) {
    if (error instanceof ValidationError) return error;
    throw error;
  }
}

export function getInitialErrors(values: SpotFormValues) {
  const error = getValidationError(spotFormSchema, values);
  return error ? yupToFormErrors<SpotFormValues>(error) : {};
}

export function getDetailsErrors(values: SpotFormValues): string[] {
  return [...new Set(getValidationError(detailsSchema, values)?.errors ?? [])];
}

export function getRatingErrors(values: SpotFormValues): string[] {
  return [...new Set(getValidationError(ratingsSchema, values)?.errors ?? [])];
}

export function hasRequiredDetails(values: SpotFormValues) {
  return detailsSchema.isValidSync(values);
}

export function hasRequiredRatings(values: SpotFormValues) {
  return ratingsSchema.isValidSync(values);
}

export function hasRequiredPhotos(values: SpotFormValues) {
  return photosSchema.isValidSync(values);
}
