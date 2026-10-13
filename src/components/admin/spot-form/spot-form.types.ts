import type { SpotCreateInput } from "@/features/spots/spot.schemas";

export type SpotFormValues = Omit<
  SpotCreateInput,
  "latitude" | "longitude" | "description" | "address" | "city" | "country"
> & {
  description: string;
  latitude: string;
  longitude: string;
  address: string;
  city: string;
  country: string;
  photos: string[];
};

export type UpdateSpotField = <K extends keyof SpotFormValues>(
  key: K,
  value: SpotFormValues[K],
) => void;
