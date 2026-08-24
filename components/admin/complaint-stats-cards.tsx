"use client";

import { ClipboardCheck, Inbox, Paperclip, ShieldCheck } from "lucide-react";
import { BIDANG_TAGS } from "@/lib/constants";

export function ComplaintStatsCards({
  activeBidang,
  stats,
}: {
  activeBidang: string;
  stats: { total: number; pending: number; completed: number; hasAttachments: number };
}) {
  const activeManagerInfo = BIDANG_TAGS.find((b) => b.value === activeBidang);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article className="surface interactive-card p-5">
        <div className="flex items-center justify-between">
          <span className="grid size-11 place-items-center rounded-2xl bg-[#eaf1fb] text-[#1f4f8f]">
            <Inbox size={21} />
          </span>
          <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Total</span>
        </div>
        <p className="mt-4 text-3xl font-extrabold text-[#173f78]">{stats.total}</p>
        <p className="text-sm font-semibold text-slate-500">
          Aduan {activeBidang === "all" ? "Seluruh Bidang" : `Bidang ${activeManagerInfo?.label}`}
        </p>
      </article>

      <article className="surface interactive-card relative overflow-hidden p-5">
        <span className="absolute inset-x-0 top-0 h-1 bg-[#f2d35f]" />
        <div className="flex items-center justify-between">
          <span className="grid size-11 place-items-center rounded-2xl bg-amber-50 text-amber-600">
            <ClipboardCheck size={21} />
          </span>
          <span className="text-xs font-bold tracking-wider text-[#b48700] uppercase">Dalam Proses</span>
        </div>
        <p className="mt-4 text-3xl font-extrabold text-[#173f78]">{stats.pending}</p>
        <p className="text-sm font-semibold text-slate-500">Perlu tindak lanjut</p>
      </article>

      <article className="surface interactive-card relative overflow-hidden p-5">
        <span className="absolute inset-x-0 top-0 h-1 bg-emerald-500" />
        <div className="flex items-center justify-between">
          <span className="grid size-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
            <ShieldCheck size={21} />
          </span>
          <span className="text-xs font-bold tracking-wider text-emerald-700 uppercase">Selesai</span>
        </div>
        <p className="mt-4 text-3xl font-extrabold text-[#173f78]">{stats.completed}</p>
        <p className="text-sm font-semibold text-slate-500">Laporan tuntas</p>
      </article>

      <article className="surface interactive-card relative overflow-hidden p-5">
        <span className="absolute inset-x-0 top-0 h-1 bg-[#29328f]" />
        <div className="flex items-center justify-between">
          <span className="grid size-11 place-items-center rounded-2xl bg-purple-50 text-purple-600">
            <Paperclip size={21} />
          </span>
          <span className="text-xs font-bold tracking-wider text-purple-700 uppercase">Lampiran</span>
        </div>
        <p className="mt-4 text-3xl font-extrabold text-[#173f78]">{stats.hasAttachments}</p>
        <p className="text-sm font-semibold text-slate-500">Memiliki berkas bukti</p>
      </article>
    </div>
  );
}
