"use client";

import { FormEvent, useState } from "react";
import { Search, Ticket } from "lucide-react";
import { api } from "@/lib/client-api";
import type { TrackResult } from "@/types/api";
import { TrackingResult } from "./tracking-result";

export function TrackingForm({ initialTicket = "" }: { initialTicket?: string }) {
  const [ticket, setTicket] = useState(initialTicket);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function track(event: FormEvent) {
    event.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const code = ticket.trim().toUpperCase();
      setResult(await api<TrackResult>(`/api/public/complaints/track/${encodeURIComponent(code)}`));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Tiket tidak ditemukan. Mohon periksa kembali kode tiket Anda.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={track} className="surface relative p-6 sm:p-8 border border-stone-200/90 shadow-xl">
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
          Pastikan anda menyimpan kode dan jangan sampai hilang/lupa
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
          <button className="btn-primary shadow-md shrink-0 px-6" disabled={loading}>
            <Search size={18} /> {loading ? "Mencari..." : "Lacak Tiket"}
          </button>
        </div>

        {error && <p className="error-box mt-4">{error}</p>}
      </form>

      {result && <TrackingResult data={result} />}
    </>
  );
}
