"use client";

import { useEffect, useState } from "react";
import { Briefcase, Check, LoaderCircle, SendHorizontal, Users, X } from "lucide-react";
import { api, readResponse } from "@/lib/client-api";
import { useToast } from "@/components/ui/toast-provider";
import type { Complaint } from "@/types/api";

interface AdminUser {
  id: string;
  username: string;
  role: "OWNER" | "DIRECTOR" | "MANAGER";
  bidang: string | null;
  displayName: string | null;
}

export function ComplaintDispatchModal({
  item,
  onClose,
  onDispatch,
}: {
  item: Complaint | null;
  onClose: () => void;
  onDispatch: (complaintId: string, adminId: string, bidang: string | null, note?: string) => void;
}) {
  const { show } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedId, setSelectedId] = useState<string>("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!item) return;
    setLoadingUsers(true);
    api<AdminUser[]>("/api/admin/complaints/users")
      .then((data) => {
        setUsers(data);
        if (data.length > 0) setSelectedId(data[0].id);
      })
      .catch(() => show("Gagal memuat daftar pengguna.", "error"))
      .finally(() => setLoadingUsers(false));
  }, [item]);

  if (!item) return null;

  const selected = users.find((u) => u.id === selectedId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;
    setLoading(true);
    try {
      await readResponse(
        await fetch(`/api/admin/complaints/${item.id}/dispatch`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ adminId: selectedId, note: note.trim() || undefined }),
        })
      );
      onDispatch(item.id, selectedId, selected?.bidang ?? null, note.trim() || undefined);
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Disposisi gagal.";
      show(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const directors = users.filter((u) => u.role === "DIRECTOR");
  const managers = users.filter((u) => u.role === "MANAGER");

  return (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 grid place-items-center bg-[#071529]/55 p-4 backdrop-blur-sm modal-backdrop-enter overflow-y-auto"
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-xl border border-[#dbe5f4] bg-white p-6 shadow-2xl modal-panel-enter"
      >
        <div className="flex items-center justify-between border-b border-[#dbe5f4] pb-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-lg bg-amber-100 text-amber-800">
              <SendHorizontal size={18} />
            </span>
            <div>
              <h3 className="font-semibold text-[#0f172a] text-base">Disposisi Aduan</h3>
              <p className="text-xs text-[#748299] font-mono">Tiket: {item.ticketCode}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-[#748299] hover:bg-[#eef4fb] hover:text-[#0f2a4f] transition"
          >
            <X size={18} />
          </button>
        </div>

        {loadingUsers ? (
          <div className="flex justify-center py-8">
            <LoaderCircle className="size-8 animate-spin text-[#0f2a4f]" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#748299]">
                Pilih Penerima Disposisi
              </label>

              {directors.length > 0 && (
                <div className="mt-2">
                  <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#748299] mb-1.5">
                    <Briefcase size={11} /> Direktur
                  </p>
                  <div className="space-y-1.5">
                    {directors.map((u) => {
                      const isSelected = selectedId === u.id;
                      return (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => setSelectedId(u.id)}
                          className={`flex w-full items-center justify-between rounded-lg border p-2.5 text-left text-xs font-semibold transition ${
                            isSelected
                              ? "border-[#0f2a4f] bg-[#eef4fb] text-[#0f2a4f] ring-1 ring-[#0f2a4f]"
                              : "border-[#dbe5f4] bg-[#f8fbff] text-[#172033] hover:border-[#b6cce8] hover:bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Briefcase size={15} className={isSelected ? "text-[#0f2a4f]" : "text-[#748299]"} />
                            <span>{u.displayName ?? u.username}</span>
                          </div>
                          {isSelected && <Check size={14} className="text-[#0f2a4f]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {managers.length > 0 && (
                <div className="mt-3">
                  <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#748299] mb-1.5">
                    <Users size={11} /> Manajer Bidang
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {managers.map((u) => {
                      const isSelected = selectedId === u.id;
                      return (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => setSelectedId(u.id)}
                          className={`flex items-center justify-between rounded-lg border p-2.5 text-left text-xs font-semibold transition ${
                            isSelected
                              ? "border-[#0f2a4f] bg-[#eef4fb] text-[#0f2a4f] ring-1 ring-[#0f2a4f]"
                              : "border-[#dbe5f4] bg-[#f8fbff] text-[#172033] hover:border-[#b6cce8] hover:bg-white"
                          }`}
                        >
                          <span className="truncate">{u.displayName ?? u.username}</span>
                          {isSelected && <Check size={13} className="text-[#0f2a4f] shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {users.length === 0 && (
                <p className="mt-3 text-sm text-center text-[#748299]">Belum ada manager atau director yang terdaftar.</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#748299] mb-1">
                Catatan Disposisi <small className="font-normal text-[#8b98ad]">(opsional)</small>
              </label>
              <textarea
                className="w-full min-h-20 rounded-md border border-[#dbe5f4] bg-[#f8fbff] p-3 text-xs text-[#172033] outline-none placeholder:text-[#8b98ad] focus:border-[#0f2a4f] focus:bg-white"
                placeholder="Misal: Mohon ditindaklanjuti dan dilaporkan kembali..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {selected && (
              <div className="rounded-md border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-800 leading-relaxed">
                Aduan ini akan dikirimkan ke <strong>{selected.displayName ?? selected.username}</strong>
                {selected.bidang && ` (Bidang ${selected.bidang})`} sehingga dapat langsung ditindaklanjuti.
              </div>
            )}

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
                disabled={loading || !selectedId}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-[#0f2a4f] px-5 text-xs font-semibold text-white transition hover:bg-[#173b6b] disabled:opacity-50"
              >
                <SendHorizontal size={14} />
                <span>{loading ? "Mengirim..." : "Kirim Disposisi"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
