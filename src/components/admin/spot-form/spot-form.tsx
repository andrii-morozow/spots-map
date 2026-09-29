"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useFormik, type FormikHelpers } from "formik";
import { Button } from "@/components/ui/button";
import { DetailsStep } from "./details-step/details-step";
import { RateStep } from "./rate-step/rate-step";
import { PhotoStep } from "./photo-step/photo-step";
import type { SpotFormValues } from "./spot-form.types";
import {
  validateSpotForm,
  hasRequiredDetails,
  getDetailsErrors,
  getRatingErrors,
  hasRequiredRatings,
  hasRequiredPhotos,
} from "./spot-form.validation";
import styles from "./spot-form.module.css";
import { saveSpot } from "./spot-form.submit";

type Step = 1 | 2 | 3;
const initialValues: SpotFormValues = {
  title: "",
  description: "",
  photos: [""],
  latitude: "",
  longitude: "",
  address: "",
  city: "",
  country: "",
  sportTypes: [],
  spotTypes: [],
  difficulty: null,
  availability: null,
  entrance: null,
  landing: null,
  status: "draft",
  createdBy: "",
};

export function SpotForm() {
  const [step, setStep] = useState<Step>(1);

  const submitSpot = (
    values: SpotFormValues,
    helpers: FormikHelpers<SpotFormValues>,
  ) => {
    if (step !== 3) {
      helpers.setSubmitting(false);
      return;
    }
    try {
      saveSpot(values);
      helpers.resetForm();
      setStep(1);
    } finally {
      helpers.setSubmitting(false);
    }
  };

  const formik = useFormik<SpotFormValues>({
    initialValues,
    initialErrors: validateSpotForm(initialValues),
    validate: validateSpotForm,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: submitSpot,
  });
  const formData = formik.values;

  const errors =
    step === 1
      ? getDetailsErrors(formData)
      : step === 2
        ? getRatingErrors(formData)
        : [];

  const detailsValid = hasRequiredDetails(formData);
  const ratingsValid = hasRequiredRatings(formData);
  const photosValid = hasRequiredPhotos(formData);
  const canSubmit =
    detailsValid &&
    ratingsValid &&
    photosValid &&
    formik.isValid &&
    !formik.isSubmitting;

  const updateField = <K extends keyof SpotFormValues>(
    key: K,
    value: SpotFormValues[K],
  ) => {
    void formik.setFieldValue(key, value);
  };

  const updatePhoto = (index: number, value: string) => {
    void formik.setFieldValue(`photos[${index}]`, value);
  };

  const addPhoto = () => {
    void formik.setFieldValue("photos", [...formik.values.photos, ""]);
  };

  const handleNext = () => {
    if (errors.length) {
      return;
    }
    setStep(step === 1 ? 2 : 3);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!detailsValid) {
      setStep(1);
      return;
    }
    if (!ratingsValid) {
      setStep(2);
      return;
    }
    if (!photosValid || step !== 3) return;

    formik.handleSubmit(event);
  };

  return (
    <main
      className={`${styles.panel} ${step === 2 ? styles.ratingPanel : ""} bg-background px-6 text-foreground lg:px-10`}
    >
      <div
        className={`${styles.content} mx-auto flex w-full max-w-lg flex-col text-left`}
      >
        <header className="flex flex-col gap-4">
          <h1 className="text-[32px] leading-[30px] font-semibold">Add spot</h1>
          <p className="text-base leading-5 text-neutral-500">Step {step}/3</p>
        </header>
        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid min-w-0 grid-cols-1 gap-6"
        >
          <div className={styles.step}>
            <div className="space-y-6">
              {step === 1 ? (
                <DetailsStep formData={formData} updateField={updateField} />
              ) : step === 2 ? (
                <RateStep formData={formData} updateField={updateField} />
              ) : (
                <PhotoStep
                  photos={formData.photos}
                  addPhoto={addPhoto}
                  updatePhoto={updatePhoto}
                />
              )}
            </div>
            <div className="space-y-3">
              {errors.length > 0 && (
                <div
                  id="step-errors"
                  role="status"
                  className="text-xs text-muted-foreground"
                >
                  {errors.map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-start gap-3">
                {step < 3 ? (
                  <Button
                    className="min-w-[117px]"
                    key="next"
                    type="button"
                    disabled={errors.length > 0}
                    aria-describedby={errors.length ? "step-errors" : undefined}
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                ) : (
                  <Button key="submit" type="submit" disabled={!canSubmit}>
                    Submit
                  </Button>
                )}
                {step > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setStep(step === 3 ? 2 : 1);
                    }}
                  >
                    Back
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
