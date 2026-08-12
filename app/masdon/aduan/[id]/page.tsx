import { AdminShell } from "@/components/admin/admin-shell";
import { ComplaintDetail } from "@/components/admin/complaint-detail";

export default async function ComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <AdminShell>
      <ComplaintDetail id={id} />
    </AdminShell>
  );
}
