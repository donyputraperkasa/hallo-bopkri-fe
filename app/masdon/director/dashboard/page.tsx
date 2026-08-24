import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { DirectorDashboardView } from "@/components/admin/director-dashboard-view";

export const metadata: Metadata = { title: "Dashboard – Director" };

export default function DirectorDashboardPage() {
  return (
    <AdminShell role="DIRECTOR">
      <DirectorDashboardView />
    </AdminShell>
  );
}
