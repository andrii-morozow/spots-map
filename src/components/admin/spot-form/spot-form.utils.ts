import {
  spotCreateSchema,
  type SpotCreateInput,
} from "@/features/spots/spot.schemas";
import { spotFormSchema } from "./spot-form.validation";
import type { SpotFormValues } from "./spot-form.types";

export function toSpotInput(values: SpotFormValues): SpotCreateInput {
  spotFormSchema.validateSync(values, { abortEarly: false });
  return spotCreateSchema.parse({
    title: values.title.trim(),
    slug:
      values.slug.trim() ||
      values.title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") ||
      "spot",
    description: values.description.trim() || null,
    latitude: Number(values.latitude),
    longitude: Number(values.longitude),
    address: values.address.trim() || null,
    city: values.city.trim() || null,
    country: values.country.trim() || null,
    sportTypes: [...values.sportTypes],
    spotTypes: [...values.spotTypes],
    difficulty: values.difficulty,
    access: values.access,
    runup: values.runup,
    landing: values.landing,
    status: values.status,
  });
}
