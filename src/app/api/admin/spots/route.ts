import { requireAdmin } from "@/server/auth/require-admin";
import {
  createSpot,
  listAdminSpots,
} from "@/features/spots/server/spot.service";
import { spotErrorResponse } from "@/features/spots/server/spot-error-response";
import { spotCreateSchema } from "@/features/spots/spot.schemas";

export async function GET() {
  try {
    const access = await requireAdmin();

    if (!access.ok) {
      return Response.json({ error: access.error }, { status: access.status });
    }

    const spots = await listAdminSpots();

    return Response.json({ data: spots });
  } catch (error: unknown) {
    return spotErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const access = await requireAdmin();

    if (!access.ok) {
      return Response.json({ error: access.error }, { status: access.status });
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return Response.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid JSON body",
          },
        },
        { status: 400 },
      );
    }

    const result = spotCreateSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid spot data",
            details: result.error.issues.map((issue) => ({
              field: issue.path.join(".") || "_root",
              message: issue.message,
            })),
          },
        },
        { status: 400 },
      );
    }

    const spot = await createSpot(result.data, access.actor.userId);

    return Response.json({ data: spot }, { status: 201 });
  } catch (error: unknown) {
    return spotErrorResponse(error);
  }
}
