"use client";

import { useState } from "react";
import { ArrowRight, Check, Copy, History, Trash2 } from "lucide-react";
import { categoryLabel, formatDate } from "@/lib/constants";
import type { StoredTicket } from "@/lib/client-tickets";

interface RecentTicketsListProps {
  tickets: StoredTicket[];
  onSelect: (ticketCode: string) => void;
  onRemove: (ticketCode: string, e: React.MouseEvent) => void;
}

export function RecentTicketsList({ tickets, onSelect, onRemove }: RecentTicketsListProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (code: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {}
  };

  if (tickets.length === 0) return null;

  return (
    <div className="rounded-2xl border border-stone-200 bg-[#fbfcfd] p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between gap-2 border-b border-stone-200/70 pb-2.5">
        <div className="flex items-center gap-2 text-stone-800 font-bold text-xs uppercase tracking-wider">
          <History size={15} className="text-[#1f4f8f]" />
          <span>Tiket Sesi Ini (Sebelum Tab Ditutup)</span>
        </div>
        <span className="text-[10px] text-stone-400 font-medium">Privasi Terjaga</span>
      </div>

      <div className="space-y-2">
        {tickets.map((item, idx) => (
          <div
            key={item.ticketCode}
            onClick={() => onSelect(item.ticketCode)}
            className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-stone-200 bg-white p-3 transition-all hover:border-[#1f4f8f] hover:shadow-xs cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-sm font-black text-[#1f4f8f]">
                {item.ticketCode}
              </span>
              <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#1f4f8f]">
                {categoryLabel(item.category)}
              </span>
              <span className="text-[11px] text-stone-400">
                {formatDate(item.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={(e) => handleCopy(item.ticketCode, idx, e)}
                className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-stone-50 px-2 py-1 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition shadow-2xs"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check size={12} className="text-emerald-600" />
                    <span className="text-emerald-600 font-bold text-[11px]">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span className="text-[11px]">Salin</span>
                  </>
                )}
              </button>

              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1f4f8f] group-hover:translate-x-0.5 transition-transform pl-1">
                <span>Lacak</span>
                <ArrowRight size={12} />
              </span>

              <button
                type="button"
                onClick={(e) => onRemove(item.ticketCode, e)}
                title="Hapus riwayat tiket"
                className="p-1 text-stone-300 hover:text-rose-600 transition"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
