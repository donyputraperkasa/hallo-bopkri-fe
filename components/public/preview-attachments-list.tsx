"use client";

import { useState } from "react";
import { FileIcon, ImageIcon, X } from "lucide-react";
import { formatBytes } from "@/lib/constants";
import type { PreviewFileItem } from "./complaint-preview";

export function PreviewAttachmentsList({ files }: { files: PreviewFileItem[] }) {
  const [modalImage, setModalImage] = useState<string | null>(null);

  if (files.length === 0) return null;

  return (
    <div className="border-t border-stone-200/70 pt-3.5">
      <span className="text-xs font-semibold text-stone-600 block mb-2">
        Lampiran Berkas ({files.length}):
      </span>
      <div className="grid gap-3 sm:grid-cols-2">
        {files.map((fp, idx) => (
          <div key={idx} className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-3 shadow-2xs">
            {fp.isImage && fp.url ? (
              <img
                src={fp.url}
                alt={fp.name}
                onClick={() => setModalImage(fp.url ?? null)}
                className="size-16 rounded-lg object-cover border border-stone-200 shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                title="Klik untuk memperbesar"
              />
            ) : (
              <span className="grid size-16 shrink-0 place-items-center rounded-lg bg-[#eef4fb] text-[#1f4f8f] border border-[#d8e3f4]">
                {fp.isImage ? <ImageIcon size={24} /> : <FileIcon size={24} />}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-stone-800" title={fp.name}>{fp.name}</p>
              <p className="text-[11px] text-stone-400 mt-0.5">{formatBytes(fp.size)}</p>
              {fp.isImage && fp.url && (
                <button
                  type="button"
                  onClick={() => setModalImage(fp.url ?? null)}
                  className="mt-1 text-[11px] font-semibold text-[#1f4f8f] hover:underline block cursor-pointer"
                >
                  Lihat Foto
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {modalImage && (
        <div onClick={() => setModalImage(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 cursor-pointer">
          <div className="relative max-h-[85vh] max-w-[90vw]">
            <img src={modalImage} alt="Pratinjau Penuh" className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain shadow-2xl" />
            <button type="button" onClick={() => setModalImage(null)} className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-black/60 text-white hover:bg-black">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
