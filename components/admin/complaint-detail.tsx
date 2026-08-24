"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Download,
  LoaderCircle,
  SendHorizontal,
  Tag as TagIcon,
} from "lucide-react";
import { api } from "@/lib/client-api";
import { BIDANG_TAGS, categoryLabel, formatBytes, formatDate, getTagStyle } from "@/lib/constants";
import type { Complaint, ComplaintStatus } from "@/types/api";
import { useToast } from "@/components/ui/toast-provider";
import { StatusUpdateForm } from "./status-update-form";

function getComplaintTags(item: Complaint): string[] {
  if (Array.isArray(item.tags) && item.tags.length > 0) return item.tags;
  const raw = (item as unknown as Record<string, unknown>).tags ?? (item as unknown as Record<string, unknown>).tag;
  if (typeof raw === "string" && raw.trim()) {
    return raw.split(",").map((t) => t.trim()).filter(Boolean);
  }
  return [];
}

export function ComplaintDetail({ id }: { id: string }) {
  const { show } = useToast();
  const [item, setItem] = useState<Complaint | null>(null);
  const [statuses, setStatuses] = useState<ComplaintStatus[]>([]);
  const [error, setError] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [dispatchBidang, setDispatchBidang] = useState<string>("pendidikan");
  const [isDispatching, setIsDispatching] = useState<boolean>(false);

  const load = useCallback(async () => {
    try {
      const [complaint, statusData] = await Promise.all([
        api<Complaint>(`/api/admin/complaints/${id}`),
        api<ComplaintStatus[]>("/api/admin/complaint-statuses"),
      ]);
      setItem(complaint);
      setActiveTags(getComplaintTags(complaint));
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

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDispatching(true);
    try {
      const targetBidangInfo = BIDANG_TAGS.find((b) => b.value === dispatchBidang);
      const newTags = Array.from(new Set([...activeTags, dispatchBidang]));
      setActiveTags(newTags);
      show(`Aduan berhasil didisposisikan ke ${targetBidangInfo?.managerTitle ?? dispatchBidang}.`);
    } catch {
      show("Gagal mengirim disposisi.", "error");
    } finally {
      setIsDispatching(false);
    }
  };

  if (error) return <p className="error-box">{error}</p>;
  if (!item) return <LoaderCircle className="animate-spin text-[#1f4f8f]" />;

  return (
    <div>
      <Link href="/masdon/aduan" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800">
        <ArrowLeft size={17} /> Kembali ke Daftar Aduan
      </Link>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <article className="surface p-6 border border-stone-200/90 shadow-md">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <p className="font-mono text-sm font-bold text-[#1f4f8f]">{item.ticketCode}</p>
                <h1 className="mt-2 text-2xl font-extrabold text-stone-900">{categoryLabel(item.category)}</h1>
              </div>
              <span
                className="h-fit rounded-full px-4 py-2 text-sm font-bold shadow-2xs"
                style={{ color: item.status.color, background: `${item.status.color}18` }}
              >
                {item.status.name}
              </span>
            </div>

            {/* Tag / Bidang Badges dengan Lucide Icons */}
            {activeTags.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-semibold text-stone-400">
                  <TagIcon size={13} /> Bidang Terkait:
                </span>
                {activeTags.map((t) => {
                  const tagInfo = BIDANG_TAGS.find((b) => b.value === t);
                  const TagIconComponent = tagInfo?.icon;
                  return (
                    <span
                      key={t}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${getTagStyle(t)}`}
                    >
                      {TagIconComponent && <TagIconComponent size={13} />}
                      <span>{tagInfo?.label ?? t}</span>
                    </span>
                  );
                })}
              </div>
            )}

            <dl className="mt-6 grid gap-4 border-y border-slate-100 py-5 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-slate-400">Pelapor</dt>
                <dd className="mt-1 font-bold text-stone-800">{item.reporterName || "Anonim"}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Kontak</dt>
                <dd className="mt-1 font-bold text-stone-800">{item.contact || "-"}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Dikirim</dt>
                <dd className="mt-1 font-bold text-stone-800">{formatDate(item.createdAt)}</dd>
              </div>
            </dl>
            <h2 className="mt-6 font-extrabold text-stone-900">Isi aduan</h2>
            <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-700">{item.content}</p>
          </article>

          <article className="surface p-6 border border-stone-200/90 shadow-md">
            <h2 className="font-extrabold text-stone-900">Lampiran bukti ({item.attachments?.length ?? 0})</h2>
            <div className="mt-4 space-y-2">
              {item.attachments?.map((file) => (
                <a
                  key={file.id}
                  href={`/api/admin/complaints/attachments/${file.id}`}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-4 text-sm font-bold transition hover:bg-slate-100"
                >
                  <span className="truncate">
                    {file.originalName}{" "}
                    <small className="font-normal text-slate-400">({formatBytes(file.size)})</small>
                  </span>
                  <Download className="shrink-0" size={17} />
                </a>
              ))}
              {!item.attachments?.length && <p className="text-sm text-slate-400">Tidak ada lampiran.</p>}
            </div>
          </article>

          <article className="surface p-6 border border-stone-200/90 shadow-md">
            <h2 className="font-extrabold text-stone-900">Riwayat penanganan</h2>
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

        <aside className="space-y-5">
          {/* Card Disposisi ke Bidang */}
          <div className="surface p-6 border border-stone-200/90 shadow-md">
            <div className="flex items-center gap-2">
              <SendHorizontal size={18} className="text-[#1f4f8f]" />
              <h3 className="font-bold text-stone-900 text-base">Disposisi ke Bidang</h3>
            </div>
            <p className="mt-1 text-xs text-stone-500">
              Teruskan aduan ini ke manajer bidang terkait.
            </p>

            <form onSubmit={handleDispatch} className="mt-4 space-y-3">
              <div className="space-y-1.5">
                {BIDANG_TAGS.map((b) => {
                  const isSelected = dispatchBidang === b.value;
                  const BidangIcon = b.icon;
                  return (
                    <button
                      key={b.value}
                      type="button"
                      onClick={() => setDispatchBidang(b.value)}
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                        isSelected
                          ? "border-[#1f4f8f] bg-[#1f4f8f]/10 text-[#1f4f8f]"
                          : "border-stone-200 bg-stone-50/70 text-stone-700 hover:bg-stone-100"
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <BidangIcon size={14} className={isSelected ? "text-[#1f4f8f]" : "text-stone-500"} />
                        <span>{b.label}</span>
                      </span>
                      {isSelected && <Check size={14} className="text-[#1f4f8f] shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <button
                type="submit"
                disabled={isDispatching}
                className="btn-primary w-full text-xs font-bold mt-2 shadow-sm"
              >
                <SendHorizontal size={14} />
                <span>{isDispatching ? "Mengirim..." : "Kirim ke Bidang"}</span>
              </button>
            </form>
          </div>

          <StatusUpdateForm
            complaintId={item.id}
            currentId={item.status.id}
            statuses={statuses}
            onUpdated={load}
          />
        </aside>
      </div>
    </div>
  );
}
