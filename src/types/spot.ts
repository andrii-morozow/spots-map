import type { sportTypes, spotTypes } from "@/constants/spot";

export type SportType = (typeof sportTypes)[number];
export type SpotType = (typeof spotTypes)[number];

export type Spot = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  latitude: number;
  longitude: number;
  address: string | null;
  city: string | null;
  country: string | null;
  sport_types: SportType[];
  spot_types: SpotType[];
  difficulty: "easy" | "medium" | "hard" | "unknown";
  status: "draft" | "published" | "archived";
  created_by: string | null;
  photos: string[];
  created_at: string;
  updated_at: string;
};
