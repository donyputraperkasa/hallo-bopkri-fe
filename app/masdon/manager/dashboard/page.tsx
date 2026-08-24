import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { ManagerDashboardView } from "@/components/admin/manager-dashboard-view";

export const metadata: Metadata = { title: "Dashboard – Manajer" };

export default function ManagerDashboardPage() {
  return (
    <AdminShell role="MANAGER">
      <ManagerDashboardView />
    </AdminShell>
  );
}
