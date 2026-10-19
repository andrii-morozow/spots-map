import { requireAdmin } from "@/server/auth/require-admin";
import { listAdminSpots } from "@/features/spots/server/spot.service";
import { spotErrorResponse } from "@/features/spots/server/spot-error-response";

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
