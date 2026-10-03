import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SpotForm } from "@/components/admin/spot-form/spot-form";
import { Map } from "@/components/map/map";
import { AccountButton } from "@/components/auth/account-button";

export const metadata: Metadata = {
  title: "Spots Admin",
  description: "Admin form for creating and publishing spots",
};

export default async function AdminPage() {
  const session = await auth();
  const adminUserId = process.env.ADMIN_USER_ID;

  if (!session.isAuthenticated || session.userId !== adminUserId) {
    console.warn("[admin-access] Access check failed", {
      reason: session.isAuthenticated ? "admin-id-mismatch" : "unauthenticated",
      sessionStatus: session.sessionStatus,
      adminIdConfigured: Boolean(adminUserId),
      adminIdHasWhitespace: Boolean(
        adminUserId && adminUserId !== adminUserId.trim(),
      ),
      matchesAfterTrimming: Boolean(
        session.userId && adminUserId && session.userId === adminUserId.trim(),
      ),
    });
  }

  const { userId } = await auth.protect();

  // TODO implement admin restriction page. 503
  if (userId !== adminUserId) {
    notFound();
  }

  return (
    <div className="grid h-dvh min-h-0 grid-cols-[minmax(0,40fr)_minmax(0,60fr)] overflow-hidden">
      <SpotForm />
      <Map />
      <div className="absolute left-4 top-4 z-50">
        <AccountButton />
      </div>
    </div>
  );
}
