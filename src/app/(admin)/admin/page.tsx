import type { Metadata } from "next";
import { SpotAdminForm } from "@/components/admin/spot-admin-form";

export const metadata: Metadata = {
  title: "Spots Admin",
  description: "Admin form for creating and publishing spots",
};

export default function AdminPage() {
  return <SpotAdminForm />;
}
