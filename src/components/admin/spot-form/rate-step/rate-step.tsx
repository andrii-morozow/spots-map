import type { FormikErrors } from "formik";
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
  errors: FormikErrors<SpotFormValues>;
};

export function RateStep({ formData, updateField, errors }: RateStepProps) {
  const id = useId();

  return (
    <div className={styles.ratings}>
      {fields.map(({ key, label }) => (
        <fieldset key={key} className={styles.field} aria-invalid={Boolean(errors[key])}>
          <legend className={styles.legend}>{label}<span aria-hidden="true"> *</span></legend>
          <div className={styles.options} data-invalid={Boolean(errors[key])}>
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
