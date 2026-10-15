import "server-only";

import { desc, eq } from "drizzle-orm";

import { db } from "@/server/db";
import { spots } from "@/server/db/schema";
import type { SpotCreateInput, SpotUpdateInput } from "../spot.schemas";

export async function listAdminSpots() {
  return db.select().from(spots).orderBy(desc(spots.updatedAt));
}

export async function getAdminSpotById(id: string) {
  const [spot] = await db.select().from(spots).where(eq(spots.id, id)).limit(1);

  return spot ?? null;
}

export async function createSpot(input: SpotCreateInput, userId: string) {
  const [spot] = await db
    .insert(spots)
    .values({ ...input, createdBy: userId })
    .returning();

  return spot;
}

export async function updateSpot(id: string, input: SpotUpdateInput) {
  const [spot] = await db
    .update(spots)
    .set(input)
    .where(eq(spots.id, id))
    .returning();

  return spot ?? null;
}

export async function archiveSpot(id: string) {
  const [spot] = await db
    .update(spots)
    .set({ status: "archived" })
    .where(eq(spots.id, id))
    .returning();

  return spot ?? null;
}
