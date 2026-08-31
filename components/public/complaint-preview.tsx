"use client";

import { ArrowLeft, FileText, Loader2, Send } from "lucide-react";
import { BIDANG_TAGS, categoryLabel, getTagStyle } from "@/lib/constants";
import type { Category } from "@/types/api";
import { PreviewAttachmentsList } from "./preview-attachments-list";

export interface PreviewFileItem {
  file: File;
  name: string;
  size: number;
  type: string;
  isImage: boolean;
  url?: string;
}

interface ComplaintPreviewProps {
  category: Category;
  reporterName: string;
  contact: string;
  content: string;
  selectedTags: string[];
  filePreviews: PreviewFileItem[];
  loading: boolean;
  error?: string;
  onBack: () => void;
  onSubmit: () => void;
}

export function ComplaintPreview({
  category,
  reporterName,
  contact,
  content,
  selectedTags,
  filePreviews,
  loading,
  error,
  onBack,
  onSubmit,
}: ComplaintPreviewProps) {
  return (
    <div className="surface space-y-6 p-6 sm:p-8 border border-stone-200 shadow-sm bg-white">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1f4f8f]">
          <FileText size={14} />
          Langkah 2: Pratinjau Aduan
        </div>
        <h2 className="mt-3 text-2xl font-black text-stone-900">Periksa Kembali Aduan Anda</h2>
        <p className="mt-1 text-sm text-stone-600">
          Pastikan seluruh data dan isi pesan di bawah ini sudah sesuai sebelum dikirim ke sistem.
        </p>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-[#fbfcfd] p-5 sm:p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 text-xs">
          <div>
            <span className="font-semibold text-stone-500 block">Kategori Aduan:</span>
            <span className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1 text-xs font-bold text-stone-800 shadow-2xs">
              {categoryLabel(category)}
            </span>
          </div>

          <div>
            <span className="font-semibold text-stone-500 block">Nama Pelapor:</span>
            <p className="mt-1 font-bold text-stone-800">
              {reporterName.trim() || <span className="italic text-stone-400 font-normal">Anonim / Tidak dicantumkan</span>}
            </p>
          </div>

          <div>
            <span className="font-semibold text-stone-500 block">Kontak (Email / WA):</span>
            <p className="mt-1 font-bold text-stone-800">
              {contact.trim() || <span className="italic text-stone-400 font-normal">Tidak dicantumkan</span>}
            </p>
          </div>

          {selectedTags.length > 0 && (
            <div>
              <span className="font-semibold text-stone-500 block">Bidang Terkait:</span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {selectedTags.map((t) => {
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

        <div className="border-t border-stone-200/70 pt-3.5">
          <span className="text-xs font-semibold text-stone-600 block mb-1.5">Isi Laporan / Aspirasi:</span>
          <div className="rounded-xl border border-stone-200 bg-white p-4 text-xs sm:text-sm text-stone-800 leading-relaxed whitespace-pre-wrap">
            {content}
          </div>
        </div>

        <PreviewAttachmentsList files={filePreviews} />
      </div>

      {error && <p className="error-box">{error}</p>}

      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          disabled={loading}
          onClick={onBack}
          className="btn-secondary w-full sm:w-auto border-stone-300 text-stone-700 bg-white hover:bg-stone-50 cursor-pointer text-sm shadow-xs"
        >
          <ArrowLeft size={16} />
          <span>Ubah Kembali</span>
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={onSubmit}
          className="btn-primary w-full sm:w-auto px-7 text-sm shadow-md cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              <span>Mengirimkan Aduan...</span>
            </>
          ) : (
            <>
              <Send size={17} />
              <span>Kirim Aduan Sekarang</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
