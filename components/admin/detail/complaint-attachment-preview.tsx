"use client";

import { Download, ExternalLink, FileText, Image as ImageIcon, X } from "lucide-react";
import type { Attachment } from "@/types/api";
import { formatBytes } from "@/lib/constants";

export function ComplaintAttachmentPreview({
  attachment,
  onClose,
}: {
  attachment: Attachment | null;
  onClose: () => void;
}) {
  if (!attachment) return null;

  const url = `/api/admin/complaints/attachments/${attachment.id}`;
  const isImage =
    attachment.mimeType?.startsWith("image/") ||
    /\.(png|jpe?g|webp|gif|svg)$/i.test(attachment.originalName);

  return (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="relative flex flex-col max-w-4xl w-full max-h-[92vh] rounded-3xl border border-stone-700/50 bg-stone-900 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-stone-800 bg-stone-950/90 px-5 py-3.5 text-white">
          <div className="flex items-center gap-2.5 min-w-0 pr-4">
            {isImage ? <ImageIcon size={18} className="text-[#f2d35f] shrink-0" /> : <FileText size={18} className="text-[#f2d35f] shrink-0" />}
            <span className="font-semibold text-sm truncate">{attachment.originalName}</span>
            <span className="text-xs text-stone-400 shrink-0">({formatBytes(attachment.size)})</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={url}
              download={attachment.originalName}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1f4f8f] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#29328f] shadow-sm"
              title="Unduh berkas lampiran"
            >
              <Download size={14} />
              <span>Download</span>
            </a>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-xl bg-stone-800 p-2 text-stone-300 transition hover:bg-stone-700 hover:text-white"
              title="Buka di tab baru"
            >
              <ExternalLink size={15} />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-stone-800 p-2 text-stone-300 transition hover:bg-rose-900/50 hover:text-rose-300 ml-1"
              title="Tutup pratinjau (Esc)"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Media Preview Body */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-stone-950/95 min-h-[300px]">
          {isImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={url}
              alt={attachment.originalName}
              className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-lg cursor-zoom-in"
              onClick={() => window.open(url, "_blank")}
              title="Klik untuk membuka ukuran penuh"
            />
          ) : (
            <div className="text-center p-8 space-y-4">
              <FileText size={56} className="mx-auto text-stone-500" />
              <div>
                <p className="text-sm font-semibold text-stone-200">{attachment.originalName}</p>
                <p className="text-xs text-stone-400 mt-1">Pratinjau dokumen non-gambar</p>
              </div>
              <a
                href={url}
                download={attachment.originalName}
                className="btn-primary inline-flex text-xs px-5 py-2.5"
              >
                <Download size={15} /> Unduh Dokumen
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
