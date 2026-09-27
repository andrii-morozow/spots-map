import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type StatePreviewProps = {
  formData: {
    title: string;
    slug: string;
    difficulty: string;
    status: string;
    sportTypes: string[];
    spotTypes: string[];
  };
  photoCount: number;
  onReset: () => void;
};

export function StatePreview({
  formData,
  photoCount,
  onReset,
}: StatePreviewProps) {
  return (
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
          <div className="pl-3">photos: {photoCount},</div>
          <div className="pl-3">
            sport_types: {formData.sportTypes.length},
          </div>
          <div className="pl-3">
            spot_types: {formData.spotTypes.length}
          </div>
          <div>{"}"}</div>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onReset}
        >
          Reset form
        </Button>
        <div className="text-xs text-muted-foreground">
          Required for submit: title, latitude, longitude.
        </div>
      </CardContent>
    </Card>
  );
}
