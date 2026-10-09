import { pgEnum } from "drizzle-orm/pg-core";

export const spotDifficultyEnum = pgEnum("spot_difficulty", [
  "easy",
  "medium",
  "hard",
  "unknown",
]);

export const spotStatusEnum = pgEnum("spot_status", [
  "draft",
  "published",
  "archived",
]);

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
