"use client";

import { useState } from "react";
import { FileIcon, FileText, ImageIcon, Paperclip, X } from "lucide-react";
import { BIDANG_TAGS, categoryLabel, formatBytes, getTagStyle } from "@/lib/constants";
import type { SubmittedComplaintDetails } from "./ticket-success";

export function TicketDetailsCard({ details }: { details: SubmittedComplaintDetails }) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  return (
    <div className="mt-8 text-left rounded-xl border border-stone-200 bg-[#fbfcfd] p-5 sm:p-6 space-y-4">
      <div className="flex items-center gap-2 border-b border-stone-200/80 pb-3">
        <FileText size={18} className="text-[#1f4f8f]" />
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
          Rincian Aduan yang Anda Kirimkan
        </h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 text-xs">
        <div>
          <span className="text-stone-500 font-medium">Kategori:</span>
          <p className="font-bold text-stone-800 mt-0.5">{categoryLabel(details.category)}</p>
        </div>

        {details.reporterName && (
          <div>
            <span className="text-stone-500 font-medium">Nama Pelapor:</span>
            <p className="font-bold text-stone-800 mt-0.5">{details.reporterName}</p>
          </div>
        )}

        {details.contact && (
          <div>
            <span className="text-stone-500 font-medium">Kontak:</span>
            <p className="font-bold text-stone-800 mt-0.5">{details.contact}</p>
          </div>
        )}

        {details.tags && details.tags.length > 0 && (
          <div className="sm:col-span-2">
            <span className="text-stone-500 font-medium">Bidang Terkait:</span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {details.tags.map((t) => {
                const tagInfo = BIDANG_TAGS.find((b) => b.value.toLowerCase() === t.toLowerCase());
                return (
                  <span key={t} className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${getTagStyle(t)}`}>
                    {tagInfo?.label ?? t}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="pt-2">
        <span className="text-xs font-semibold text-stone-600 block mb-1">Isi Aduan:</span>
        <div className="rounded-lg border border-stone-200 bg-white p-3.5 text-xs sm:text-sm text-stone-800 leading-relaxed whitespace-pre-wrap">
          {details.content}
        </div>
      </div>

      {details.files && details.files.length > 0 ? (
        <div className="pt-2">
          <span className="text-xs font-semibold text-stone-600 block mb-2">
            Lampiran Berkas ({details.files.length}):
          </span>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {details.files.map((file, idx) => {
              const isImage = file.type.startsWith("image/") || /\.(jpg|jpeg|png|webp)$/i.test(file.name);
              return (
                <div key={idx} className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-2.5 shadow-2xs">
                  {isImage && file.url ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      onClick={() => setPreviewImage(file.url ?? null)}
                      className="size-14 rounded-lg object-cover border border-stone-200 shrink-0 cursor-pointer hover:opacity-90"
                    />
                  ) : (
                    <span className="grid size-14 shrink-0 place-items-center rounded-lg bg-[#eef4fb] text-[#1f4f8f] border border-[#d8e3f4]">
                      {isImage ? <ImageIcon size={22} /> : <FileIcon size={22} />}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-stone-800" title={file.name}>{file.name}</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">{formatBytes(file.size)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : details.attachmentsCount ? (
        <div className="flex items-center gap-2 text-xs text-stone-600 pt-1">
          <Paperclip size={14} className="text-[#1f4f8f]" />
          <span>{details.attachmentsCount} berkas lampiran berhasil diunggah</span>
        </div>
      ) : null}

      {previewImage && (
        <div onClick={() => setPreviewImage(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 cursor-pointer">
          <div className="relative max-h-[85vh] max-w-[90vw]">
            <img src={previewImage} alt="Pratinjau Lampiran" className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain shadow-2xl" />
            <button type="button" onClick={() => setPreviewImage(null)} className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-black/60 text-white hover:bg-black">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
