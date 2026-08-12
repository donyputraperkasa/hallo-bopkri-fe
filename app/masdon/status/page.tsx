import { AdminShell } from "@/components/admin/admin-shell";
import { StatusManager } from "@/components/admin/status-manager";

export default function StatusPage() {
  return (
    <AdminShell>
      <StatusManager />
    </AdminShell>
  );
}
