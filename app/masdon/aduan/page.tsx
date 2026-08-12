import { AdminShell } from "@/components/admin/admin-shell";
import { ComplaintList } from "@/components/admin/complaint-list";

export default function ComplaintsPage() {
  return (
    <AdminShell>
      <ComplaintList />
    </AdminShell>
  );
}
