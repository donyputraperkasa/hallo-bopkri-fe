"use client";

import { Eye, Mail, MailOpen, SendHorizontal } from "lucide-react";
import { BIDANG_TAGS, categoryLabel, formatDate, getTagStyle } from "@/lib/constants";
import type { Complaint, ComplaintTableRowProps } from "@/types";

export function getRowTags(item: Complaint): string[] {
  const raw =
    (item as unknown as Record<string, unknown>).tags ??
    (item as unknown as Record<string, unknown>).tag;
  if (Array.isArray(item.tags) && item.tags.length > 0) return item.tags;
  if (typeof raw === "string" && raw.trim()) {
    return raw.split(",").map((t) => t.trim()).filter(Boolean);
  }
  return [];
}

export function ComplaintTableRow({
  item,
  tags,
  isUnread,
  readOnly,
  onToggleRead,
  onOpenDetail,
  onOpenDispatch,
}: ComplaintTableRowProps) {
  return (
    <tr
      className={[
        "transition border-l-4",
        isUnread
          ? "border-l-[#2563eb] bg-[#eff6ff]/70 hover:bg-[#e5f0ff]/80"
          : "border-l-transparent bg-white hover:bg-[#f8fbff]",
      ].join(" ")}
    >
      <td className="whitespace-nowrap px-4 py-4">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleRead}
            title={isUnread ? "Tandai sudah dibuka" : "Tandai belum dibuka"}
            className={[
              "relative flex size-7 shrink-0 items-center justify-center rounded-md border transition cursor-pointer",
              isUnread
                ? "border-[#bfdbfe] bg-[#dbeafe] text-[#1d4ed8] hover:bg-[#bfdbfe]"
                : "border-transparent bg-transparent text-[#94a3b8] hover:border-[#dbe5f4] hover:bg-[#f1f5f9] hover:text-[#475569]",
            ].join(" ")}
          >
            {isUnread ? (
              <>
                <Mail size={14} />
                <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-[#2563eb] ring-2 ring-white" />
              </>
            ) : (
              <MailOpen size={14} />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenDetail}
            className={[
              "font-mono text-xs hover:underline text-left cursor-pointer",
              isUnread ? "font-bold text-[#0f2a4f]" : "font-medium text-[#526078]",
            ].join(" ")}
          >
            {item.ticketCode}
          </button>

          {isUnread && (
            <span className="inline-flex items-center rounded-full bg-[#2563eb] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-2xs">
              Baru
            </span>
          )}
        </div>
      </td>

      <td
        className={[
          "whitespace-nowrap px-5 py-4",
          isUnread ? "font-bold text-[#0f172a]" : "font-medium text-[#475569]",
        ].join(" ")}
      >
        {categoryLabel(item.category)}
      </td>

      <td className="px-5 py-4">
        {tags.length === 0 ? (
          <span className="text-xs italic text-[#8b98ad]">Belum ada tag</span>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => {
              const tagInfo = BIDANG_TAGS.find((b) => b.value === t);
              const TagItemIcon = tagInfo?.icon;
              return (
                <span
                  key={t}
                  className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${getTagStyle(t)}`}
                >
                  {TagItemIcon && <TagItemIcon size={12} />}
                  <span>{tagInfo?.label ?? t}</span>
                </span>
              );
            })}
          </div>
        )}
      </td>

      <td className="whitespace-nowrap px-5 py-4">
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold inline-block"
          style={{
            color: item.status.color,
            background: `${item.status.color}18`,
          }}
        >
          {item.status.name}
        </span>
      </td>

      <td
        className={[
          "whitespace-nowrap px-5 py-4 text-xs",
          isUnread ? "font-bold text-[#1e293b]" : "text-[#617089]",
        ].join(" ")}
      >
        {formatDate(item.createdAt)}
      </td>

      <td className="whitespace-nowrap px-5 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          {!readOnly && (
            <button
              type="button"
              onClick={onOpenDispatch}
              className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition cursor-pointer"
            >
              <SendHorizontal size={13} className="text-amber-700" />
              <span>Kirim ke</span>
            </button>
          )}
          <button
            type="button"
            onClick={onOpenDetail}
            className={[
              "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition cursor-pointer",
              isUnread
                ? "border-[#2563eb] bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-xs"
                : "border-[#cfe0f5] bg-[#eaf2ff] text-[#0f2a4f] hover:bg-[#dbeafe]",
            ].join(" ")}
          >
            <Eye size={13} />
            <span>Detail</span>
          </button>
        </div>
      </td>
    </tr>
  );
}
