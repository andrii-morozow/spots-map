import { useId } from "react";
import type { SpotFormValues, UpdateSpotField } from "../spot-form.types";
import styles from "./rate-step.module.css";

const ratings = [1, 2, 3, 4, 5] as const;
const fields = [
  { key: "difficulty", label: "Difficulty" },
  { key: "availability", label: "Availability" },
  { key: "entrance", label: "Entrance" },
  { key: "landing", label: "Landing" },
] as const;

type RateStepProps = {
  formData: SpotFormValues;
  updateField: UpdateSpotField;
};

export function RateStep({ formData, updateField }: RateStepProps) {
  const id = useId();

  return (
    <div className={styles.ratings}>
      {fields.map(({ key, label }) => (
        <fieldset key={key} className={styles.field}>
          <legend className={styles.legend}>{label}</legend>
          <div className={styles.options}>
            {ratings.map((rating) => (
              <label key={rating} className={styles.option}>
                <input
                  className={styles.input}
                  type="radio"
                  name={`${id}-${key}`}
                  value={rating}
                  checked={formData[key] === rating}
                  required
                  onChange={() => updateField(key, rating)}
                />
                <span className={styles.value}>{rating}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
