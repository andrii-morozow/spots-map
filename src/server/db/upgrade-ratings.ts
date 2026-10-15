import postgres from "postgres";
import { seedSpots } from "../../mocks/spots";

// One-time transition for the already-deployed enum column. No generated SQL migrations.
async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured");
  const client = postgres(databaseUrl, { max: 1 });
  try {
    await client.begin(async (transaction) => {
      await transaction`lock table spots in access exclusive mode`;
      const [column] = await transaction`
        select data_type, udt_name from information_schema.columns
        where table_schema = 'public' and table_name = 'spots' and column_name = 'difficulty'
      `;
      if (!column)
        throw new Error("Create the spots table before running this upgrade");
      if (column.udt_name === "spot_difficulty") {
        await transaction`alter table spots alter column difficulty drop default`;
        await transaction`alter table spots alter column difficulty drop not null`;
        await transaction`
          alter table spots alter column difficulty type smallint using (
            case difficulty::text
              when 'easy' then 2 when 'medium' then 3 when 'hard' then 4
              when 'unknown' then null
            end
          )
        `;
      } else if (column.data_type !== "smallint") {
        throw new Error("Unexpected difficulty column type; upgrade aborted");
      }
      await transaction`alter table spots add column if not exists access smallint`;
      await transaction`alter table spots add column if not exists runup smallint`;
      await transaction`alter table spots add column if not exists landing smallint`;

      // Refresh only known demo slugs; all other records retain their values.
      for (const fixture of seedSpots) {
        await transaction`
          update spots set difficulty = ${fixture.difficulty ?? null},
            access = ${fixture.access ?? null}, runup = ${fixture.runup ?? null},
            landing = ${fixture.landing ?? null},
            sport_types = ${transaction.array(fixture.sportTypes ?? [], 25)},
            spot_types = ${transaction.array(fixture.spotTypes ?? [], 25)},
            updated_at = now()
          where slug = ${fixture.slug}
        `;
      }
      const [incomplete] = await transaction`
        select count(*)::integer as count from spots where status = 'published'
        and (difficulty is null or access is null or runup is null or landing is null)
      `;
      if (incomplete.count > 0) {
        throw new Error(
          "Published non-demo spots need all four ratings; upgrade rolled back",
        );
      }
      for (const key of ["difficulty", "access", "runup", "landing"] as const) {
        const name = `spots_${key}_range`;
        const existing = await transaction`
          select 1 from pg_constraint where conrelid = 'public.spots'::regclass and conname = ${name}
        `;
        if (!existing.length) {
          await transaction`alter table spots add constraint ${transaction(name)} check (${transaction(key)} between 1 and 5)`;
        }
      }
      const publishedConstraint = await transaction`
        select 1 from pg_constraint where conrelid = 'public.spots'::regclass and conname = 'spots_published_ratings'
      `;
      if (!publishedConstraint.length) {
        await transaction`
          alter table spots add constraint spots_published_ratings check (
            status <> 'published' or (
              difficulty is not null and access is not null
              and runup is not null and landing is not null
            )
          )
        `;
      }
      await transaction`drop type if exists public.spot_difficulty`;
    });
    console.log(
      "Ratings upgraded. Existing IDs and image relationships preserved.",
    );
  } finally {
    await client.end();
  }
}

main().catch((error: unknown) => {
  // Avoid logging driver messages that may contain credentials or row contents.
  const message =
    error instanceof postgres.PostgresError
      ? `Database error ${error.code}; the transaction was rolled back.`
      : error instanceof Error
        ? error.message
        : "Unknown upgrade error";
  console.error(message);
  process.exitCode = 1;
});
