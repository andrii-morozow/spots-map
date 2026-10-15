import {
  bigint,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { spots } from "./spots";
import {
  imageUploadStatusEnum,
  imageProcessingStatusEnum,
  imageModerationStatusEnum,
} from "./enums";

export const spotImages = pgTable(
  "spot_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    spotId: uuid("spot_id")
      .notNull()
      .references(() => spots.id, { onDelete: "cascade" }),

    originalBucket: text("original_bucket").notNull(),
    originalKey: text("original_key").notNull().unique(),

    width: integer("width"),
    height: integer("height"),
    mimeType: text("mime_type"),
    sizeBytes: bigint("size_bytes", { mode: "number" }),

    uploadStatus: imageUploadStatusEnum("upload_status")
      .notNull()
      .default("pending"),

    processingStatus: imageProcessingStatusEnum("processing_status")
      .notNull()
      .default("not_required"),

    moderationStatus: imageModerationStatusEnum("moderation_status")
      .notNull()
      .default("approved"),

    sortOrder: integer("sort_order").notNull().default(0),
    alt: text("alt"),
    createdBy: text("created_by"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("spot_images_spot_id_idx").on(table.spotId),
    index("spot_images_visibility_idx").on(
      table.spotId,
      table.uploadStatus,
      table.processingStatus,
      table.moderationStatus,
    ),
  ],
);

export type SpotImage = typeof spotImages.$inferSelect;
export type NewSpotImage = typeof spotImages.$inferInsert;
