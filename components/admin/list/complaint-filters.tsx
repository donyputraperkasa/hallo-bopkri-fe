"use client";

import { FileSpreadsheet, FileText, RotateCcw, Search } from "lucide-react";
import type { ComplaintStatus } from "@/types/api";
import { CATEGORIES } from "@/lib/constants";

export function ComplaintFilters({
  statuses,
  query,
  setQuery,
}: {
  statuses: ComplaintStatus[];
  query: URLSearchParams;
  setQuery: (query: URLSearchParams) => void;
}) {
  function change(name: string, value: string) {
    const next = new URLSearchParams(query);
    if (value) next.set(name, value);
    else next.delete(name);
    next.set("page", "1");
    setQuery(next);
  }

  const hasActiveFilters = Boolean(
    query.get("search") || query.get("category") || query.get("statusId")
  );

  function resetFilters() {
    const next = new URLSearchParams();
    next.set("page", "1");
    next.set("limit", "10");
    const currentTag = query.get("tag");
    if (currentTag) next.set("tag", currentTag);
    setQuery(next);
  }

  return (
    <section className="rounded-lg border border-[#dbe5f4] bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Bar */}
        <label className="flex h-10 flex-1 items-center gap-3 rounded-md border border-[#dbe5f4] bg-[#f8fbff] px-3">
          <Search size={17} className="text-[#748299]" aria-hidden="true" />
          <input
            className="min-w-0 flex-1 bg-transparent text-sm text-[#172033] outline-none placeholder:text-[#8b98ad]"
            placeholder="Cari kode tiket, nama pelapor, atau isi laporan..."
            value={query.get("search") ?? ""}
            onChange={(event) => change("search", event.target.value)}
          />
        </label>

        {/* Dropdowns & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Dropdown */}
          <select
            className="h-10 rounded-md border border-[#dbe5f4] bg-[#f8fbff] px-3 text-xs sm:text-sm font-semibold text-[#172033] outline-none cursor-pointer hover:border-[#b6cce8]"
            value={query.get("category") ?? ""}
            onChange={(event) => change("category", event.target.value)}
          >
            <option value="">Semua Kategori</option>
            {CATEGORIES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            className="h-10 rounded-md border border-[#dbe5f4] bg-[#f8fbff] px-3 text-xs sm:text-sm font-semibold text-[#172033] outline-none cursor-pointer hover:border-[#b6cce8]"
            value={query.get("statusId") ?? ""}
            onChange={(event) => change("statusId", event.target.value)}
          >
            <option value="">Semua Status</option>
            {statuses.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-10 items-center gap-1.5 rounded-md border border-[#dbe5f4] bg-white px-3 text-xs font-semibold text-[#526078] hover:bg-[#f8fbff] hover:text-[#0f2a4f]"
              title="Reset pencarian dan filter"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}

          {/* Export Group */}
          <div className="flex items-center gap-1.5 border-l border-[#dbe5f4] pl-2.5">
            <a
              className="inline-flex h-10 items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50/70 px-3 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition"
              href={`/api/admin/complaints/export.xlsx?${query}`}
              download
              title="Ekspor data ke format Excel (.xlsx)"
            >
              <FileSpreadsheet size={15} className="text-emerald-700" />
              <span>Excel</span>
            </a>
            <a
              className="inline-flex h-10 items-center gap-1.5 rounded-md border border-rose-200 bg-rose-50/70 px-3 text-xs font-semibold text-rose-800 hover:bg-rose-100 transition"
              href={`/api/admin/complaints/export.pdf?${query}`}
              download
              title="Ekspor laporan ke format PDF"
            >
              <FileText size={15} className="text-rose-700" />
              <span>PDF</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
