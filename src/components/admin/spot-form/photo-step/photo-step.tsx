import Image from "next/image";
import { useRef, useState } from "react";
import styles from "./photo-step.module.css";
import { AddPhotoButton } from "./add-photo-button/add-photo-button";

type PhotoStepProps = {
  photos: string[];
  invalid: boolean;
  addPhotos: (photos: string[]) => void;
  removePhoto: (index: number) => void;
};

function readPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read this image."));
    reader.readAsDataURL(file);
  });
}

export function PhotoStep({
  photos,
  addPhotos,
  removePhoto,
  invalid,
}: PhotoStepProps) {
  const input = useRef<HTMLInputElement>(null);
  const reading = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function selectPhotos(files: File[]) {
    if (reading.current || !files.length) return;
    const images = files.filter((file) =>
      ["image/png", "image/jpeg"].includes(file.type),
    );
    setError(
      images.length !== files.length ? "Please choose PNG or JPEG images." : "",
    );
    if (!images.length) return;
    reading.current = true;
    setBusy(true);
    try {
      addPhotos(await Promise.all(images.map(readPhoto)));
    } catch {
      setError("Could not read the images. Please try again.");
    } finally {
      reading.current = false;
      setBusy(false);
    }
  }

  const message = error || (invalid ? "Add at least one photo." : "");

  return (
    <div className={styles.photos}>
      <input
        ref={input}
        className="sr-only"
        type="file"
        accept="image/png,image/jpeg"
        multiple
        tabIndex={-1}
        aria-label="Choose photos"
        aria-invalid={Boolean(message)}
        disabled={busy}
        onChange={(event) => {
          void selectPhotos(Array.from(event.target.files ?? []));
          event.target.value = "";
        }}
      />

      <AddPhotoButton
        busy={busy}
        message={message}
        input={input}
        selectPhotos={selectPhotos}
      />

      {photos.length > 0 && (
        <div className={styles.previews}>
          {photos.map((photo, index) => (
            <div
              className={styles.preview}
              key={`${index}-${photo.slice(-32)}`}
            >
              <Image src={photo} alt={`Spot photo ${index + 1}`} fill />
              <button
                type="button"
                className={styles.remove}
                aria-label={`Remove photo ${index + 1}`}
                onClick={() => removePhoto(index)}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          ))}
        </div>
      )}
      {message && (
        <p id="photo-error" role="alert" className="text-sm text-destructive">
          {message}
        </p>
      )}
    </div>
  );
}
