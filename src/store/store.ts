import type { Spot } from "@/types/spot";

export const spot: Spot = {
  id: "mock-spot",
  title: "Example skatepark",
  slug: "example-skatepark",
  description: null,
  address: null,
  city: null,
  country: null,
  latitude: 50.45,
  longitude: 30.523333,
  sportTypes: ["skate"],
  spotTypes: ["skatepark"],
  difficulty: 3,
  access: 3,
  runup: 3,
  landing: 3,
  status: "draft",
  createdBy: null,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};
