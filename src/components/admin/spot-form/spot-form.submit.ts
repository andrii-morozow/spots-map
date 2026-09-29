import type { SpotFormValues } from "./spot-form.types";
import { toSpot } from "./spot-form.utils";

export function saveSpot(values: SpotFormValues) {
  const payload = toSpot(values, {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  });

  console.log("spot payload", payload);
  return payload;
}
