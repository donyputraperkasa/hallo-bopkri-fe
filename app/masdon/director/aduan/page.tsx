import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { DirectorComplaintList } from "@/components/admin/director-complaint-list";

export const metadata: Metadata = { title: "Semua Aduan – Director" };

export default function DirectorAduanPage() {
  return (
    <AdminShell role="DIRECTOR">
      <DirectorComplaintList />
    </AdminShell>
  );
}
