import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { spots } from "./schema";
import { seedSpots } from "../../mocks/spots";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(databaseUrl);
  } catch {
    throw new Error(
      "DATABASE_URL must be a complete PostgreSQL connection URL",
    );
  }
  if (!["postgres:", "postgresql:"].includes(parsedUrl.protocol)) {
    throw new Error(
      "DATABASE_URL must start with postgres:// or postgresql://",
    );
  }

  const client = postgres(databaseUrl, { max: 1 });
  const db = drizzle(client);

  try {
    const inserted = await db
      .insert(spots)
      .values(seedSpots)
      .onConflictDoNothing({ target: spots.slug })
      .returning({ slug: spots.slug });

    console.log(`Seed complete: inserted ${inserted.length} spots.`);
  } finally {
    await client.end();
  }
}

main().catch((error: unknown) => {
  let cause = error;
  for (let depth = 0; depth < 5; depth++) {
    if (!(cause instanceof Error) || !cause.cause) break;
    cause = cause.cause;
  }

  let message =
    cause instanceof Error ? cause.message : "Unknown database error";
  message = message.replace(
    /postgres(?:ql)?:\/\/[^\s]+/gi,
    "[redacted connection URL]",
  );

  if (process.env.DATABASE_URL) {
    try {
      const password = new URL(process.env.DATABASE_URL).password;
      for (const secret of [password, decodeURIComponent(password)]) {
        if (secret) message = message.replaceAll(secret, "[redacted]");
      }
    } catch {
      // Keep the controlled validation message when the URL is invalid.
    }
  }

  console.error(`Seed failed: ${message}`);
  process.exitCode = 1;
});
