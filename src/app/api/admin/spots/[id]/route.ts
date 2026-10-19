import { requireAdmin } from "@/server/auth/require-admin";
import { spotIdSchema } from "@/features/spots/spot.schemas";
import { getAdminSpotById } from "@/features/spots/server/spot.service";
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
