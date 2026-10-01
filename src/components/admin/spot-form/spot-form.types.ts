import type { Spot } from "@/types/spot";

export type SpotFormValues = Pick<Spot, "title" | "photos" | "status"> & {
  difficulty: Spot["difficulty"] | null;
  access: Spot["access"] | null;
  runup: Spot["runup"] | null;
  landing: Spot["landing"] | null;
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
