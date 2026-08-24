"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { api } from "@/lib/client-api";
import { getTagStyle, BIDANG_TAGS } from "@/lib/constants";
import { useAuth } from "@/hooks/use-auth";
import type { Complaint, ComplaintList as ListData, ComplaintStatus } from "@/types/api";
import { ComplaintFilters } from "./complaint-filters";
import { ComplaintTable } from "./complaint-table";
import { ComplaintDetailModal } from "./complaint-detail-modal";

function extractTags(item: Complaint): string[] {
  if (typeof item.tags === "string" && item.tags.trim()) {
    return item.tags.split(",").map((t) => t.trim()).filter(Boolean);
  }
  if (Array.isArray(item.tags) && item.tags.length > 0) return item.tags as string[];
  return [];
}

export function ManagerComplaintList() {
  const { user } = useAuth();
  const [data, setData] = useState<ListData | null>(null);
  const [statuses, setStatuses] = useState<ComplaintStatus[]>([]);
  const [query, setQuery] = useState(new URLSearchParams("page=1&limit=10"));
  const [error, setError] = useState("");
  const [detailItem, setDetailItem] = useState<Complaint | null>(null);

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

  const bidang = user?.bidang ?? "";
  const tagInfo = BIDANG_TAGS.find((b) => b.value.toLowerCase() === bidang.toLowerCase());
  const BidangIcon = tagInfo?.icon;

  // Filter: hanya tampilkan aduan yang tag-nya cocok dengan bidang manager
  const filtered = useMemo(() => {
    if (!data?.data) return [];
    if (!bidang) return data.data; // fallback: tampilkan semua jika bidang tidak diset
    return data.data.filter((item) => {
      const tags = extractTags(item);
      return tags.some((t) => t.toLowerCase() === bidang.toLowerCase());
    });
  }, [data, bidang]);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-stone-200/90 bg-gradient-to-r from-[#1a3a2a] via-[#1e5c3a] to-[#1a6b44] p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -top-20 -right-16 size-72 rounded-full border-32 border-white/5" />
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-400/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-200">
          <Users size={14} /> Aduan Bidang Anda
        </div>
        <h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight">
          {tagInfo?.label ?? bidang ? `Bidang ${tagInfo?.label ?? bidang}` : "Aduan Saya"}
        </h1>
        <p className="mt-2 text-sm text-emerald-100/90">
          Menampilkan aduan yang sudah didisposisikan oleh owner kepada Anda.
        </p>
        {bidang && (
          <span className={`mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold bg-white/10 border-white/20 text-white`}>
            {BidangIcon && <BidangIcon size={12} />}
            {tagInfo?.label ?? bidang}
          </span>
        )}
      </div>

      <ComplaintFilters statuses={statuses} query={query} setQuery={setQuery} />
      {error && <p className="error-box">{error}</p>}

      <section className="surface border border-stone-200/90 shadow-md overflow-hidden">
        <div className="border-b border-stone-200 bg-stone-50/80 px-6 py-4 flex items-center justify-between">
          <h2 className="font-bold text-stone-800">Aduan Bidang ({filtered.length})</h2>
          {bidang && (
            <span className={`rounded-md border px-2.5 py-0.5 text-xs font-bold ${getTagStyle(bidang)}`}>
              {tagInfo?.label ?? bidang}
            </span>
          )}
        </div>

        <ComplaintTable
          data={filtered}
          loading={!data}
          overrides={{}}
          onOpenDetail={(item) => setDetailItem(item)}
          onOpenDispatch={() => {}}
          readOnly
        />

        {data && (
          <footer className="flex items-center justify-between border-t border-stone-200 bg-stone-50/50 p-4">
            <p className="text-xs text-stone-500">
              Menampilkan <strong>{filtered.length}</strong> aduan bidang dari <strong>{data.meta.total}</strong> total diterima
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
