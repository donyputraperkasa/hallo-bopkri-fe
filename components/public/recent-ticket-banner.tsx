"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Search, Sparkles, X } from "lucide-react";
import { getSessionTicket, clearSessionTicket } from "@/lib/client-tickets";
import type { StoredTicket } from "@/types";

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
    <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-[#d8e3f4] bg-white p-4 shadow-xs animate-in fade-in slide-in-from-top-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#eef3fb] text-[#1f4f8f] border border-[#d8e3f4]">
            <Sparkles size={16} />
          </span>
          <div>
            <p className="text-xs font-semibold text-[#526078]">
              Tiket Baru Saja Dikirim:
            </p>
            <code className="font-mono text-sm font-semibold tracking-wide text-[#1f4f8f]">
              {latestTicket.ticketCode}
            </code>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-md border border-[#d8e3f4] bg-[#f8fbff] px-3 py-1.5 text-xs font-semibold text-[#172033] hover:bg-white transition cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copied ? "Tersalin!" : "Salin Kode"}</span>
          </button>

          <button
            type="button"
            onClick={() => onTrack(latestTicket.ticketCode)}
            className="inline-flex items-center gap-1 rounded-md bg-[#1f4f8f] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#193f72] transition shadow-xs cursor-pointer"
          >
            <Search size={14} />
            <span>Lacak</span>
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="p-1.5 text-[#8c9bb0] hover:text-[#172033] transition cursor-pointer"
            title="Tutup"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
