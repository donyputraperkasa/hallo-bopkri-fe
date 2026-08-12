"use client";

import { FormEvent, useState } from "react";
import { api } from "@/lib/client-api";
import type { ComplaintStatus } from "@/types/api";
import { useToast } from "@/components/ui/toast-provider";

export function StatusUpdateForm({
  complaintId,
  currentId,
  statuses,
  onUpdated,
}: {
  complaintId: string;
  currentId: string;
  statuses: ComplaintStatus[];
  onUpdated: () => void;
}) {
  const { show } = useToast();
  const [statusId, setStatusId] = useState(currentId);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function update(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api(`/api/admin/complaints/${complaintId}/status`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ statusId, publicNote: note || undefined }),
      });
      setNote("");
      show("Status aduan berhasil diperbarui.");
      onUpdated();
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Status gagal diperbarui.";
      setError(message);
      show(message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={update} className="surface p-5">
      <h2 className="text-lg font-extrabold">Perbarui status</h2>
      <label className="mt-5 block">
        <span className="label">Status baru</span>
        <select className="field" value={statusId} onChange={(e) => setStatusId(e.target.value)}>
          {statuses.filter((item) => item.isActive !== false).map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
      </label>
      <label className="mt-4 block">
        <span className="label">Catatan untuk pelapor</span>
        <textarea
          className="field min-h-24"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Opsional, tampil pada halaman lacak..."
        />
      </label>
      {error && <p className="error-box mt-4">{error}</p>}
      <button className="btn-primary mt-4 w-full" disabled={loading}>
        {loading ? "Menyimpan..." : "Simpan perubahan"}
      </button>
    </form>
  );
}
