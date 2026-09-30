import { useRef, useState } from "react";
import styles from "./photo-step.module.css";

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
  const [dragging, setDragging] = useState(false);
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
      <button
        type="button"
        className={styles.dropzone}
        data-dragging={dragging}
        aria-label="Add photos"
        data-invalid={Boolean(message)}
        aria-describedby={message ? "photo-error" : "photo-hint"}
        aria-busy={busy}
        disabled={busy}
        onClick={() => input.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = "copy";
          setDragging(true);
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null))
            setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void selectPhotos(Array.from(event.dataTransfer.files));
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="m5 16-2-11 14-2 1 5" strokeLinejoin="round" />
          <rect x="6" y="7" width="15" height="13" rx="2" />
          <circle cx="11" cy="11" r="1" />
          <path d="m7 18 4-4 3 3 3-5 4 5" strokeLinejoin="round" />
        </svg>
        <span id="photo-hint">
          {busy ? (
            "Adding images…"
          ) : (
            <>
              <span className={styles.link}>Click to add</span> or drag and drop
              your images.
            </>
          )}
          <br />
          We support png, jpeg files.
        </span>
      </button>
      {photos.length > 0 && (
        <div className={styles.previews}>
          {photos.map((photo, index) => (
            <div
              className={styles.preview}
              key={`${index}-${photo.slice(-32)}`}
            >
              {/* Local data URLs do not need Next.js image optimization. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt={`Spot photo ${index + 1}`} />
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
