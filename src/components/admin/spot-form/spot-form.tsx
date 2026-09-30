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
  getInitialErrors,
  spotFormSchema,
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
  ...(process.env.NODE_ENV === "development"
    ? ({
        title: "North Point Skatepark",
        description: "A spacious skate spot with rails and smooth concrete.",
        latitude: "41.3851",
        longitude: "2.1734",
        city: "Barcelona",
        country: "Spain",
        spotTypes: ["rail"],
        difficulty: 2,
        availability: 5,
        entrance: 3,
        landing: 4,
      } satisfies Partial<SpotFormValues>)
    : {}),
};

export function SpotForm() {
  const [step, setStep] = useState<Step>(1);
  const [showErrors, setShowErrors] = useState(false);

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
      setShowErrors(false);
      setStep(1);
    } finally {
      helpers.setSubmitting(false);
    }
  };

  const formik = useFormik<SpotFormValues>({
    initialValues,
    initialErrors: getInitialErrors(initialValues),
    validationSchema: spotFormSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: submitSpot,
  });
  const formData = formik.values;

  const photosValid = hasRequiredPhotos(formData);
  const errors =
    step === 1
      ? getDetailsErrors(formData)
      : step === 2
        ? getRatingErrors(formData)
        : photosValid
          ? []
          : ["Add at least one photo."];

  const detailsValid = hasRequiredDetails(formData);
  const ratingsValid = hasRequiredRatings(formData);
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
    setShowErrors(true);
    if (step === 1 ? !detailsValid : !ratingsValid) {
      return;
    }
    setShowErrors(false);
    setStep(step === 1 ? 2 : 3);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowErrors(true);
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
    <main className={`${styles.panel} bg-background text-foreground`}>
      <div className={`${styles.content} flex w-full flex-col text-left`}>
        <header className="flex flex-col gap-4 py-0 px-1">
          <h1 className="text-[32px] leading-[30px] font-semibold">Add spot</h1>
          <p className="text-base leading-5 text-neutral-500">Step {step}/3</p>
        </header>
        <div className={`${styles.scrollArea} py-0 px-1`} key={step}>
          <form
            onSubmit={handleSubmit}
            noValidate
            className={`${styles.form} grid min-w-0 grid-cols-1 gap-6`}
          >
            <div className={styles.step}>
              <div className="space-y-6">
                {step === 1 ? (
                  <DetailsStep
                    formData={formData}
                    updateField={updateField}
                    errors={showErrors ? formik.errors : {}}
                  />
                ) : step === 2 ? (
                  <RateStep
                    formData={formData}
                    updateField={updateField}
                    errors={showErrors ? formik.errors : {}}
                  />
                ) : (
                  <PhotoStep
                    photos={formData.photos}
                    invalid={showErrors && !photosValid}
                    addPhoto={addPhoto}
                    updatePhoto={updatePhoto}
                  />
                )}
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-start gap-3">
                  {step < 3 ? (
                    <Button
                      className="min-w-[117px]"
                      key="next"
                      type="button"
                      aria-describedby={
                        showErrors && errors.length ? "step-errors" : undefined
                      }
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      key="submit"
                      type="submit"
                      disabled={formik.isSubmitting}
                    >
                      Submit
                    </Button>
                  )}
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setShowErrors(false);
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
      </div>
    </main>
  );
}
