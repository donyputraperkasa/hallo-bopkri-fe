"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Briefcase, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/lib/client-api";
import { getTagStyle, BIDANG_TAGS } from "@/lib/constants";
import type { Complaint, ComplaintList as ListData, ComplaintStatus } from "@/types/api";
import { ComplaintFilters } from "./complaint-filters";
import { ComplaintTable } from "./complaint-table";
import { ComplaintDetailModal } from "./complaint-detail-modal";

function extractTags(item: Complaint): string[] {
  if (typeof item.tags === "string" && item.tags.trim()) {
    return item.tags.split(",").map((t) => t.trim()).filter(Boolean);
  }
  if (Array.isArray(item.tags) && item.tags.length > 0) return item.tags;
  return [];
}

export function DirectorComplaintList() {
  const [data, setData] = useState<ListData | null>(null);
  const [statuses, setStatuses] = useState<ComplaintStatus[]>([]);
  const [query, setQuery] = useState(new URLSearchParams("page=1&limit=10"));
  const [error, setError] = useState("");
  const [detailItem, setDetailItem] = useState<Complaint | null>(null);
  const [activeBidang, setActiveBidang] = useState("all");

  const load = useCallback(async () => {
    setData(null);
    try {
      const [complaints, statusData] = await Promise.all([
        api<ListData>(`/api/admin/complaints?${query}`),
        api<ComplaintStatus[]>("/api/admin/complaint-statuses"),
      ]);
      setData(complaints);
      setStatuses(statusData);
    } catch (r) {
      setError(r instanceof Error ? r.message : "Gagal memuat data.");
    }
  }, [query]);

  useEffect(() => { void load(); }, [load]);

  const handlePage = (p: number) => {
    const next = new URLSearchParams(query);
    next.set("page", String(p));
    setQuery(next);
  };

  const filtered = useMemo(() => {
    if (!data?.data) return [];
    if (activeBidang === "all") return data.data;
    return data.data.filter((item) => {
      const tags = extractTags(item);
      return tags.some((t) => t.toLowerCase() === activeBidang.toLowerCase());
    });
  }, [data, activeBidang]);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-stone-200/90 bg-gradient-to-r from-[#0f1c4d] via-[#1e2d6b] to-[#2d4ba0] p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -top-20 -right-16 size-72 rounded-full border-32 border-white/5" />
        <div className="inline-flex items-center gap-2 rounded-full border border-[#d4b84a]/40 bg-[#d4b84a]/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#f0d878]">
          <Briefcase size={14} /> Director View — Semua Aduan
        </div>
        <h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight">Daftar Seluruh Aduan</h1>
        <p className="mt-2 text-sm text-blue-100/90">Anda dapat melihat semua aduan yang masuk. Tidak perlu disposisi dari owner.</p>
      </div>

      {/* Bidang Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(([{ value: "all", label: "Semua" }, ...BIDANG_TAGS] as { value: string; label: string }[]).map((b) => (
          <button
            key={b.value}
            onClick={() => setActiveBidang(b.value)}
            className={`rounded-full border px-3 py-1 text-xs font-bold transition ${
              activeBidang === b.value
                ? "border-[#1a5fa8] bg-[#1a5fa8] text-white"
                : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
            }`}
          >
            {b.label}
          </button>
        )))}
      </div>

      <ComplaintFilters statuses={statuses} query={query} setQuery={setQuery} />
      {error && <p className="error-box">{error}</p>}

      <section className="surface border border-stone-200/90 shadow-md overflow-hidden">
        <div className="border-b border-stone-200 bg-stone-50/80 px-6 py-4 flex items-center justify-between">
          <h2 className="font-bold text-stone-800">Aduan ({filtered.length})</h2>
          {activeBidang !== "all" && (
            <span className={`rounded-md border px-2.5 py-0.5 text-xs font-bold ${getTagStyle(activeBidang)}`}>
              {BIDANG_TAGS.find((b) => b.value === activeBidang)?.label}
            </span>
          )}
        </div>

        <ComplaintTable
          data={filtered}
          loading={!data}
          overrides={{}}
          onOpenDetail={(item) => setDetailItem(item)}
          onOpenDispatch={() => {}} // Director tidak bisa dispatch
          readOnly
        />

        {data && (
          <footer className="flex items-center justify-between border-t border-stone-200 bg-stone-50/50 p-4">
            <p className="text-xs text-stone-500">
              Menampilkan <strong>{filtered.length}</strong> dari <strong>{data.meta.total}</strong> aduan
            </p>
            <div className="flex items-center gap-2">
              <button className="btn-secondary p-2" disabled={data.meta.page <= 1} onClick={() => handlePage(data.meta.page - 1)}><ChevronLeft size={16} /></button>
              <span className="text-xs font-bold text-stone-700">{data.meta.page} / {data.meta.totalPages || 1}</span>
              <button className="btn-secondary p-2" disabled={data.meta.page >= data.meta.totalPages} onClick={() => handlePage(data.meta.page + 1)}><ChevronRight size={16} /></button>
            </div>
          </footer>
        )}
      </section>

      <ComplaintDetailModal
        item={detailItem}
        statuses={statuses}
        onClose={() => setDetailItem(null)}
        onOpenDispatch={() => {}}
        onStatusUpdated={load}
        readOnly
      />
    </div>
  );
}
