import type { SpotFormValues } from "./spot-form.types";
import { toSpotInput } from "./spot-form.utils";

export function saveSpot(values: SpotFormValues) {
  const payload = toSpotInput(values);
  // API persistence and photo uploads are implemented in their own sprints.
  console.log("spot payload", payload);
  return payload;
}
