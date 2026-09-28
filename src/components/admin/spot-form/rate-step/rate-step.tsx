import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Field } from "../field/field";
import type { SpotFormState, UpdateSpotField } from "../spot-form.types";

const sportOptions = ["skate", "bmx", "surf", "climb", "basketball", "fitness"];
const spotOptions = ["park", "street", "indoor", "outdoor", "plaza", "bowls"];

type RateStepProps = {
  formData: SpotFormState;
  updateField: UpdateSpotField;
  toggleTag: (key: "sportTypes" | "spotTypes", value: string) => void;
};

export function RateStep({ formData, updateField, toggleTag }: RateStepProps) {
  return (
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
      <div>
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
          checked
            ? "border-background bg-background"
            : "border-border bg-transparent",
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
