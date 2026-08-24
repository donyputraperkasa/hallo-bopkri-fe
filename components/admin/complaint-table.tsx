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
      <div className="py-16 flex flex-col items-center justify-center gap-3">
        <LoaderCircle className="size-8 animate-spin text-[#1f4f8f]" />
        <p className="text-sm font-medium text-slate-500">Memuat data aduan...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-400">
          <Inbox size={24} />
        </div>
        <h3 className="mt-3 font-extrabold text-[#173f78] text-base">Tidak ada aduan</h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
          Belum ada aduan yang sesuai dengan filter ini.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500">
          <tr>
            <th className="px-5 py-4">KODE TIKET</th>
            <th className="px-5 py-4">KATEGORI</th>
            <th className="px-5 py-4">TAG / BIDANG SASARAN</th>
            <th className="px-5 py-4">STATUS PENANGANAN</th>
            <th className="px-5 py-4">TANGGAL MASUK</th>
            <th className="px-5 py-4 text-right">AKSI & DISPOSISI</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((item) => {
            const raw = (item as unknown as Record<string, unknown>).tags ?? (item as unknown as Record<string, unknown>).tag;
            const extracted = Array.isArray(item.tags) && item.tags.length > 0
              ? item.tags
              : typeof raw === "string" && raw.trim()
              ? raw.split(",").map((t) => t.trim()).filter(Boolean)
              : [];
            const tags = overrides[item.id] ?? extracted;

            return (
              <tr key={item.id} className="border-b border-slate-100 transition hover:bg-slate-50">
                <td className="px-5 py-4 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onOpenDetail(item)}
                    className="font-mono font-bold text-[#1f4f8f] hover:underline text-left"
                  >
                    {item.ticketCode}
                  </button>
                </td>
                <td className="px-5 py-4 whitespace-nowrap font-bold text-[#173f78]">
                  {categoryLabel(item.category)}
                </td>
                <td className="px-5 py-4">
                  {tags.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">Belum ada tag</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((t) => {
                        const tagInfo = BIDANG_TAGS.find((b) => b.value === t);
                        const TagItemIcon = tagInfo?.icon;
                        return (
                          <span
                            key={t}
                            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-0.5 text-xs font-semibold ${getTagStyle(
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
                <td className="px-5 py-4 whitespace-nowrap">
                  <span
                    className="rounded-full px-3 py-1 font-bold text-xs"
                    style={{
                      color: item.status.color,
                      background: `${item.status.color}18`,
                    }}
                  >
                    {item.status.name}
                  </span>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-500">
                  {formatDate(item.createdAt)}
                </td>
                <td className="px-5 py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    {!readOnly && (
                      <button
                        type="button"
                        onClick={() => onOpenDispatch(item)}
                        className="inline-flex items-center gap-1 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100 shadow-2xs"
                      >
                        <SendHorizontal size={13} className="text-amber-700" /> Disposisi
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onOpenDetail(item)}
                      className="btn-secondary px-3 py-1.5 text-xs text-[#173f78]"
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
