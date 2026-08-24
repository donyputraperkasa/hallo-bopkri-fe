"use client";

import { useState } from "react";
import { Check, SendHorizontal, X } from "lucide-react";
import { BIDANG_TAGS } from "@/lib/constants";
import type { Complaint } from "@/types/api";

export function ComplaintDispatchModal({
  item,
  initialBidang = "pendidikan",
  onClose,
  onDispatch,
}: {
  item: Complaint | null;
  initialBidang?: string;
  onClose: () => void;
  onDispatch: (complaintId: string, bidangValue: string, note?: string) => void;
}) {
  const [selectedBidang, setSelectedBidang] = useState<string>(initialBidang);
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      onDispatch(item.id, selectedBidang, note);
    } finally {
      setLoading(false);
    }
  };

  const targetInfo = BIDANG_TAGS.find((b) => b.value === selectedBidang);

  return (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
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
              <h3 className="font-extrabold text-stone-900 text-base">Disposisi ke Bidang Terkait</h3>
              <p className="text-xs text-stone-500 font-mono">Tiket: {item.ticketCode}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition"
            title="Tutup (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4.5">
          <div>
            <label className="label text-stone-800 text-xs uppercase tracking-wider">
              Pilih Bidang Tujuan Disposisi
            </label>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              {BIDANG_TAGS.map((b) => {
                const isSelected = selectedBidang === b.value;
                const ItemIcon = b.icon;
                return (
                  <button
                    key={b.value}
                    type="button"
                    onClick={() => setSelectedBidang(b.value)}
                    className={`flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs font-semibold transition ${
                      isSelected
                        ? "border-[#1f4f8f] bg-[#1f4f8f]/10 text-[#1f4f8f] ring-2 ring-[#1f4f8f]/20"
                        : "border-stone-200 bg-stone-50/70 text-stone-700 hover:border-stone-300 hover:bg-stone-100"
                    }`}
                  >
                    <ItemIcon size={16} className={isSelected ? "text-[#1f4f8f]" : "text-stone-500"} />
                    <span className="flex-1 truncate">{b.label}</span>
                    {isSelected && <Check size={14} className="text-[#1f4f8f] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="label text-stone-800 text-xs uppercase tracking-wider">
              Instruksi / Catatan Disposisi <small className="font-normal text-stone-400">(opsional)</small>
            </label>
            <textarea
              className="field min-h-20 resize-y text-xs sm:text-sm"
              placeholder="Misal: Mohon ditindaklanjuti untuk verifikasi fasilitas dan dilaporkan kembali..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 p-3 text-[11px] text-amber-800 leading-relaxed">
            Aduan ini akan diarahkan ke panel <strong>{targetInfo?.managerTitle}</strong> sehingga manajer bidang terkait dapat langsung menindaklanjutinya.
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary px-4 py-2 text-xs font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-5 py-2 text-xs font-bold shadow-md"
            >
              <SendHorizontal size={14} />
              <span>{loading ? "Mengirim..." : "Kirim Disposisi"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
