import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import postgres from "postgres";
import { ratingKeys } from "@/constants/spot-ratings";
import { seedSpots } from "../../mocks/spots";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured");
  const client = postgres(databaseUrl, { max: 1 });
  const rollback = new Error("Verification rollback");
  try {
    const records = await client`
      select slug, status, difficulty, access, runup, landing, sport_types, spot_types
      from spots where slug in ${client(seedSpots.map((spot) => spot.slug))}
    `;
    assert.equal(
      records.length,
      seedSpots.length,
      "Expected exactly three demo records",
    );
    for (const fixture of seedSpots) {
      const row = records.find((record) => record.slug === fixture.slug);
      assert(row);
      for (const key of ratingKeys) assert.equal(row[key], fixture[key]);
      assert.equal(row.status, fixture.status);
      assert.deepEqual(row.sport_types, fixture.sportTypes);
      assert.deepEqual(row.spot_types, fixture.spotTypes);
    }
    console.log("PASS: demo ratings, statuses and taxonomy match fixtures");
    try {
      await client.begin(async (transaction) => {
        async function rejects(
          query: (savepoint: postgres.TransactionSql) => Promise<unknown>,
        ) {
          let rejected = false;
          try {
            await transaction.savepoint(query);
          } catch (error) {
            assert(error instanceof postgres.PostgresError);
            assert.equal(error.code, "23514");
            rejected = true;
          }
          assert(rejected, "Invalid rating or publication was accepted");
        }
        const [spot] = await transaction`
          insert into spots(title, slug, latitude, longitude)
          values ('Rating verification', ${`verify-${randomUUID()}`}, 0, 0)
          returning id, difficulty, access, runup, landing
        `;
        for (const key of ratingKeys) {
          assert.equal(spot[key], null);
          for (const invalid of [0, 6]) {
            await rejects(async (savepoint) => {
              await savepoint`update spots set ${savepoint(key)} = ${invalid} where id = ${spot.id}`;
            });
          }
        }
        console.log(
          "PASS: drafts allow null ratings; all rating ranges are enforced",
        );
        await rejects(async (savepoint) => {
          await savepoint`update spots set status = 'published' where id = ${spot.id}`;
        });
        await transaction`
          update spots set difficulty = 2, access = 5, runup = 3, landing = 4,
            status = 'published' where id = ${spot.id}
        `;
        for (const key of ratingKeys) {
          await rejects(async (savepoint) => {
            await savepoint`update spots set ${savepoint(key)} = null where id = ${spot.id}`;
          });
        }
        console.log(
          "PASS: publishing requires all four ratings, including on edits",
        );
        throw rollback;
      });
    } catch (error) {
      if (error !== rollback) throw error;
    }
    console.log("Verification rolled back; no test records retained.");
  } finally {
    await client.end();
  }
}

main().catch((error: unknown) => {
  console.error(
    "Database verification failed:",
    error instanceof postgres.PostgresError
      ? error.code
      : error instanceof Error
        ? error.name
        : "Unknown error",
  );
  process.exitCode = 1;
});
