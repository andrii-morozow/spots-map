import { useState } from "react";
import styles from "../photo-step.module.css";
import { HugeiconsIcon } from "@hugeicons/react";
import { Album02Icon } from "@hugeicons/core-free-icons";

type Props = {
  busy: boolean;
  message: string;
  input: React.RefObject<HTMLInputElement | null>;
  selectPhotos: (files: File[]) => void;
};

export function AddPhotoButton(props: Props) {
  const { busy, message, input, selectPhotos } = props;

  const [dragging, setDragging] = useState(false);

  return (
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
      <HugeiconsIcon icon={Album02Icon} size={32} />
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
  );
}
