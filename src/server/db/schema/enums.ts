import { pgEnum } from "drizzle-orm/pg-core";
import { spotStatuses } from "@/constants/spot";

export const spotStatusEnum = pgEnum("spot_status", spotStatuses);

export const imageUploadStatusEnum = pgEnum("image_upload_status", [
  "pending",
  "uploaded",
  "failed",
]);

export const imageProcessingStatusEnum = pgEnum("image_processing_status", [
  "not_required",
  "pending",
  "processing",
  "ready",
  "failed",
]);

export const imageModerationStatusEnum = pgEnum("image_moderation_status", [
  "approved",
  "pending",
  "rejected",
  "needs_review",
]);
