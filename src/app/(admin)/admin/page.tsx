import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { SpotForm } from "@/components/admin/spot-form/spot-form";
import { Map } from "@/components/map/map";
import { AccountButton } from "@/components/auth/account-button";
import { AdminAccessMessage } from "@/components/admin/admin-access-message";

export const metadata: Metadata = {
  title: "Spots Admin",
  description: "Admin form for creating and publishing spots",
};

export default async function AdminPage() {
  const adminUserId = process.env.ADMIN_USER_ID;

  const { userId } = await auth.protect();

  if (!adminUserId) {
    return <AdminAccessMessage unavailable />;
  }

  if (userId !== adminUserId) {
    return <AdminAccessMessage />;
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
