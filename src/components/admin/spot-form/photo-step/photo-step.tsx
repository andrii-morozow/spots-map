import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PhotoStepProps = {
  photos: string[];
  addPhoto: () => void;
  updatePhoto: (index: number, value: string) => void;
};

export function PhotoStep({ photos, addPhoto, updatePhoto }: PhotoStepProps) {
  return (
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
        {photos.map((photo, index) => (
          <Input
            key={index}
            value={photo}
            onChange={(event) => updatePhoto(index, event.target.value)}
            placeholder={`Photo URL ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
