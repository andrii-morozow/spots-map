import { sql } from "drizzle-orm";
import {
  check,
  doublePrecision,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { spotDifficultyEnum, spotStatusEnum } from "./enums";

export const spots = pgTable(
  "spots",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),

    latitude: doublePrecision("latitude").notNull(),
    longitude: doublePrecision("longitude").notNull(),

    address: text("address"),
    city: text("city"),
    country: text("country"),

    sportTypes: text("sport_types")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),

    spotTypes: text("spot_types")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),

    difficulty: spotDifficultyEnum("difficulty").notNull().default("unknown"),

    status: spotStatusEnum("status").notNull().default("draft"),

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
    check("spots_latitude_range", sql`${table.latitude} between -90 and 90`),
    check(
      "spots_longitude_range",
      sql`${table.longitude} between -180 and 180`,
    ),
    check("spots_title_not_blank", sql`${table.title} ~ '[^[:space:]]'`),
    check("spots_slug_not_blank", sql`${table.slug} ~ '[^[:space:]]'`),

    index("spots_status_idx").on(table.status),
    index("spots_city_idx").on(table.city),
    index("spots_difficulty_idx").on(table.difficulty),
    index("spots_status_coordinates_idx").on(
      table.status,
      table.latitude,
      table.longitude,
    ),
  ],
);

export type Spot = typeof spots.$inferSelect;
export type NewSpot = typeof spots.$inferInsert;
