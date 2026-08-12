"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, LoaderCircle, Paperclip } from "lucide-react";
import { api } from "@/lib/client-api";
import { categoryLabel, formatDate } from "@/lib/constants";
import type { ComplaintList as ListData, ComplaintStatus } from "@/types/api";
import { ComplaintFilters } from "./complaint-filters";

export function ComplaintList() {
  const [data, setData] = useState<ListData | null>(null);
  const [statuses, setStatuses] = useState<ComplaintStatus[]>([]);
  const [query, setQuery] = useState(new URLSearchParams("page=1&limit=10"));
  const [error, setError] = useState("");

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

  useEffect(() => {
    // Muat ulang ketika filter atau nomor halaman berubah.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  function page(value: number) {
    const next = new URLSearchParams(query);
    next.set("page", String(value));
    setQuery(next);
  }

  return (
    <div>
      <div>
        <p className="eyebrow">Kelola laporan</p>
        <h1 className="mt-3 text-3xl font-extrabold">Daftar aduan</h1>
      </div>
      <ComplaintFilters statuses={statuses} query={query} setQuery={setQuery} />
      {error && <p className="error-box mt-5">{error}</p>}
      <section className="surface mt-5 overflow-x-auto">
        {!data ? <LoaderCircle className="m-8 animate-spin text-[#1f4f8f]" /> : (
          <>
            <table className="w-full min-w-190 text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
                <tr>{["Tiket", "Kategori", "Isi singkat", "Bukti", "Status", "Tanggal"].map((item) =>
                  <th key={item} className="px-5 py-4 font-bold">{item}</th>)}</tr>
              </thead>
              <tbody>
                {data.data.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-5 py-4"><Link className="font-mono font-bold text-[#1f4f8f]" href={`/masdon/aduan/${item.id}`}>{item.ticketCode}</Link></td>
                    <td className="px-5 py-4">{categoryLabel(item.category)}</td>
                    <td className="max-w-80 truncate px-5 py-4 text-slate-500">{item.content}</td>
                    <td className="px-5 py-4"><span className="flex gap-1"><Paperclip size={15} />{item._count?.attachments ?? 0}</span></td>
                    <td className="px-5 py-4"><span className="rounded-full px-3 py-1 font-bold" style={{ color: item.status.color, background: `${item.status.color}18` }}>{item.status.name}</span></td>
                    <td className="px-5 py-4 text-slate-500">{formatDate(item.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!data.data.length && <p className="empty">Belum ada aduan yang sesuai filter.</p>}
            <footer className="flex items-center justify-between border-t border-slate-100 p-4">
              <p className="text-sm text-slate-500">{data.meta.total} aduan</p>
              <div className="flex items-center gap-2">
                <button className="btn-secondary p-2" disabled={data.meta.page <= 1} onClick={() => page(data.meta.page - 1)}><ChevronLeft size={17} /></button>
                <span className="text-sm font-bold">{data.meta.page} / {data.meta.totalPages || 1}</span>
                <button className="btn-secondary p-2" disabled={data.meta.page >= data.meta.totalPages} onClick={() => page(data.meta.page + 1)}><ChevronRight size={17} /></button>
              </div>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}
