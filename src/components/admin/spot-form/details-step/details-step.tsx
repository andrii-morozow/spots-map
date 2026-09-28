import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "../field/field";
import type { SpotFormState, UpdateSpotField } from "../spot-form.types";

type DetailsStepProps = {
  formData: SpotFormState;
  updateField: UpdateSpotField;
};

export function DetailsStep({ formData, updateField }: DetailsStepProps) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name" htmlFor="title">
          <Input
            id="title"
            value={formData.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="North Point Skatepark"
          />
        </Field>
        <Field label="Slug" htmlFor="slug" hint="Optional">
          <Input
            id="slug"
            value={formData.slug}
            onChange={(event) => updateField("slug", event.target.value)}
            placeholder="north-point-skatepark"
          />
        </Field>
      </div>
      <Field label="Description" htmlFor="description">
        <Textarea
          id="description"
          value={formData.description}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Short note about the place, surface, access, and any moderation context."
          rows={5}
        />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Address" htmlFor="address">
          <Input
            id="address"
            value={formData.address}
            onChange={(event) => updateField("address", event.target.value)}
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
            onChange={(event) => updateField("country", event.target.value)}
            placeholder="Spain"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
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
    </div>
  );
}
