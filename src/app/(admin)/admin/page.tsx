import type { Metadata } from "next";
import { SpotAdminForm } from "@/components/admin/spot-admin-form";
import { Map } from "@/components/map/map";

export const metadata: Metadata = {
  title: "Spots Admin",
  description: "Admin form for creating and publishing spots",
};

export default function AdminPage() {
  return (
    <div className="grid grid-cols-2 min-h-screen">
      <SpotAdminForm />
      <Map />
    </div>
  );
}
