import styles from "./details-step.module.css";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
};

export function DetailsStep({ formData, updateField }: DetailsStepProps) {
  return (
    <div className={styles.fields}>
      <Field label="Name" htmlFor="title">
        <Input
          id="title"
          value={formData.title}
          onChange={(event) => updateField("title", event.target.value)}
          placeholder="North Point Skatepark"
        />
      </Field>
      <Field label="Type" htmlFor="spot-type">
        <Select
          value={formData.spotTypes[0] ?? ""}
          onValueChange={(value) => {
            const type = spotTypes.find((option) => option === value);
            if (type) updateField("spotTypes", [type]);
          }}
        >
          <SelectTrigger
            id="spot-type"
            className="h-10 w-full rounded-xl bg-transparent px-4 text-base capitalize"
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
      <Field label="Description" htmlFor="description">
        <Textarea
          id="description"
          value={formData.description}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Short note about the place, surface, access, and any moderation context."
          rows={5}
        />
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
        <Field label="City" htmlFor="city">
          <Input
            id="city"
            value={formData.city}
            onChange={(event) => updateField("city", event.target.value)}
            placeholder="Barcelona"
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Field label="Latitude" htmlFor="latitude">
          <Input
            id="latitude"
            inputMode="decimal"
            value={formData.latitude}
            onChange={(event) => updateField("latitude", event.target.value)}
            placeholder="41.3851"
          />
        </Field>
        <Field label="Longitude" htmlFor="longitude">
          <Input
            id="longitude"
            inputMode="decimal"
            value={formData.longitude}
            onChange={(event) => updateField("longitude", event.target.value)}
            placeholder="2.1734"
          />
        </Field>
      </div>
    </div>
  );
}
