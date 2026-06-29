"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Step = 1 | 2;
type SpotFormState = {
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

const sportOptions = ["skate", "bmx", "surf", "climb", "basketball", "fitness"];
const spotOptions = ["park", "street", "indoor", "outdoor", "plaza", "bowls"];

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

export function SpotAdminForm() {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<SpotFormState>(initialState);

  const progress = step === 1 ? 50 : 100;
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,oklch(0.97_0.04_110),transparent_32%),radial-gradient(circle_at_top_right,oklch(0.95_0.05_220),transparent_28%),linear-gradient(180deg,oklch(0.99_0_0),oklch(0.97_0_0))] px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="flex flex-col gap-3 rounded-3xl border border-border/60 bg-card/80 p-6 shadow-2xl backdrop-blur sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                Spot admin
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Add a new spot
              </h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                Two-step creation flow for core metadata, photos, location, and
                classification fields.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3">
                <div className="text-muted-foreground">Step</div>
                <div className="text-lg font-semibold">{step} / 2</div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3">
                <div className="text-muted-foreground">Photos</div>
                <div className="text-lg font-semibold">{photos.length}</div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3">
                <div className="text-muted-foreground">Status</div>
                <div className="text-lg font-semibold capitalize">
                  {formData.status}
                </div>
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </section>
        <form
          onSubmit={handleSubmit}
          className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]"
        >
          <Card className="border-border/60 bg-card/85 shadow-xl backdrop-blur">
            <CardHeader className="space-y-3 border-b border-border/60">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>
                    {step === 1
                      ? "Step 1. Identity and location"
                      : "Step 2. Rate params"}
                  </CardTitle>
                  <CardDescription>
                    {step === 1
                      ? "Name the spot, attach media, and pin it on the map."
                      : "Set classification fields that drive moderation and discovery."}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    disabled={step === 1}
                  >
                    1
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    disabled={!canContinue}
                  >
                    2
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {step === 1 ? (
                <div className="grid gap-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Name" htmlFor="title">
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(event) =>
                          updateField("title", event.target.value)
                        }
                        placeholder="North Point Skatepark"
                      />
                    </Field>
                    <Field label="Slug" htmlFor="slug" hint="Optional">
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(event) =>
                          updateField("slug", event.target.value)
                        }
                        placeholder="north-point-skatepark"
                      />
                    </Field>
                  </div>
                  <Field label="Description" htmlFor="description">
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(event) =>
                        updateField("description", event.target.value)
                      }
                      placeholder="Short note about the place, surface, access, and any moderation context."
                      rows={5}
                    />
                  </Field>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium">Photos</div>
                        <div className="text-xs text-muted-foreground">
                          Add image URLs for the spot gallery.
                        </div>
                      </div>
                      <Button type="button" variant="secondary" onClick={addPhoto}>
                        Add photo
                      </Button>
                    </div>
                    <div className="grid gap-3">
                      {formData.photos.map((photo, index) => (
                        <Input
                          key={`${index}-${photo}`}
                          value={photo}
                          onChange={(event) => updatePhoto(index, event.target.value)}
                          placeholder={`Photo URL ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Address" htmlFor="address">
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(event) =>
                          updateField("address", event.target.value)
                        }
                        placeholder="123 Ocean Ave"
                      />
                    </Field>
                    <Field label="City" htmlFor="city">
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(event) => updateField("city", event.target.value)}
                        placeholder="Barcelona"
                      />
                    </Field>
                    <Field label="Country" htmlFor="country">
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(event) =>
                          updateField("country", event.target.value)
                        }
                        placeholder="Spain"
                      />
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Latitude" htmlFor="latitude">
                        <Input
                          id="latitude"
                          inputMode="decimal"
                          value={formData.latitude}
                          onChange={(event) =>
                            updateField("latitude", event.target.value)
                          }
                          placeholder="41.3851"
                        />
                      </Field>
                      <Field label="Longitude" htmlFor="longitude">
                        <Input
                          id="longitude"
                          inputMode="decimal"
                          value={formData.longitude}
                          onChange={(event) =>
                            updateField("longitude", event.target.value)
                          }
                          placeholder="2.1734"
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Difficulty" htmlFor="difficulty">
                      <Select
                        value={formData.difficulty}
                        onValueChange={(value) =>
                          updateField("difficulty", value as SpotFormState["difficulty"])
                        }
                      >
                        <SelectTrigger id="difficulty" className="w-full">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unknown">Unknown</SelectItem>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Status" htmlFor="status">
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          updateField("status", value as SpotFormState["status"])
                        }
                      >
                        <SelectTrigger id="status" className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                  <Field label="Created by" htmlFor="created-by" hint="Optional">
                    <Input
                      id="created-by"
                      value={formData.createdBy}
                      onChange={(event) => updateField("createdBy", event.target.value)}
                      placeholder="user-id-or-email"
                    />
                  </Field>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium">Sport types</div>
                        <div className="text-xs text-muted-foreground">
                          Pick the sports supported by this spot.
                        </div>
                      </div>
                      <div className="grid gap-2">
                        {sportOptions.map((option) => (
                          <TagRow
                            key={option}
                            checked={formData.sportTypes.includes(option)}
                            label={option}
                            onCheckedChange={() => toggleTag("sportTypes", option)}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium">Spot types</div>
                        <div className="text-xs text-muted-foreground">
                          Pick the physical layout and environment tags.
                        </div>
                      </div>
                      <div className="grid gap-2">
                        {spotOptions.map((option) => (
                          <TagRow
                            key={option}
                            checked={formData.spotTypes.includes(option)}
                            label={option}
                            onCheckedChange={() => toggleTag("spotTypes", option)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                    <div className="text-sm font-medium">Quick review</div>
                    <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center justify-between gap-4">
                        <span>Spot title</span>
                        <span className="text-foreground">
                          {formData.title || "Untitled"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span>Coordinates</span>
                        <span className="text-foreground">
                          {formData.latitude || "-"}, {formData.longitude || "-"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span>Tags</span>
                        <span className="text-foreground">
                          {formData.sportTypes.length + formData.spotTypes.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="space-y-6">
            <Card className="border-border/60 bg-card/85 shadow-xl backdrop-blur">
              <CardHeader>
                <CardTitle>State preview</CardTitle>
                <CardDescription>
                  This is the payload that will be sent to your backend.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4 font-mono text-xs leading-5 text-muted-foreground">
                  <div>{"{"}</div>
                  <div className="pl-3">
                    title: &quot;{formData.title || "..."}&quot;,
                  </div>
                  <div className="pl-3">
                    slug: &quot;{formData.slug || "auto"}&quot;,
                  </div>
                  <div className="pl-3">
                    difficulty: &quot;{formData.difficulty}&quot;,
                  </div>
                  <div className="pl-3">
                    status: &quot;{formData.status}&quot;,
                  </div>
                  <div className="pl-3">photos: {photos.length},</div>
                  <div className="pl-3">
                    sport_types: {formData.sportTypes.length},
                  </div>
                  <div className="pl-3">spot_types: {formData.spotTypes.length}</div>
                  <div>{"}"}</div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setFormData(initialState)}
                >
                  Reset form
                </Button>
                <div className="text-xs text-muted-foreground">
                  Required for submit: title, latitude, longitude.
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-card/85 shadow-xl backdrop-blur">
              <CardHeader>
                <CardTitle>Submission</CardTitle>
                <CardDescription>
                  Step through the form and then publish the payload.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    disabled={step === 1}
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  {step === 1 ? (
                    <Button
                      type="button"
                      className="flex-1"
                      disabled={!canContinue}
                      onClick={() => setStep(2)}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" className="flex-1">
                      Save spot
                    </Button>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  The form currently logs a normalized payload to the console.
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium">{label}</span>
        {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
      </div>
      {children}
    </label>
  );
}

function TagRow({
  checked,
  label,
  onCheckedChange,
}: {
  checked: boolean;
  label: string;
  onCheckedChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onCheckedChange}
      className={cn(
        "flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-colors",
        checked
          ? "border-foreground bg-foreground text-background"
          : "border-border/70 bg-background/60 hover:bg-muted/50",
      )}
    >
      <span
        className={cn(
          "flex size-4 items-center justify-center rounded-[6px] border transition-colors",
          checked ? "border-background bg-background" : "border-border bg-transparent",
        )}
      >
        <span
          className={cn(
            "size-2 rounded-[3px] transition-all",
            checked ? "scale-100 bg-foreground" : "scale-0 bg-transparent",
          )}
        />
      </span>
      <span className="capitalize">{label}</span>
    </button>
  );
}
