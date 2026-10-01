import type { FormikErrors } from "formik";
import { useId } from "react";
import type { SpotFormValues, UpdateSpotField } from "../spot-form.types";
import { fields, ratings } from "@/constants/spot-ratings";
import styles from "./rate-step.module.css";

type RateStepProps = {
  formData: SpotFormValues;
  updateField: UpdateSpotField;
  errors: FormikErrors<SpotFormValues>;
};

export function RateStep({ formData, updateField, errors }: RateStepProps) {
  const id = useId();

  return (
    <div className={styles.ratings}>
      {fields.map(({ key, label, descriptions }) => (
        <fieldset
          key={key}
          className={styles.field}
          aria-invalid={Boolean(errors[key])}
        >
          <legend className={styles.legend}>
            {label}
            <span aria-hidden="true"> *</span>
          </legend>
          <div className={styles.row}>
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
                    aria-describedby={`${id}-${key}-description`}
                    onChange={() => updateField(key, rating)}
                  />
                  <span className={styles.value}>{rating}</span>
                </label>
              ))}
            </div>
            <p
              id={`${id}-${key}-description`}
              className={styles.description}
              aria-live="polite"
              aria-atomic="true"
            >
              {formData[key] === null
                ? "Select a number to see what it means."
                : descriptions[formData[key] - 1]}
            </p>
          </div>
        </fieldset>
      ))}
    </div>
  );
}
