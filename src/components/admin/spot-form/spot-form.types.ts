import type { Spot } from "@/types/spot";

export type SpotFormValues = Pick<
  Spot,
  "title" | "photos" | "difficulty" | "status"
> & {
  description: string;
  latitude: string;
  longitude: string;
  address: string;
  city: string;
  country: string;
  sportTypes: Spot["sport_types"];
  spotTypes: Spot["spot_types"];
  createdBy: string;
};

export type UpdateSpotField = <K extends keyof SpotFormValues>(
  key: K,
  value: SpotFormValues[K],
) => void;
