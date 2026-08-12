"use client";

import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
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
      setError(reason instanceof Error ? reason.message : "Tiket tidak ditemukan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={track} className="surface p-6 sm:p-8">
        <label className="label" htmlFor="ticket">Kode tiket aduan</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="ticket"
            className="field flex-1 font-mono uppercase"
            value={ticket}
            onChange={(event) => setTicket(event.target.value)}
            placeholder="Contoh: HB-20260723-ABC123"
            required
          />
          <button className="btn-primary" disabled={loading}>
            <Search size={18} /> {loading ? "Mencari..." : "Lacak tiket"}
          </button>
        </div>
        {error && <p className="error-box mt-4">{error}</p>}
      </form>
      {result && <TrackingResult data={result} />}
    </>
  );
}
