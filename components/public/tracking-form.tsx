"use client";

import { FormEvent, useEffect, useState } from "react";
import { Search, Ticket } from "lucide-react";
import { api } from "@/lib/client-api";
import { getStoredTickets, removeStoredTicket, type StoredTicket } from "@/lib/client-tickets";
import type { TrackResult } from "@/types/api";
import { TrackingResult } from "./tracking-result";
import { RecentTicketsList } from "./recent-tickets-list";

export function TrackingForm({ initialTicket = "" }: { initialTicket?: string }) {
  const [ticket, setTicket] = useState(initialTicket);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentTickets, setRecentTickets] = useState<StoredTicket[]>([]);

  useEffect(() => {
    setRecentTickets(getStoredTickets());
  }, []);

  async function performTrack(codeToTrack: string) {
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const code = codeToTrack.trim().toUpperCase();
      setTicket(code);
      const res = await api<TrackResult>(`/api/public/complaints/track/${encodeURIComponent(code)}`);
      setResult(res);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Tiket tidak ditemukan. Mohon periksa kembali kode tiket Anda.");
    } finally {
      setLoading(false);
    }
  }

  function handleFormSubmit(event: FormEvent) {
    event.preventDefault();
    if (ticket.trim()) {
      void performTrack(ticket);
    }
  }

  const handleRemoveRecent = (code: string, e: React.MouseEvent) => {
    const updated = removeStoredTicket(code);
    setRecentTickets(updated);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleFormSubmit} className="surface relative p-6 sm:p-8 border border-stone-200/90 shadow-xl bg-white">
        <div className="flex items-center gap-2 mb-4">
          <Ticket size={20} className="text-[#1f4f8f]" />
          <label className="label mb-0 text-stone-800 text-base" htmlFor="ticket">
            Kode Tiket Aduan
          </label>
        </div>

        <p className="text-xs text-stone-500 mb-4">
          Format kode: <code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-stone-700">HB-YYYYMMDD-XXXXXX</code>
        </p>

        <p className="text-xs text-stone-500 mb-4">
          Pastikan Anda menyimpan kode tiket untuk memantau proses tindak lanjut.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="ticket"
            className="field flex-1 font-mono uppercase tracking-wider text-base placeholder:text-stone-400 placeholder:normal-case placeholder:tracking-normal text-stone-900"
            value={ticket}
            onChange={(event) => setTicket(event.target.value)}
            placeholder="Contoh: HB-20260723-ABC123"
            required
          />
          <button className="btn-primary shadow-md shrink-0 px-6 cursor-pointer" disabled={loading}>
            <Search size={18} /> {loading ? "Mencari..." : "Lacak Tiket"}
          </button>
        </div>

        {error && <p className="error-box mt-4">{error}</p>}
      </form>

      {!result && (
        <RecentTicketsList
          tickets={recentTickets}
          onSelect={(code) => void performTrack(code)}
          onRemove={handleRemoveRecent}
        />
      )}

      {result && <TrackingResult data={result} />}
    </div>
  );
}
