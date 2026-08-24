import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { ManagerComplaintList } from "@/components/admin/manager-complaint-list";

export const metadata: Metadata = { title: "Aduan Bidang – Manajer" };

export default function ManagerAduanPage() {
  return (
    <AdminShell role="MANAGER">
      <ManagerComplaintList />
    </AdminShell>
  );
}
