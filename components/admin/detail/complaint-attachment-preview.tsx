"use client";

import { useEffect } from "react";
import { Download, ExternalLink, FileText, Image as ImageIcon, Lock, X } from "lucide-react";
import type { Attachment } from "@/types/api";
import { formatBytes } from "@/lib/constants";

export function ComplaintAttachmentPreview({
  attachment,
  onClose,
  allowDownload = false,
}: {
  attachment: Attachment | null;
  onClose: () => void;
  allowDownload?: boolean;
}) {
  useEffect(() => {
    if (!attachment) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Block Ctrl+P / Cmd+P (Print) and Ctrl+S / Cmd+S (Save) if download is restricted
      if (!allowDownload && (e.ctrlKey || e.metaKey)) {
        const key = e.key.toLowerCase();
        if (key === "p" || key === "s") {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [attachment, allowDownload, onClose]);

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
      className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-150 print:hidden"
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
            {!allowDownload && (
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-stone-800 px-2 py-0.5 text-[11px] font-medium text-stone-400 border border-stone-700">
                <Lock size={10} className="text-amber-400" /> Pratinjau Terproteksi
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {allowDownload && (
              <>
                <a
                  href={`${url}?download=1`}
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
              </>
            )}
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
            <div
              className="relative select-none flex items-center justify-center"
              onContextMenu={(e) => {
                if (!allowDownload) e.preventDefault();
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={attachment.originalName}
                draggable={false}
                className={`max-h-[70vh] max-w-full object-contain rounded-xl shadow-lg select-none ${
                  allowDownload ? "cursor-zoom-in" : "pointer-events-none"
                }`}
                onClick={allowDownload ? () => window.open(url, "_blank") : undefined}
                title={allowDownload ? "Klik untuk membuka ukuran penuh" : undefined}
              />
              {!allowDownload && (
                <div
                  className="absolute inset-0 z-10 select-none"
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                />
              )}
            </div>
          ) : (
            <div className="text-center p-8 space-y-4">
              <div className="relative inline-block">
                <FileText size={56} className="mx-auto text-stone-500" />
                {!allowDownload && (
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-stone-900 border border-stone-700 p-1">
                    <Lock size={14} className="text-amber-400" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-200">{attachment.originalName}</p>
                <p className="text-xs text-stone-400 mt-1">
                  {allowDownload
                    ? "Pratinjau dokumen non-gambar"
                    : "Dokumen bukti aduan terproteksi. Pengunduhan dan pembukaan berkas hanya dapat diakses oleh Owner."}
                </p>
              </div>
              {allowDownload && (
                <a
                  href={`${url}?download=1`}
                  download={attachment.originalName}
                  className="btn-primary inline-flex text-xs px-5 py-2.5"
                >
                  <Download size={15} /> Unduh Dokumen
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

