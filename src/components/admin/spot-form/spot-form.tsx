"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DetailsStep } from "./details-step/details-step";
import { RateStep } from "./rate-step/rate-step";
import { PhotoStep } from "./photo-step/photo-step";
import type { SpotFormValues } from "./spot-form.types";
import type { SportType } from "@/types/spot";
import styles from "./spot-form.module.css";
import { toSpot } from "./spot-form.utils";

type Step = 1 | 2 | 3;
const initialState: SpotFormValues = {
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
  difficulty: "unknown",
  status: "draft",
  createdBy: "",
};

export function SpotForm() {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<SpotFormValues>(initialState);

  const canContinue =
    formData.title.trim().length > 0 &&
    formData.latitude.trim().length > 0 &&
    formData.longitude.trim().length > 0;

  const updateField = <K extends keyof SpotFormValues>(
    key: K,
    value: SpotFormValues[K],
  ) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const updatePhoto = (index: number, value: string) => {
    setFormData((current) => {
      const nextPhotos = [...current.photos];
      nextPhotos[index] = value;
      return { ...current, photos: nextPhotos };
    });
  };

  const addPhoto = () => {
    setFormData((current) => ({ ...current, photos: [...current.photos, ""] }));
  };

  const toggleSport = (value: SportType) => {
    setFormData((current) => {
      const hasValue = current.sportTypes.includes(value);
      return {
        ...current,
        sportTypes: hasValue
          ? current.sportTypes.filter((item) => item !== value)
          : [...current.sportTypes, value],
      };
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = toSpot(formData, {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    });

    console.log("spot payload", payload);
    setFormData(initialState);
    setStep(1);
  };

  return (
    <main
      className={`${styles.panel} bg-background px-6 text-foreground lg:px-10`}
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
          className="grid min-w-0 grid-cols-1 gap-6"
        >
          <div className={styles.step}>
            <div className="space-y-6">
              {step === 1 ? (
                <DetailsStep formData={formData} updateField={updateField} />
              ) : step === 2 ? (
                <RateStep
                  formData={formData}
                  updateField={updateField}
                  toggleSport={toggleSport}
                />
              ) : (
                <PhotoStep
                  photos={formData.photos}
                  addPhoto={addPhoto}
                  updatePhoto={updatePhoto}
                />
              )}
            </div>
            <div className="flex items-center justify-start gap-3">
              {step < 3 ? (
                <Button
                  className="min-w-[117px]"
                  key="next"
                  type="button"
                  disabled={!canContinue}
                  onClick={() => setStep(step === 1 ? 2 : 3)}
                >
                  Next
                </Button>
              ) : (
                <Button key="submit" type="submit">
                  Submit
                </Button>
              )}
              {step === 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
