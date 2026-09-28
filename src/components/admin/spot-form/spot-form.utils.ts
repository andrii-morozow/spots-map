import type { Spot } from "@/types/spot";
import type { SpotFormValues } from "./spot-form.types";

export function toSpot(
  values: SpotFormValues,
  metadata: { id: string; timestamp: string },
): Spot {
  return {
    id: metadata.id,
    title: values.title.trim(),
    slug: values.title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, ""),
    description: values.description.trim() || null,
    latitude: Number(values.latitude),
    longitude: Number(values.longitude),
    address: values.address.trim() || null,
    city: values.city.trim() || null,
    country: values.country.trim() || null,
    sport_types: [...values.sportTypes],
    spot_types: [...values.spotTypes],
    difficulty: values.difficulty,
    status: values.status,
    created_by: values.createdBy.trim() || null,
    photos: values.photos.filter((photo) => photo.trim().length > 0),
    created_at: metadata.timestamp,
    updated_at: metadata.timestamp,
  };
}
