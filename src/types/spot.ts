import type { sportTypes, spotTypes } from "@/constants/spot";

export type SportType = (typeof sportTypes)[number];
export type SpotType = (typeof spotTypes)[number];

export type Rating = 1 | 2 | 3 | 4 | 5;

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
  difficulty: Rating;
  access: Rating;
  runup: Rating;
  landing: Rating;
  status: "draft" | "published" | "archived";
  created_by: string | null;
  photos: string[];
  created_at: string;
  updated_at: string;
};
