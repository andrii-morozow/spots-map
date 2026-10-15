import "server-only";

import { auth } from "@clerk/nextjs/server";

type AdminResult =
  | {
      ok: true;
      actor: { userId: string };
    }
  | {
      ok: false;
      status: 401 | 403;
      error: {
        code: "UNAUTHORIZED" | "FORBIDDEN";
        message: string;
      };
    };

export async function requireAdmin(): Promise<AdminResult> {
  const { userId } = await auth();

  if (!userId) {
    return {
      ok: false,
      status: 401,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required",
      },
    };
  }

  const adminUserId = process.env.ADMIN_USER_ID;

  if (!adminUserId || userId !== adminUserId) {
    return {
      ok: false,
      status: 403,
      error: {
        code: "FORBIDDEN",
        message: "Admin access required",
      },
    };
  }

  return {
    ok: true,
    actor: { userId },
  };
}
