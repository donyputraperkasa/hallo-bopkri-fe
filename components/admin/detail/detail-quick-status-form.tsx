"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/client-api";
import { useToast } from "@/components/ui/toast-provider";
import type { Complaint, ComplaintStatus } from "@/types/api";

interface DetailQuickStatusFormProps {
  complaintId: string;
  currentStatusId: string;
  statuses: ComplaintStatus[];
  onUpdated: (updatedComplaint: Complaint) => void;
}

export function DetailQuickStatusForm({
  complaintId,
  currentStatusId,
  statuses,
  onUpdated,
}: DetailQuickStatusFormProps) {
  const { show } = useToast();
  const [newStatus, setNewStatus] = useState<string>(currentStatusId);
  const [note, setNote] = useState<string>("");
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    setNewStatus(currentStatusId);
  }, [currentStatusId]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await api(`/api/admin/complaints/${complaintId}/status`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          statusId: newStatus,
          publicNote: note.trim() || undefined,
        }),
      });
      show("Status aduan berhasil diperbarui.");
      const updated = await api<Complaint>(`/api/admin/complaints/${complaintId}`);
      setNote("");
      onUpdated(updated);
    } catch (err) {
      show(err instanceof Error ? err.message : "Gagal memperbarui status.", "error");
    } finally {
      setUpdating(false);
    }
  };

  const activeStatuses = statuses.filter((s) => s.isActive !== false);

  return (
    <form
      onSubmit={handleUpdateStatus}
      className="rounded-lg border border-[#dbe5f4] bg-[#f8fbff] p-4 space-y-2.5"
    >
      <span className="text-xs font-semibold tracking-wider text-[#0f2a4f] uppercase block">
        Perbarui Status Aduan
      </span>
      <div className="flex flex-col gap-2">
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="h-10 rounded-md border border-[#dbe5f4] bg-white px-3 text-xs font-semibold text-[#172033] outline-none"
        >
          {activeStatuses.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          className="h-10 rounded-md border border-[#dbe5f4] bg-white px-3 text-xs text-[#172033] outline-none placeholder:text-[#8b98ad]"
          placeholder="Catatan publik untuk pelapor (opsional)..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={updating}
          className="inline-flex h-9 items-center justify-center rounded-md bg-[#0f2a4f] px-4 text-xs font-semibold text-white transition hover:bg-[#173b6b] disabled:opacity-50 shadow-xs cursor-pointer"
        >
          {updating ? "Menyimpan..." : "Simpan Status"}
        </button>
      </div>
    </form>
  );
}
