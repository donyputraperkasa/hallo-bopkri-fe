"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
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
    <div className="space-y-5">
      {/* Header Banner */}
      <section className="rounded-lg border border-[#dbe5f4] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-[#0f172a]">Daftar Seluruh Aduan</h2>
          <p className="text-sm text-[#748299]">
            Pantau seluruh laporan masyarakat dari berbagai bidang dan unit sekolah secara terpadu.
          </p>
        </div>
      </section>

      {/* Bidang Filter Tabs */}
      <div className="rounded-lg border border-[#dbe5f4] bg-white p-2 shadow-sm overflow-x-auto">
        <div className="flex min-w-max items-center gap-1.5 p-1">
          {([
            { value: "all", label: "Semua Bidang" },
            ...BIDANG_TAGS,
          ] as { value: string; label: string }[]).map((b) => (
            <button
              key={b.value}
              onClick={() => setActiveBidang(b.value)}
              className={`rounded-md px-4 py-2 text-xs sm:text-sm font-semibold transition ${
                activeBidang === b.value
                  ? "bg-[#0f2a4f] text-white shadow-xs"
                  : "text-[#526078] hover:bg-[#f8fbff] hover:text-[#0f2a4f]"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

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
              Aduan ({filtered.length})
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
          overrides={{}}
          onOpenDetail={(item) => setDetailItem(item)}
          onOpenDispatch={() => {}}
          readOnly
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
        onOpenDispatch={() => {}}
        onStatusUpdated={load}
        readOnly
      />
    </div>
  );
}
