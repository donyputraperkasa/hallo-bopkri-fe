"use client";

import { Eye, Inbox, LoaderCircle, SendHorizontal } from "lucide-react";
import { BIDANG_TAGS, categoryLabel, formatDate, getTagStyle } from "@/lib/constants";
import type { Complaint } from "@/types/api";

export function ComplaintTable({
  data,
  loading,
  overrides,
  onOpenDetail,
  onOpenDispatch,
  readOnly = false,
}: {
  data: Complaint[];
  loading: boolean;
  overrides: Record<string, string[]>;
  onOpenDetail: (item: Complaint) => void;
  onOpenDispatch: (item: Complaint) => void;
  readOnly?: boolean;
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <LoaderCircle className="size-8 animate-spin text-[#0f2a4f]" />
        <p className="text-sm font-medium text-[#748299]">Memuat data aduan...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-[#eef4fb] text-[#748299]">
          <Inbox size={24} />
        </div>
        <h3 className="mt-3 text-base font-semibold text-[#0f172a]">Tidak ada aduan</h3>
        <p className="mx-auto mt-1 max-w-sm text-xs text-[#748299]">
          Belum ada aduan yang sesuai dengan kriteria pencarian ini.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-[#dbe5f4] bg-[#f8fbff] text-xs font-semibold text-[#748299]">
          <tr>
            <th className="px-5 py-3.5">KODE TIKET</th>
            <th className="px-5 py-3.5">KATEGORI</th>
            <th className="px-5 py-3.5">BIDANG SASARAN</th>
            <th className="px-5 py-3.5">STATUS</th>
            <th className="px-5 py-3.5">TANGGAL MASUK</th>
            <th className="px-5 py-3.5 text-right">AKSI</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#eef3fb]">
          {data.map((item) => {
            const raw =
              (item as unknown as Record<string, unknown>).tags ??
              (item as unknown as Record<string, unknown>).tag;
            const extracted =
              Array.isArray(item.tags) && item.tags.length > 0
                ? item.tags
                : typeof raw === "string" && raw.trim()
                ? raw.split(",").map((t) => t.trim()).filter(Boolean)
                : [];
            const tags = overrides[item.id] ?? extracted;

            return (
              <tr key={item.id} className="transition hover:bg-[#f8fbff]">
                <td className="whitespace-nowrap px-5 py-4">
                  <button
                    type="button"
                    onClick={() => onOpenDetail(item)}
                    className="font-mono text-xs font-semibold text-[#1f4f8f] hover:underline text-left"
                  >
                    {item.ticketCode}
                  </button>
                </td>
                <td className="whitespace-nowrap px-5 py-4 font-semibold text-[#172033]">
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
                            className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${getTagStyle(
                              t
                            )}`}
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
                <td className="whitespace-nowrap px-5 py-4 text-xs text-[#617089]">
                  {formatDate(item.createdAt)}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {!readOnly && (
                      <button
                        type="button"
                        onClick={() => onOpenDispatch(item)}
                        className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition"
                      >
                        <SendHorizontal size={13} className="text-amber-700" /> Disposisi
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onOpenDetail(item)}
                      className="inline-flex items-center gap-1 rounded-md border border-[#cfe0f5] bg-[#eaf2ff] px-3 py-1.5 text-xs font-semibold text-[#0f2a4f] hover:bg-[#dbeafe] transition"
                    >
                      <Eye size={13} /> Detail
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
