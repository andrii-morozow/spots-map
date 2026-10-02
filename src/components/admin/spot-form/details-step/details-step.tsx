import { useState } from "react";
import type { FormikErrors } from "formik";
import styles from "./details-step.module.css";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "../field/field";
import type { SpotFormValues, UpdateSpotField } from "../spot-form.types";
import { spotTypes } from "@/constants/spot";

type DetailsStepProps = {
  formData: SpotFormValues;
  updateField: UpdateSpotField;
  errors: FormikErrors<SpotFormValues>;
};

function formatCoordinate(value: string, limit: number) {
  const number = Number(value);
  if (!value.trim() || !Number.isFinite(number) || Math.abs(number) > limit) {
    return value;
  }
  return number.toFixed(6);
}

export function DetailsStep({
  formData,
  updateField,
  errors,
}: DetailsStepProps) {
  const [editingCoordinate, setEditingCoordinate] = useState<
    "latitude" | "longitude" | null
  >(null);

  return (
    <div className={styles.fields}>
      <Field required label="Name" htmlFor="title">
        <Input
          id="title"
          aria-invalid={Boolean(errors.title)}
          required
          value={formData.title}
          onChange={(event) => updateField("title", event.target.value)}
          placeholder="North Point Skatepark"
        />
      </Field>
      <Field required label="Type" htmlFor="spot-type">
        <Select
          required
          value={formData.spotTypes[0] ?? ""}
          onValueChange={(value) => {
            const type = spotTypes.find((option) => option === value);
            if (type) updateField("spotTypes", [type]);
          }}
        >
          <SelectTrigger
            id="spot-type"
            aria-invalid={Boolean(errors.spotTypes)}
            className="h-10 w-full bg-transparent px-4 text-base capitalize"
          >
            <SelectValue placeholder="Choose type" />
          </SelectTrigger>
          <SelectContent>
            {spotTypes.map((option) => (
              <SelectItem key={option} value={option} className="capitalize">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Address" htmlFor="address">
        <Input
          id="address"
          value={formData.address}
          onChange={(event) => updateField("address", event.target.value)}
          placeholder="123 Ocean Ave"
        />
      </Field>
      <div className="grid grid-cols-2 gap-6">
        <Field label="Country" htmlFor="country">
          <Input
            id="country"
            value={formData.country}
            onChange={(event) => updateField("country", event.target.value)}
            placeholder="Spain"
          />
        </Field>
        <Field required label="City" htmlFor="city">
          <Input
            id="city"
            aria-invalid={Boolean(errors.city)}
            required
            value={formData.city}
            onChange={(event) => updateField("city", event.target.value)}
            placeholder="Barcelona"
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Field required label="Latitude" htmlFor="latitude">
          <Input
            id="latitude"
            required
            inputMode="decimal"
            value={
              editingCoordinate === "latitude"
                ? formData.latitude
                : formatCoordinate(formData.latitude, 90)
            }
            onFocus={() => setEditingCoordinate("latitude")}
            onBlur={() => setEditingCoordinate(null)}
            onChange={(event) => updateField("latitude", event.target.value)}
            placeholder="-90.0000 to 90.0000"
            aria-invalid={Boolean(errors.latitude)}
          />
        </Field>
        <Field required label="Longitude" htmlFor="longitude">
          <Input
            id="longitude"
            required
            inputMode="decimal"
            value={
              editingCoordinate === "longitude"
                ? formData.longitude
                : formatCoordinate(formData.longitude, 180)
            }
            onFocus={() => setEditingCoordinate("longitude")}
            onBlur={() => setEditingCoordinate(null)}
            onChange={(event) => updateField("longitude", event.target.value)}
            placeholder="-180.0000 to 180.0000"
            aria-invalid={Boolean(errors.longitude)}
          />
        </Field>
      </div>
    </div>
  );
}
