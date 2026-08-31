"use client";

import Link from "next/link";
import { CheckCircle2, Copy, Link2, Search, Check, FileText, User, Mail, Tags, Paperclip } from "lucide-react";
import { useState } from "react";
import { categoryLabel, BIDANG_TAGS, getTagStyle } from "@/lib/constants";
import type { Category } from "@/types/api";

export interface SubmittedComplaintDetails {
  category: Category;
  content: string;
  reporterName?: string;
  contact?: string;
  tags?: string[];
  attachmentsCount?: number;
}

export function TicketSuccess({
  ticketCode,
  details,
}: {
  ticketCode: string;
  details?: SubmittedComplaintDetails;
}) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  async function copyTicket() {
    try {
      await navigator.clipboard.writeText(ticketCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      // Fallback if clipboard API is blocked
    }
  }

  async function copyTrackingLink() {
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const trackingUrl = `${origin}/lacak-aduan?ticket=${encodeURIComponent(ticketCode)}`;
      await navigator.clipboard.writeText(trackingUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback
    }
  }

  return (
    <div className="surface p-6 text-center sm:p-8 border border-stone-200 shadow-sm bg-white space-y-6">
      {/* Icon Success */}
      <div>
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-xs">
          <CheckCircle2 size={32} />
        </div>

        <h2 className="mt-4 text-2xl font-black text-stone-900">
          Aduan Berhasil Dikirim
        </h2>
        <p className="mx-auto mt-1.5 max-w-md text-sm text-stone-600 leading-relaxed">
          Simpan kode tiket berikut. Kode ini merupakan nomor bukti resmi untuk melacak perkembangan aduan Anda.
        </p>
      </div>

      {/* Kotak Kode Tiket yang Kontras & Jelas */}
      <div className="mx-auto max-w-md rounded-2xl border-2 border-dashed border-[#1f4f8f]/30 bg-stone-50 p-4 sm:p-5">
        <span className="block text-[11px] font-bold tracking-wider text-stone-500 uppercase">
          Kode Tiket Resmi Anda
        </span>
        
        <div className="mt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200 shadow-xs">
          <code className="font-mono text-lg sm:text-xl font-black tracking-wide text-[#1f4f8f] select-all">
            {ticketCode}
          </code>

          <button
            type="button"
            onClick={copyTicket}
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all shadow-xs cursor-pointer ${
              copiedCode
                ? "bg-emerald-600 text-white"
                : "bg-[#1f4f8f] text-white hover:bg-[#173b6b]"
            }`}
          >
            {copiedCode ? <Check size={15} /> : <Copy size={15} />}
            <span>{copiedCode ? "Tersalin!" : "Salin Kode"}</span>
          </button>
        </div>

        {/* Notifikasi mini inline saat tersalin */}
        {copiedCode && (
          <p className="mt-2 text-xs font-semibold text-emerald-700 animate-in fade-in">
            ✓ Kode tiket berhasil disalin ke clipboard
          </p>
        )}
      </div>

      {/* Tombol Aksi Bawah: Salin Link Pelacakan & Lacak Sekarang */}
      <div className="mx-auto flex max-w-md flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={copyTrackingLink}
          className={`btn-secondary w-full sm:w-auto flex-1 justify-center border-stone-300 text-stone-700 bg-white hover:bg-stone-50 hover:border-stone-400 text-sm shadow-xs cursor-pointer ${
            copiedLink ? "!border-emerald-500 !text-emerald-700 !bg-emerald-50" : ""
          }`}
        >
          {copiedLink ? <Check size={16} /> : <Link2 size={16} />}
          <span>{copiedLink ? "Link Tersalin!" : "Salin Link Lacak"}</span>
        </button>

        <Link
          href={`/lacak-aduan?ticket=${ticketCode}`}
          className="btn-primary w-full sm:w-auto flex-1 justify-center text-sm shadow-md"
        >
          <Search size={16} />
          <span>Lacak Aduan</span>
        </Link>
      </div>

      {copiedLink && (
        <p className="text-xs font-semibold text-emerald-700 animate-in fade-in">
          ✓ Tautan pelacakan berhasil disalin ke clipboard
        </p>
      )}

      {/* Tampilan Rincian Isian Aduan yang Baru Dikirim */}
      {details && (
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
                      <span
                        key={t}
                        className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${getTagStyle(t)}`}
                      >
                        {tagInfo?.label ?? t}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Isi Pesan */}
          <div className="pt-2">
            <span className="text-xs font-semibold text-stone-600 block mb-1">
              Isi Aduan:
            </span>
            <div className="rounded-lg border border-stone-200 bg-white p-3.5 text-xs sm:text-sm text-stone-800 leading-relaxed whitespace-pre-wrap">
              {details.content}
            </div>
          </div>

          {details.attachmentsCount ? (
            <div className="flex items-center gap-2 text-xs text-stone-600 pt-1">
              <Paperclip size={14} className="text-[#1f4f8f]" />
              <span>{details.attachmentsCount} berkas lampiran berhasil diunggah</span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
