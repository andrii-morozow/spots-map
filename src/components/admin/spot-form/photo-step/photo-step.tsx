import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PhotoStepProps = {
  photos: string[];
  invalid: boolean;
  addPhoto: () => void;
  updatePhoto: (index: number, value: string) => void;
};

export function PhotoStep({ photos, addPhoto, updatePhoto, invalid }: PhotoStepProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-medium">Photos<span aria-hidden="true"> *</span></div>
        </div>
        <Button type="button" variant="secondary" onClick={addPhoto}>
          Add photo
        </Button>
      </div>
      <div className="grid gap-3">
        {photos.map((photo, index) => (
          <Input
            key={index}
            aria-invalid={invalid}
            aria-label={`Photo URL ${index + 1}`}
            value={photo}
            onChange={(event) => updatePhoto(index, event.target.value)}
            placeholder={`Photo URL ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
