import type { SpotFormValues } from "@/components/admin/spot-form/spot-form.types";

export const spotFormDemoValues = {
  title: "North Point Skatepark",
  description: "A spacious skate spot with rails and smooth concrete.",
  latitude: "41.3851",
  longitude: "2.1734",
  city: "Barcelona",
  country: "Spain",
  spotTypes: ["rail"],
  difficulty: 2,
  access: 5,
  runup: 3,
  landing: 4,
} satisfies Partial<SpotFormValues>;
