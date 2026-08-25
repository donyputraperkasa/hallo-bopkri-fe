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
    <form onSubmit={update} className="rounded-lg border border-[#dbe5f4] bg-white p-5 shadow-sm space-y-4">
      <h2 className="text-base font-semibold text-[#0f172a]">Perbarui Status</h2>
      <label className="block">
        <span className="block text-xs font-semibold uppercase tracking-wider text-[#748299] mb-1.5">
          Status baru
        </span>
        <select
          className="h-10 w-full rounded-md border border-[#dbe5f4] bg-[#f8fbff] px-3 text-sm font-semibold text-[#172033] outline-none"
          value={statusId}
          onChange={(e) => setStatusId(e.target.value)}
        >
          {statuses.filter((item) => item.isActive !== false).map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="block text-xs font-semibold uppercase tracking-wider text-[#748299] mb-1.5">
          Catatan untuk pelapor
        </span>
        <textarea
          className="w-full min-h-24 rounded-md border border-[#dbe5f4] bg-[#f8fbff] p-3 text-xs text-[#172033] outline-none placeholder:text-[#8b98ad] focus:border-[#0f2a4f] focus:bg-white"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Opsional, tampil pada halaman lacak..."
        />
      </label>
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
          {error}
        </div>
      )}
      <button
        className="inline-flex h-10 w-full items-center justify-center rounded-md bg-[#0f2a4f] px-4 text-xs font-semibold text-white transition hover:bg-[#173b6b] disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}
