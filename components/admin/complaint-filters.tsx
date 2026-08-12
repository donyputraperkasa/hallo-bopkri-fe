import { Download, Search } from "lucide-react";
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

  return (
    <div className="surface mt-6 flex flex-wrap gap-3 p-4">
      <label className="relative min-w-56 flex-1">
        <Search className="absolute top-3 left-3 text-slate-400" size={18} />
        <input
          className="field pl-10"
          placeholder="Cari kode tiket atau isi..."
          value={query.get("search") ?? ""}
          onChange={(event) => change("search", event.target.value)}
        />
      </label>
      <select
        className="field w-auto min-w-40"
        value={query.get("category") ?? ""}
        onChange={(event) => change("category", event.target.value)}
      >
        <option value="">Semua kategori</option>
        {CATEGORIES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select>
      <select
        className="field w-auto min-w-40"
        value={query.get("statusId") ?? ""}
        onChange={(event) => change("statusId", event.target.value)}
      >
        <option value="">Semua status</option>
        {statuses.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>
      <a
        className="btn-secondary"
        href={`/api/admin/complaints/export.xlsx?${query}`}
        download
      >
        <Download size={17} /> Excel
      </a>
      <a
        className="btn-secondary"
        href={`/api/admin/complaints/export.pdf?${query}`}
        download
      >
        <Download size={17} /> PDF
      </a>
    </div>
  );
}
