"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, FileText, SendHorizontal } from "lucide-react";
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
    <div className="space-y-5">
      {/* Header Banner */}
      <section className="rounded-lg border border-[#dbe5f4] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-[#0f172a]">Daftar Aduan Masuk</h2>
          <p className="text-sm text-[#748299]">
            Kelola, telusuri, dan teruskan laporan masyarakat ke masing-masing bidang tugas terkait.
          </p>
        </div>
      </section>

      <ComplaintManagerTabs activeBidang={activeBidang} onSelectBidang={handleTabChange} />
      <ComplaintStatsCards activeBidang={activeBidang} stats={stats} />
      <ComplaintFilters statuses={statuses} query={query} setQuery={setQuery} />

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="rounded-lg border border-[#dbe5f4] bg-white shadow-sm overflow-hidden">
        <div className="border-b border-[#dbe5f4] bg-[#f8fbff] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-[#0f2a4f]" />
            <h3 className="font-semibold text-[#0f172a] text-sm sm:text-base">
              Aduan Masuk ({filtered.length})
            </h3>
          </div>
          {activeBidang !== "all" && (
            <span className={`rounded-md border px-2.5 py-0.5 text-xs font-semibold ${getTagStyle(activeBidang)}`}>
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
          <footer className="flex items-center justify-between border-t border-[#dbe5f4] bg-[#f8fbff] p-4 text-xs text-[#748299]">
            <p>
              Menampilkan <strong>{filtered.length}</strong> dari <strong>{data.meta.total}</strong> total aduan
            </p>
            <div className="flex items-center gap-2">
              <button
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#dbe5f4] bg-white text-[#0f2a4f] hover:bg-[#f8fbff] disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={data.meta.page <= 1}
                onClick={() => handlePage(data.meta.page - 1)}
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="font-semibold text-[#172033]">
                {data.meta.page} / {data.meta.totalPages || 1}
              </span>
              <button
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#dbe5f4] bg-white text-[#0f2a4f] hover:bg-[#f8fbff] disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={data.meta.page >= data.meta.totalPages}
                onClick={() => handlePage(data.meta.page + 1)}
                aria-label="Halaman berikutnya"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </footer>
        )}
      </section>

      <ComplaintDetailModal
        item={detailItem}
        statuses={statuses}
        onClose={() => setDetailItem(null)}
        onOpenDispatch={(c) => setDispatchItem(c)}
        onStatusUpdated={load}
      />
      <ComplaintDispatchModal
        item={dispatchItem}
        onClose={() => setDispatchItem(null)}
        onDispatch={onDispatch}
      />
    </div>
  );
}
