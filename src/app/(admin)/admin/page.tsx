import type { Metadata } from "next";
import { SpotForm } from "@/components/admin/spot-form/spot-form";
import { Map } from "@/components/map/map";

export const metadata: Metadata = {
  title: "Spots Admin",
  description: "Admin form for creating and publishing spots",
};

export default function AdminPage() {
  return (
    <div className="grid h-dvh min-h-0 grid-cols-[minmax(0,40fr)_minmax(0,60fr)] overflow-hidden">
      <SpotForm />
      <Map />
    </div>
  );
}
