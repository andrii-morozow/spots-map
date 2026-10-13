import { sql } from "drizzle-orm";
import {
  check,
  doublePrecision,
  index,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { spotStatusEnum } from "./enums";
import type { Rating } from "@/constants/spot-ratings";
import type { SportType, SpotType } from "@/constants/spot";

export const spots = pgTable(
  "spots",
  // TODO: destruct fields config
  {
    // TODO understand where id will be defined. remove from here if needed
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
      .$type<SportType[]>()
      .notNull()
      .default(sql`'{}'::text[]`),

    spotTypes: text("spot_types")
      .array()
      .$type<SpotType[]>()
      .notNull()
      .default(sql`'{}'::text[]`),

    difficulty: smallint("difficulty").$type<Rating>(),
    access: smallint("access").$type<Rating>(),
    runup: smallint("runup").$type<Rating>(),
    landing: smallint("landing").$type<Rating>(),

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
  // TODO: destruct validation
  (table) => [
    check("spots_difficulty_range", sql`${table.difficulty} between 1 and 5`),
    check("spots_access_range", sql`${table.access} between 1 and 5`),
    check("spots_runup_range", sql`${table.runup} between 1 and 5`),
    check("spots_landing_range", sql`${table.landing} between 1 and 5`),
    check(
      "spots_published_ratings",
      sql`${table.status} <> 'published' or (
      ${table.difficulty} is not null and ${table.access} is not null
      and ${table.runup} is not null and ${table.landing} is not null
    )`,
    ),
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
