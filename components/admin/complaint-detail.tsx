"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Download, LoaderCircle } from "lucide-react";
import { api } from "@/lib/client-api";
import { categoryLabel, formatBytes, formatDate } from "@/lib/constants";
import type { Complaint, ComplaintStatus } from "@/types/api";
import { StatusUpdateForm } from "./status-update-form";

export function ComplaintDetail({ id }: { id: string }) {
  const [item, setItem] = useState<Complaint | null>(null);
  const [statuses, setStatuses] = useState<ComplaintStatus[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [complaint, statusData] = await Promise.all([
        api<Complaint>(`/api/admin/complaints/${id}`),
        api<ComplaintStatus[]>("/api/admin/complaint-statuses"),
      ]);
      setItem(complaint);
      setStatuses(statusData);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Detail gagal dimuat.");
    }
  }, [id]);

  useEffect(() => {
    // Pemanggilan asinkron pertama untuk mengisi halaman detail.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);
  if (error) return <p className="error-box">{error}</p>;
  if (!item) return <LoaderCircle className="animate-spin text-[#1f4f8f]" />;

  return (
    <div>
      <Link href="/masdon/aduan" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500">
        <ArrowLeft size={17} /> Kembali
      </Link>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <article className="surface p-6">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <p className="font-mono text-sm font-bold text-[#1f4f8f]">{item.ticketCode}</p>
                <h1 className="mt-2 text-2xl font-extrabold">{categoryLabel(item.category)}</h1>
              </div>
              <span className="h-fit rounded-full px-4 py-2 text-sm font-bold" style={{ color: item.status.color, background: `${item.status.color}18` }}>{item.status.name}</span>
            </div>
            <dl className="mt-6 grid gap-4 border-y border-slate-100 py-5 text-sm sm:grid-cols-3">
              <div><dt className="text-slate-400">Pelapor</dt><dd className="mt-1 font-bold">{item.reporterName || "Anonim"}</dd></div>
              <div><dt className="text-slate-400">Kontak</dt><dd className="mt-1 font-bold">{item.contact || "-"}</dd></div>
              <div><dt className="text-slate-400">Dikirim</dt><dd className="mt-1 font-bold">{formatDate(item.createdAt)}</dd></div>
            </dl>
            <h2 className="mt-6 font-extrabold">Isi aduan</h2>
            <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-600">{item.content}</p>
          </article>
          <article className="surface p-6">
            <h2 className="font-extrabold">Lampiran bukti ({item.attachments?.length ?? 0})</h2>
            <div className="mt-4 space-y-2">
              {item.attachments?.map((file) => (
                <a key={file.id} href={`/api/admin/complaints/attachments/${file.id}`} className="flex items-center justify-between rounded-xl bg-slate-50 p-4 text-sm font-bold">
                  <span className="truncate">{file.originalName} <small className="font-normal text-slate-400">({formatBytes(file.size)})</small></span>
                  <Download className="shrink-0" size={17} />
                </a>
              ))}
              {!item.attachments?.length && <p className="text-sm text-slate-400">Tidak ada lampiran.</p>}
            </div>
          </article>
          <article className="surface p-6">
            <h2 className="font-extrabold">Riwayat penanganan</h2>
            <div className="mt-4 space-y-4">
              {item.histories?.map((history) => (
                <div key={history.id} className="border-l-2 pl-4" style={{ borderColor: history.status.color }}>
                  <p className="font-bold">{history.status.name}</p>
                  <p className="text-xs text-slate-400">{formatDate(history.createdAt)}</p>
                  {history.publicNote && <p className="mt-1 text-sm text-slate-600">{history.publicNote}</p>}
                </div>
              ))}
            </div>
          </article>
        </div>
        <aside><StatusUpdateForm complaintId={item.id} currentId={item.status.id} statuses={statuses} onUpdated={load} /></aside>
      </div>
    </div>
  );
}
