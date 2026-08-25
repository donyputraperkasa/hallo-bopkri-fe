"use client";

import { useEffect, useMemo, useState } from "react";
import { LoaderCircle, SendHorizontal } from "lucide-react";
import { api, readResponse } from "@/lib/client-api";
import { useToast } from "@/components/ui/toast-provider";
import type { Complaint } from "@/types/api";
import type { AdminUser } from "./dispatch-types";
import { extractComplaintTags } from "./dispatch-types";
import { DispatchModalHeader } from "./dispatch-modal-header";
import { DispatchTagBar } from "./dispatch-tag-bar";
import { DispatchRecipientList } from "./dispatch-recipient-list";
import { DispatchNoteInput } from "./dispatch-note-input";
import { DispatchSummaryBox } from "./dispatch-summary-box";

export function ComplaintDispatchModal({
  item,
  onClose,
  onDispatch,
}: {
  item: Complaint | null;
  onClose: () => void;
  onDispatch: (complaintId: string, adminIds: string[], bidangs: string[], note?: string) => void;
}) {
  const { show } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const complaintTags = useMemo(() => (item ? extractComplaintTags(item) : []), [item]);

  useEffect(() => {
    if (!item) return;
    setLoadingUsers(true);
    api<AdminUser[]>("/api/admin/complaints/users")
      .then((data) => {
        setUsers(data);
        const tags = extractComplaintTags(item);
        if (tags.length > 0) {
          const matchingIds = data
            .filter((u) => u.bidang && tags.includes(u.bidang.toLowerCase()))
            .map((u) => u.id);
          if (matchingIds.length > 0) {
            setSelectedIds(matchingIds);
            return;
          }
        }
        if (data.length > 0) setSelectedIds([data[0].id]);
      })
      .catch(() => show("Gagal memuat daftar pengguna.", "error"))
      .finally(() => setLoadingUsers(false));
  }, [item, show]);

  if (!item) return null;

  const toggleSelect = (userId: string) => {
    setSelectedIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const directors = users.filter((u) => u.role?.toLowerCase() === "director");
  const managers = users.filter((u) => u.role?.toLowerCase() === "manager");
  const matchingManagerIds = managers
    .filter((u) => u.bidang && complaintTags.includes(u.bidang.toLowerCase()))
    .map((u) => u.id);
  const selectedUsers = users.filter((u) => selectedIds.includes(u.id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) return;
    setLoading(true);
    try {
      await readResponse(
        await fetch(`/api/admin/complaints/${item.id}/dispatch`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            adminIds: selectedIds,
            adminId: selectedIds[0],
            note: note.trim() || undefined,
          }),
        })
      );
      const selectedBidangs = selectedUsers
        .map((u) => u.bidang)
        .filter((b): b is string => Boolean(b && b.trim()));
      
      const successMsg =
        selectedIds.length > 1
          ? `Aduan berhasil dikirimkan ke ${selectedIds.length} penerima.`
          : `Aduan berhasil dikirimkan ke ${selectedUsers[0]?.displayName ?? selectedUsers[0]?.username}.`;
      show(successMsg);
      onDispatch(item.id, selectedIds, selectedBidangs, note.trim() || undefined);
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Gagal mengirimkan aduan.";
      show(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 grid place-items-center bg-[#071529]/55 p-4 backdrop-blur-sm modal-backdrop-enter overflow-y-auto"
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-xl border border-[#dbe5f4] bg-white p-6 shadow-2xl modal-panel-enter my-auto"
      >
        <DispatchModalHeader ticketCode={item.ticketCode} onClose={onClose} />

        {loadingUsers ? (
          <div className="flex justify-center py-8">
            <LoaderCircle className="size-8 animate-spin text-[#0f2a4f]" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <DispatchTagBar
              tags={complaintTags}
              matchingCount={matchingManagerIds.length}
              onSelectMatching={() => setSelectedIds(matchingManagerIds)}
            />

            <DispatchRecipientList
              directors={directors}
              managers={managers}
              selectedIds={selectedIds}
              complaintTags={complaintTags}
              onToggle={toggleSelect}
              onSelectAllManagers={() => setSelectedIds(managers.map((m) => m.id))}
              onClear={() => setSelectedIds([])}
            />

            <DispatchNoteInput note={note} onChange={setNote} />
            <DispatchSummaryBox selectedUsers={selectedUsers} />

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#dbe5f4]">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 items-center justify-center rounded-md border border-[#dbe5f4] bg-white px-4 text-xs font-semibold text-[#0f2a4f] hover:bg-[#eef4fb] transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading || selectedIds.length === 0}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-[#0f2a4f] px-5 text-xs font-semibold text-white transition hover:bg-[#173b6b] disabled:opacity-50 shadow-xs"
              >
                <SendHorizontal size={14} />
                <span>
                  {loading
                    ? "Mengirim..."
                    : selectedIds.length > 1
                    ? `Kirim ke Penerima (${selectedIds.length})`
                    : "Kirim ke Penerima"}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
