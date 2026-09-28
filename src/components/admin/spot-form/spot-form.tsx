"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DetailsStep } from "./details-step/details-step";
import { RateStep } from "./rate-step/rate-step";
import { PhotoStep } from "./photo-step/photo-step";
import type { SpotFormState } from "./spot-form.types";

type Step = 1 | 2 | 3;
const initialState: SpotFormState = {
  title: "",
  slug: "",
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
  const [formData, setFormData] = useState<SpotFormState>(initialState);

  const canContinue =
    formData.title.trim().length > 0 &&
    formData.latitude.trim().length > 0 &&
    formData.longitude.trim().length > 0;

  const photos = useMemo(
    () => formData.photos.filter((photo) => photo.trim().length > 0),
    [formData.photos],
  );

  const updateField = <K extends keyof SpotFormState>(
    key: K,
    value: SpotFormState[K],
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

  const toggleTag = (key: "sportTypes" | "spotTypes", value: string) => {
    setFormData((current) => {
      const hasValue = current[key].includes(value);
      return {
        ...current,
        [key]: hasValue
          ? current[key].filter((item) => item !== value)
          : [...current[key], value],
      };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      id: crypto.randomUUID(),
      title: formData.title.trim(),
      slug:
        formData.slug.trim() ||
        formData.title
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      description: formData.description.trim() || null,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      address: formData.address.trim() || null,
      city: formData.city.trim() || null,
      country: formData.country.trim() || null,
      sport_types: formData.sportTypes,
      spot_types: formData.spotTypes,
      difficulty: formData.difficulty,
      status: formData.status,
      created_by: formData.createdBy.trim() || null,
      photos,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log("spot payload", payload);
    setFormData(initialState);
    setStep(1);
  };

  return (
    <main className="min-h-screen ,radial-gradient(circle_at_top_right,oklch(0.95_0.05_220),transparent_28%),linear-gradient(180deg,oklch(0.99_0_0),oklch(0.97_0_0))] px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="flex w-full max-w-6xl flex-col gap-6 text-left">
        <section className="flex flex-col gap-3">
          <div className="flex flex-col items-start gap-2">
            <div className="max-w-2xl space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Add spot
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-muted-foreground">Step</div>
                <div className="text-lg font-semibold">{step} / 3</div>
              </div>
              <div>
                <div className="text-muted-foreground">Status</div>
                <div className="text-lg font-semibold capitalize">
                  {formData.status}
                </div>
              </div>
            </div>
          </div>
        </section>
        <form
          onSubmit={handleSubmit}
          className="grid min-w-0 grid-cols-1 gap-6"
        >
          <div className="space-y-6">
            <div className="space-y-6">
              {step === 1 ? (
                <DetailsStep formData={formData} updateField={updateField} />
              ) : step === 2 ? (
                <RateStep
                  formData={formData}
                  updateField={updateField}
                  toggleTag={toggleTag}
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
