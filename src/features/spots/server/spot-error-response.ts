import "server-only";

import { DrizzleQueryError } from "drizzle-orm";
import postgres from "postgres";

export function spotErrorResponse(error: unknown): Response {
  const databaseError =
    error instanceof DrizzleQueryError ? error.cause : error;

  if (databaseError instanceof postgres.PostgresError) {
    const { code, constraint_name: constraint } = databaseError;

    if (code === "23505" && constraint === "spots_slug_unique") {
      return Response.json(
        {
          error: {
            code: "CONFLICT",
            message: "Slug is already in use",
          },
        },
        { status: 409 },
      );
    }

    if (code === "23514" && constraint === "spots_published_ratings") {
      return Response.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Published spots require all four ratings",
          },
        },
        { status: 400 },
      );
    }
  }

  return Response.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected server error occurred",
      },
    },
    { status: 500 },
  );
}
