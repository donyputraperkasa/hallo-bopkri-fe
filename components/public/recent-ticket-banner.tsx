"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Search, Sparkles, X } from "lucide-react";
import { getSessionTicket, clearSessionTicket, type StoredTicket } from "@/lib/client-tickets";

export function RecentTicketBanner({ onTrack }: { onTrack: (ticketCode: string) => void }) {
  const [latestTicket, setLatestTicket] = useState<StoredTicket | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const current = getSessionTicket();
    setLatestTicket(current);

    if (current?.expiresAt) {
      const remainingMs = current.expiresAt - Date.now();
      if (remainingMs > 0) {
        const timer = setTimeout(() => {
          clearSessionTicket();
          setLatestTicket(null);
        }, remainingMs);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleCopy = async () => {
    if (!latestTicket) return;
    try {
      await navigator.clipboard.writeText(latestTicket.ticketCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleDismiss = () => {
    clearSessionTicket();
    setLatestTicket(null);
  };

  if (!latestTicket) return null;

  return (
    <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/90 via-white to-blue-50/90 p-4 shadow-sm animate-in fade-in slide-in-from-top-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-[#1f4f8f] text-white shadow-xs">
            <Sparkles size={16} />
          </span>
          <div>
            <p className="text-xs font-bold text-stone-900">
              Tiket Baru Saja Dikirim:
            </p>
            <code className="font-mono text-sm font-black tracking-wide text-[#1f4f8f]">
              {latestTicket.ticketCode}
            </code>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-2xs cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copied ? "Tersalin!" : "Salin Kode"}</span>
          </button>

          <button
            type="button"
            onClick={() => onTrack(latestTicket.ticketCode)}
            className="inline-flex items-center gap-1 rounded-lg bg-[#1f4f8f] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#173b6b] shadow-2xs cursor-pointer"
          >
            <Search size={14} />
            <span>Lacak</span>
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="p-1.5 text-stone-400 hover:text-stone-700 transition cursor-pointer"
            title="Tutup (Hapus sekarang)"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
