"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, FileText, Landmark } from "lucide-react";
import { api } from "@/lib/client-api";
import { BIDANG_TAGS, getTagStyle } from "@/lib/constants";
import type { Complaint, ComplaintList as ListData, ComplaintStatus } from "@/types/api";
import { useToast } from "@/components/ui/toast-provider";
import { ComplaintFilters } from "./complaint-filters";
import { ComplaintManagerTabs } from "./complaint-manager-tabs";
import { ComplaintStatsCards } from "./complaint-stats-cards";
import { ComplaintTable } from "./complaint-table";
import { ComplaintDetailModal } from "./complaint-detail-modal";
import { ComplaintDispatchModal } from "./complaint-dispatch-modal";

function extractTags(item: Complaint): string[] {
  // Backend now stores tags as a comma-separated string
  if (typeof item.tags === "string" && item.tags.trim()) {
    return item.tags.split(",").map((t: string) => t.trim()).filter(Boolean);
  }
  if (typeof item.tag === "string" && item.tag.trim()) {
    return item.tag.split(",").map((t: string) => t.trim()).filter(Boolean);
  }
  return [];
}

export function ComplaintList() {
  const { show } = useToast();
  const [data, setData] = useState<ListData | null>(null);
  const [statuses, setStatuses] = useState<ComplaintStatus[]>([]);
  const [query, setQuery] = useState(new URLSearchParams("page=1&limit=10"));
  const [error, setError] = useState("");
  const [activeBidang, setActiveBidang] = useState<string>("all");
  const [detailItem, setDetailItem] = useState<Complaint | null>(null);
  const [dispatchItem, setDispatchItem] = useState<Complaint | null>(null);
  const [overrides, setOverrides] = useState<Record<string, string[]>>({});

  const load = useCallback(async () => {
    setData(null);
    try {
      const [complaints, statusData] = await Promise.all([
        api<ListData>(`/api/admin/complaints?${query}`),
        api<ComplaintStatus[]>("/api/admin/complaint-statuses"),
      ]);
      setData(complaints);
      setStatuses(statusData);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Data gagal dimuat.");
    }
  }, [query]);

  useEffect(() => { void load(); }, [load]);

  const handleTabChange = (bidang: string) => {
    setActiveBidang(bidang);
    const next = new URLSearchParams(query);
    if (bidang === "all") next.delete("tag"); else next.set("tag", bidang);
    next.set("page", "1");
    setQuery(next);
  };

  const handlePage = (p: number) => {
    const next = new URLSearchParams(query);
    next.set("page", String(p));
    setQuery(next);
  };

  const filtered = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter((item) => {
      const tags = overrides[item.id] ?? extractTags(item);
      return activeBidang === "all" || tags.some((t) => t.toLowerCase() === activeBidang.toLowerCase());
    });
  }, [data, activeBidang, overrides]);

  const stats = useMemo(() => ({
    total: filtered.length,
    pending: filtered.filter((i) => !i.status.isFinal && !["SELESAI", "DITOLAK"].includes(i.status.code)).length,
    completed: filtered.filter((i) => i.status.isFinal || ["SELESAI"].includes(i.status.code)).length,
    hasAttachments: filtered.filter((i) => (i._count?.attachments ?? 0) > 0).length,
  }), [filtered]);

  const onDispatch = (id: string, _adminId: string, bidang: string | null) => {
    if (bidang) {
      const currentTags = overrides[id] ?? extractTags(filtered.find((i) => i.id === id) || ({} as Complaint));
      setOverrides((prev) => ({ ...prev, [id]: Array.from(new Set([...currentTags, bidang])) }));
    }
    show("Aduan berhasil didisposisikan.");
    setDispatchItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-stone-200/90 bg-gradient-to-r from-[#173f78] via-[#1f4f8f] to-[#29328f] p-6 text-white shadow-xl shadow-[#1f4f8f]/10 sm:p-8">
        <div className="pointer-events-none absolute -top-20 -right-16 size-72 rounded-full border-32 border-white/5" />
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-400/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#f2d35f]">
          <Landmark size={14} /> Portal Disposisi & Aduan Manajer Bidang
        </div>
        <h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight">Daftar Aduan Masuk</h1>
        <p className="mt-2 text-sm text-blue-100/90">Kelola dan teruskan laporan masyarakat ke masing-masing bidang tugas.</p>
      </div>

      <ComplaintManagerTabs activeBidang={activeBidang} onSelectBidang={handleTabChange} />
      <ComplaintStatsCards activeBidang={activeBidang} stats={stats} />
      <ComplaintFilters statuses={statuses} query={query} setQuery={setQuery} />
      {error && <p className="error-box">{error}</p>}

      <section className="surface border border-stone-200/90 shadow-md overflow-hidden">
        <div className="border-b border-stone-200 bg-stone-50/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-[#1f4f8f]" />
            <h2 className="font-bold text-stone-800 text-base">Aduan Masuk ({filtered.length})</h2>
          </div>
          {activeBidang !== "all" && (
            <span className={`rounded-md border px-2.5 py-0.5 text-xs font-bold ${getTagStyle(activeBidang)}`}>
              {BIDANG_TAGS.find((b) => b.value === activeBidang)?.label}
            </span>
          )}
        </div>

        <ComplaintTable
          data={filtered}
          loading={!data}
          overrides={overrides}
          onOpenDetail={(item) => setDetailItem(item)}
          onOpenDispatch={(item) => setDispatchItem(item)}
        />

        {data && (
          <footer className="flex items-center justify-between border-t border-stone-200 bg-stone-50/50 p-4">
            <p className="text-xs text-stone-500">Menampilkan <strong>{filtered.length}</strong> dari <strong>{data.meta.total}</strong> total aduan</p>
            <div className="flex items-center gap-2">
              <button className="btn-secondary p-2" disabled={data.meta.page <= 1} onClick={() => handlePage(data.meta.page - 1)}><ChevronLeft size={16} /></button>
              <span className="text-xs font-bold text-stone-700">{data.meta.page} / {data.meta.totalPages || 1}</span>
              <button className="btn-secondary p-2" disabled={data.meta.page >= data.meta.totalPages} onClick={() => handlePage(data.meta.page + 1)}><ChevronRight size={16} /></button>
            </div>
          </footer>
        )}
      </section>

      <ComplaintDetailModal item={detailItem} statuses={statuses} onClose={() => setDetailItem(null)} onOpenDispatch={(c) => setDispatchItem(c)} onStatusUpdated={load} />
      <ComplaintDispatchModal item={dispatchItem} onClose={() => setDispatchItem(null)} onDispatch={onDispatch} />
    </div>
  );
}
