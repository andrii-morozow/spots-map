export const spotTypes = [
  "rail",
  "kinkrail",
  "ledge",
  "kinkledge",
  "gap",
  "skatepark",
  "wallride",
] as const;

export const sportTypes = [
  "skate",
  "bmx",
  "surf",
  "climb",
  "basketball",
  "fitness",
] as const;

export const spotStatuses = ["draft", "published", "archived"] as const;

export type SportType = (typeof sportTypes)[number];
export type SpotType = (typeof spotTypes)[number];
export type SpotStatus = (typeof spotStatuses)[number];
