"use client";

import { SendHorizontal, Tag as TagIcon } from "lucide-react";
import { BIDANG_TAGS, categoryLabel, formatDate, getTagStyle } from "@/lib/constants";
import type { Complaint } from "@/types/api";

interface ComplaintMainCardProps {
  item: Complaint;
  activeTags: string[];
  onOpenDispatch: () => void;
}

export function ComplaintMainCard({
  item,
  activeTags,
  onOpenDispatch,
}: ComplaintMainCardProps) {
  return (
    <article className="rounded-lg border border-[#dbe5f4] bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="font-mono text-sm font-semibold text-[#1f4f8f]">
            {item.ticketCode}
          </span>
          <h1 className="mt-1 text-2xl font-semibold text-[#0f172a]">
            {categoryLabel(item.category)}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              color: item.status.color,
              background: `${item.status.color}18`,
            }}
          >
            {item.status.name}
          </span>
          <button
            type="button"
            onClick={onOpenDispatch}
            className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition shadow-2xs"
          >
            <SendHorizontal size={13} className="text-amber-700" />
            <span>Kirim ke</span>
          </button>
        </div>
      </div>

      {activeTags.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-semibold text-[#748299]">
            <TagIcon size={13} /> Bidang Terkait:
          </span>
          {activeTags.map((t) => {
            const tagInfo = BIDANG_TAGS.find(
              (b) => b.value.toLowerCase() === t.toLowerCase()
            );
            const TagIconComponent = tagInfo?.icon;
            return (
              <span
                key={t}
                className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold ${getTagStyle(
                  t
                )}`}
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
          <dd className="mt-1 font-semibold text-[#172033]">
            {item.reporterName || "Anonim"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-[#748299]">Kontak</dt>
          <dd className="mt-1 font-semibold text-[#172033]">{item.contact || "-"}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-[#748299]">Dikirim</dt>
          <dd className="mt-1 font-semibold text-[#172033]">
            {formatDate(item.createdAt)}
          </dd>
        </div>
      </dl>

      <h2 className="mt-6 font-semibold text-[#0f172a]">Isi Aduan</h2>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#172033] bg-[#f8fbff] p-4 rounded-md border border-[#dbe5f4]">
        {item.content}
      </p>
    </article>
  );
}
