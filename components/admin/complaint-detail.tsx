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

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoaderCircle className="size-8 animate-spin text-[#0f2a4f]" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Link
        href="/masdon/aduan"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f2a4f] hover:underline"
      >
        <ArrowLeft size={16} /> Kembali ke Daftar Aduan
      </Link>

      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <article className="rounded-lg border border-[#dbe5f4] bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="font-mono text-sm font-semibold text-[#1f4f8f]">{item.ticketCode}</span>
                <h1 className="mt-1 text-2xl font-semibold text-[#0f172a]">{categoryLabel(item.category)}</h1>
              </div>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{ color: item.status.color, background: `${item.status.color}18` }}
              >
                {item.status.name}
              </span>
            </div>

            {/* Tag / Bidang Badges */}
            {activeTags.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-semibold text-[#748299]">
                  <TagIcon size={13} /> Bidang Terkait:
                </span>
                {activeTags.map((t) => {
                  const tagInfo = BIDANG_TAGS.find((b) => b.value === t);
                  const TagIconComponent = tagInfo?.icon;
                  return (
                    <span
                      key={t}
                      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold ${getTagStyle(t)}`}
                    >
                      {TagIconComponent && <TagIconComponent size={13} />}
                      <span>{tagInfo?.label ?? t}</span>
                    </span>
                  );
                })}
              </div>
            )}

            <dl className="mt-6 grid gap-4 border-y border-[#dbe5f4] py-5 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs font-semibold text-[#748299]">Pelapor</dt>
                <dd className="mt-1 font-semibold text-[#172033]">{item.reporterName || "Anonim"}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-[#748299]">Kontak</dt>
                <dd className="mt-1 font-semibold text-[#172033]">{item.contact || "-"}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-[#748299]">Dikirim</dt>
                <dd className="mt-1 font-semibold text-[#172033]">{formatDate(item.createdAt)}</dd>
              </div>
            </dl>

            <h2 className="mt-6 font-semibold text-[#0f172a]">Isi Aduan</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#172033] bg-[#f8fbff] p-4 rounded-md border border-[#dbe5f4]">
              {item.content}
            </p>
          </article>

          <article className="rounded-lg border border-[#dbe5f4] bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-[#0f172a]">Lampiran Bukti ({item.attachments?.length ?? 0})</h2>
            <div className="mt-4 space-y-2">
              {item.attachments?.map((file) => (
                <a
                  key={file.id}
                  href={`/api/admin/complaints/attachments/${file.id}`}
                  className="flex items-center justify-between rounded-md border border-[#dbe5f4] bg-[#f8fbff] p-3 text-xs font-semibold text-[#172033] transition hover:border-[#b6cce8] hover:bg-white"
                >
                  <span className="truncate">
                    {file.originalName}{" "}
                    <small className="font-normal text-[#8b98ad]">({formatBytes(file.size)})</small>
                  </span>
                  <Download className="shrink-0 text-[#0f2a4f]" size={16} />
                </a>
              ))}
              {!item.attachments?.length && (
                <p className="text-xs text-[#8b98ad] italic">Tidak ada lampiran.</p>
              )}
            </div>
          </article>

          <article className="rounded-lg border border-[#dbe5f4] bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-[#0f172a]">Riwayat Penanganan</h2>
            <div className="mt-4 space-y-3">
              {item.histories?.map((history) => (
                <div key={history.id} className="border-l-2 pl-4" style={{ borderColor: history.status.color }}>
                  <p className="font-semibold text-xs text-[#0f172a]">{history.status.name}</p>
                  <p className="text-[11px] text-[#748299]">{formatDate(history.createdAt)}</p>
                  {history.publicNote && (
                    <p className="mt-1 text-xs text-[#526078] bg-[#f8fbff] p-2.5 rounded-md border border-[#dbe5f4]">
                      {history.publicNote}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </article>
        </div>

        <aside className="space-y-5">
          {/* Card Disposisi ke Bidang */}
          <div className="rounded-lg border border-[#dbe5f4] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <SendHorizontal size={18} className="text-[#0f2a4f]" />
              <h3 className="font-semibold text-[#0f172a] text-base">Disposisi ke Bidang</h3>
            </div>
            <p className="mt-1 text-xs text-[#748299]">
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
                      className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                        isSelected
                          ? "border-[#0f2a4f] bg-[#eef4fb] text-[#0f2a4f] ring-1 ring-[#0f2a4f]"
                          : "border-[#dbe5f4] bg-[#f8fbff] text-[#172033] hover:border-[#b6cce8] hover:bg-white"
                      }`}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <BidangIcon size={14} className={isSelected ? "text-[#0f2a4f]" : "text-[#748299]"} />
                        <span>{b.label}</span>
                      </span>
                      {isSelected && <Check size={14} className="text-[#0f2a4f] shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <button
                type="submit"
                disabled={isDispatching}
                className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md bg-[#0f2a4f] text-xs font-semibold text-white transition hover:bg-[#173b6b] disabled:opacity-50"
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
