import { AdminShell, ComplaintDetail } from "@/components/admin";

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
