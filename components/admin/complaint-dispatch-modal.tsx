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
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl border border-stone-200 bg-white p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-amber-100 text-amber-800">
              <SendHorizontal size={18} />
            </span>
            <div>
              <h3 className="font-extrabold text-stone-900 text-base">Disposisi Aduan</h3>
              <p className="text-xs text-stone-500 font-mono">Tiket: {item.ticketCode}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition"
          >
            <X size={18} />
          </button>
        </div>

        {loadingUsers ? (
          <div className="flex justify-center py-8">
            <LoaderCircle className="size-8 animate-spin text-[#1f4f8f]" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4.5">
            <div>
              <label className="label text-stone-800 text-xs uppercase tracking-wider">
                Pilih Penerima Disposisi
              </label>

              {directors.length > 0 && (
                <div className="mt-2">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
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
                          className={`flex w-full items-center justify-between rounded-xl border p-2.5 text-left text-xs font-semibold transition ${
                            isSelected
                              ? "border-sky-400 bg-sky-50 text-sky-800 ring-2 ring-sky-200"
                              : "border-stone-200 bg-stone-50/70 text-stone-700 hover:border-stone-300 hover:bg-stone-100"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Briefcase size={15} className={isSelected ? "text-sky-600" : "text-stone-400"} />
                            <span>{u.displayName ?? u.username}</span>
                          </div>
                          {isSelected && <Check size={14} className="text-sky-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {managers.length > 0 && (
                <div className="mt-3">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
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
                          className={`flex items-center justify-between rounded-xl border p-2.5 text-left text-xs font-semibold transition ${
                            isSelected
                              ? "border-[#1f4f8f] bg-[#1f4f8f]/10 text-[#1f4f8f] ring-2 ring-[#1f4f8f]/20"
                              : "border-stone-200 bg-stone-50/70 text-stone-700 hover:border-stone-300 hover:bg-stone-100"
                          }`}
                        >
                          <span className="truncate">{u.displayName ?? u.username}</span>
                          {isSelected && <Check size={13} className="text-[#1f4f8f] shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {users.length === 0 && (
                <p className="mt-3 text-sm text-center text-stone-400">Belum ada manager atau director yang terdaftar.</p>
              )}
            </div>

            <div>
              <label className="label text-stone-800 text-xs uppercase tracking-wider">
                Catatan Disposisi <small className="font-normal text-stone-400">(opsional)</small>
              </label>
              <textarea
                className="field min-h-20 resize-y text-xs sm:text-sm"
                placeholder="Misal: Mohon ditindaklanjuti dan dilaporkan kembali..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {selected && (
              <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 p-3 text-[11px] text-amber-800 leading-relaxed">
                Aduan ini akan dikirimkan ke <strong>{selected.displayName ?? selected.username}</strong>
                {selected.bidang && ` (Bidang ${selected.bidang})`} sehingga dapat langsung ditindaklanjuti.
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100">
              <button type="button" onClick={onClose} className="btn-secondary px-4 py-2 text-xs font-bold">
                Batal
              </button>
              <button
                type="submit"
                disabled={loading || !selectedId}
                className="btn-primary px-5 py-2 text-xs font-bold shadow-md"
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
