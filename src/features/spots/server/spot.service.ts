import "server-only";

import { desc, eq } from "drizzle-orm";

import { db } from "@/server/db";
import { spots } from "@/server/db/schema";

export async function listAdminSpots() {
  return db.select().from(spots).orderBy(desc(spots.updatedAt));
}

export async function getAdminSpotById(id: string) {
  const [spot] = await db.select().from(spots).where(eq(spots.id, id)).limit(1);

  return spot ?? null;
}
