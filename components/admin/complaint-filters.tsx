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
    <div className="surface p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400" size={17} />
          <input
            className="field pl-10 text-sm"
            placeholder="Cari kode tiket, nama pelapor, atau isi laporan..."
            value={query.get("search") ?? ""}
            onChange={(event) => change("search", event.target.value)}
          />
        </div>

        {/* Dropdowns & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              className="appearance-none rounded-xl border border-[#ccd8d8] bg-white py-2.5 pr-8 pl-3.5 text-xs sm:text-sm font-bold text-[#173f78] outline-none transition hover:border-[#1f4f8f] focus:border-[#1f4f8f] focus:ring-3 focus:ring-[#dce8f8] cursor-pointer"
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
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <svg className="size-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              className="appearance-none rounded-xl border border-[#ccd8d8] bg-white py-2.5 pr-8 pl-3.5 text-xs sm:text-sm font-bold text-[#173f78] outline-none transition hover:border-[#1f4f8f] focus:border-[#1f4f8f] focus:ring-3 focus:ring-[#dce8f8] cursor-pointer"
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
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <svg className="size-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="btn-secondary px-3 py-2 text-xs font-bold text-slate-600"
              title="Reset pencarian dan filter"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}

          {/* Export Group */}
          <div className="flex items-center gap-1.5 border-l border-slate-200 pl-2">
            <a
              className="btn-secondary px-3 py-2 text-xs font-bold text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50"
              href={`/api/admin/complaints/export.xlsx?${query}`}
              download
              title="Ekspor data ke format Excel (.xlsx)"
            >
              <FileSpreadsheet size={15} className="text-emerald-600" />
              <span>Excel</span>
            </a>
            <a
              className="btn-secondary px-3 py-2 text-xs font-bold text-rose-700 hover:border-rose-300 hover:bg-rose-50"
              href={`/api/admin/complaints/export.pdf?${query}`}
              download
              title="Ekspor laporan ke format PDF"
            >
              <FileText size={15} className="text-rose-600" />
              <span>PDF</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
