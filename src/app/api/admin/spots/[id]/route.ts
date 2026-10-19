import { requireAdmin } from "@/server/auth/require-admin";
import { spotIdSchema, spotUpdateSchema } from "@/features/spots/spot.schemas";
import {
  getAdminSpotById,
  updateSpot,
} from "@/features/spots/server/spot.service";
import { spotErrorResponse } from "@/features/spots/server/spot-error-response";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { params } = context;

  try {
    const access = await requireAdmin();

    if (!access.ok) {
      return Response.json({ error: access.error }, { status: access.status });
    }

    const { id } = await params;
    const result = spotIdSchema.safeParse(id);

    if (!result.success) {
      return Response.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid spot ID",
            details: [
              {
                field: "id",
                message: "Must be a valid UUID",
              },
            ],
          },
        },
        { status: 400 },
      );
    }

    const spot = await getAdminSpotById(result.data);

    if (!spot) {
      return Response.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Spot not found",
          },
        },
        { status: 404 },
      );
    }

    return Response.json({ data: spot });
  } catch (error: unknown) {
    return spotErrorResponse(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const { params } = context;

  try {
    const access = await requireAdmin();

    if (!access.ok) {
      return Response.json({ error: access.error }, { status: access.status });
    }

    const { id } = await params;

    const idResult = spotIdSchema.safeParse(id);

    if (!idResult.success) {
      return Response.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid spot ID",
            details: [
              {
                field: "id",
                message: "Must be a valid UUID",
              },
            ],
          },
        },
        { status: 400 },
      );
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

    const bodyResult = spotUpdateSchema.safeParse(body);

    if (!bodyResult.success) {
      return Response.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid spot data",
            details: bodyResult.error.issues.map((issue) => ({
              field: issue.path.join(".") || "_root",
              message: issue.message,
            })),
          },
        },
        { status: 400 },
      );
    }

    const updatedSpot = await updateSpot(idResult.data, bodyResult.data);

    if (!updatedSpot) {
      return Response.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Spot not found",
          },
        },
        { status: 404 },
      );
    }

    return Response.json({ data: updatedSpot });
  } catch (error: unknown) {
    return spotErrorResponse(error);
  }
}
