"use client";

import { categoryLabel, formatDate, BIDANG_TAGS, getTagStyle } from "@/lib/constants";
import type { TrackResult } from "@/types/api";
import { FileText, MessageSquareQuote, Paperclip, User } from "lucide-react";
import { TrackingHistoryTimeline } from "./tracking-history-timeline";

export function TrackingResult({ data }: { data: TrackResult }) {
  const rawTags = data.tags ?? data.tag;
  const tags = Array.isArray(rawTags)
    ? rawTags
    : typeof rawTags === "string" && rawTags.trim()
    ? rawTags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <article className="surface mt-8 overflow-hidden border border-stone-200/90 shadow-xl bg-white">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 bg-gradient-to-r from-stone-50 via-white to-stone-50 p-6">
        <div className="flex items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#1f4f8f]/10 text-[#1f4f8f]">
            <FileText size={22} />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-widest text-stone-400 uppercase">KODE TIKET RESMI</p>
            <h2 className="mt-0.5 font-mono text-2xl font-black text-[#1f4f8f] tracking-wide">{data.ticketCode}</h2>
            <p className="mt-1 text-xs text-stone-500">
              Kategori: <span className="font-semibold text-stone-700">{categoryLabel(data.category)}</span> · Diajukan pada {formatDate(data.createdAt)}
            </p>
          </div>
        </div>

        <span
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold shadow-xs"
          style={{
            color: data.status.color,
            backgroundColor: `${data.status.color}15`,
            border: `1px solid ${data.status.color}40`,
          }}
        >
          <span className="size-2 rounded-full" style={{ backgroundColor: data.status.color }} />
          {data.status.name}
        </span>
      </header>

      <div className="p-6 sm:p-8 space-y-7">
        {data.content ? (
          <div className="rounded-2xl border border-stone-200 bg-[#fbfcfd] p-5 sm:p-6 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between gap-2 border-b border-stone-200/70 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquareQuote size={18} className="text-[#1f4f8f]" />
                <h3 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider">
                  Isi Laporan / Aduan
                </h3>
              </div>
              {data.reporterName && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                  <User size={13} className="text-stone-400" />
                  <span>{data.reporterName}</span>
                </span>
              )}
            </div>

            <div className="text-sm text-stone-800 leading-relaxed whitespace-pre-wrap">
              {data.content}
            </div>

            {(tags.length > 0 || (data.attachments && data.attachments.length > 0)) && (
              <div className="pt-2 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                {tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-stone-500 font-medium">Bidang:</span>
                    {tags.map((t) => {
                      const tagInfo = BIDANG_TAGS.find((b) => b.value.toLowerCase() === t.toLowerCase());
                      return (
                        <span key={t} className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${getTagStyle(t)}`}>
                          {tagInfo?.label ?? t}
                        </span>
                      );
                    })}
                  </div>
                )}
                {data.attachments && data.attachments.length > 0 && (
                  <div className="flex items-center gap-1.5 text-stone-500 font-medium">
                    <Paperclip size={13} className="text-[#1f4f8f]" />
                    <span>{data.attachments.length} Berkas Lampiran</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}

        <TrackingHistoryTimeline histories={data.histories} />
      </div>
    </article>
  );
}
