export type SpotFormState = {
  title: string;
  slug: string;
  description: string;
  photos: string[];
  latitude: string;
  longitude: string;
  address: string;
  city: string;
  country: string;
  sportTypes: string[];
  spotTypes: string[];
  difficulty: "easy" | "medium" | "hard" | "unknown";
  status: "draft" | "published" | "archived";
  createdBy: string;
};

export type UpdateSpotField = <K extends keyof SpotFormState>(
  key: K,
  value: SpotFormState[K],
) => void;
