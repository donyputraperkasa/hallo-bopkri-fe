"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Download,
  Eye,
  LoaderCircle,
  Paperclip,
  Phone,
  SendHorizontal,
  Tag as TagIcon,
  User,
  X,
} from "lucide-react";
import { api } from "@/lib/client-api";
import { BIDANG_TAGS, categoryLabel, formatBytes, formatDate, getTagStyle } from "@/lib/constants";
import type { Attachment, Complaint, ComplaintStatus } from "@/types/api";
import { useToast } from "@/components/ui/toast-provider";
import { ComplaintAttachmentPreview } from "./complaint-attachment-preview";

export function ComplaintDetailModal({
  item,
  statuses,
  onClose,
  onOpenDispatch,
  onStatusUpdated,
}: {
  item: Complaint | null;
  statuses: ComplaintStatus[];
  onClose: () => void;
  onOpenDispatch: (complaint: Complaint) => void;
  onStatusUpdated: () => void;
}) {
  const { show } = useToast();
  const [fullItem, setFullItem] = useState<Complaint | null>(item);
  const [loading, setLoading] = useState<boolean>(false);
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);
  const [newStatus, setNewStatus] = useState<string>(item?.status.id ?? "");
  const [note, setNote] = useState<string>("");
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    if (!item) return;
    setFullItem(item);
    setNewStatus(item.status.id);
    setLoading(true);
    api<Complaint>(`/api/admin/complaints/${item.id}`)
      .then((res) => {
        setFullItem(res);
        setNewStatus(res.status.id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [item]);

  if (!item) return null;

  const current = fullItem ?? item;
  const raw = (current as unknown as Record<string, unknown>).tags ?? (current as unknown as Record<string, unknown>).tag;
  const tags = Array.isArray(current.tags) && current.tags.length > 0
    ? current.tags
    : typeof raw === "string" && raw.trim()
    ? raw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await api(`/api/admin/complaints/${current.id}/status`, {
        method: "POST",
        body: JSON.stringify({ statusId: newStatus, publicNote: note || undefined }),
      });
      show("Status aduan berhasil diperbarui.");
      const updated = await api<Complaint>(`/api/admin/complaints/${current.id}`);
      setFullItem(updated);
      setNote("");
      onStatusUpdated();
    } catch (err) {
      show(err instanceof Error ? err.message : "Gagal memperbarui status.", "error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <div
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      >
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto"
        >
          {/* Header Modal */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50 px-6 py-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm sm:text-base font-extrabold text-[#1f4f8f]">
                  {current.ticketCode}
                </span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                  style={{
                    color: current.status.color,
                    backgroundColor: `${current.status.color}18`,
                  }}
                >
                  {current.status.name}
                </span>
              </div>
              <h3 className="mt-0.5 text-xl font-extrabold text-[#173f78]">
                {categoryLabel(current.category)}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              title="Tutup (Esc)"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4.5">
            {loading && !fullItem && (
              <div className="py-10 flex justify-center">
                <LoaderCircle className="size-6 animate-spin text-[#1f4f8f]" />
              </div>
            )}

            {/* Tag / Bidang Sasaran */}
            <div>
              <span className="text-xs font-bold tracking-wider text-slate-400 uppercase block mb-1.5">
                Tag / Bidang Sasaran
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {tags.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">Belum ditentukan bidang</span>
                ) : (
                  tags.map((t) => {
                    const tagInfo = BIDANG_TAGS.find((b) => b.value === t);
                    const TagItemIcon = tagInfo?.icon;
                    return (
                      <span
                        key={t}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${getTagStyle(
                          t
                        )}`}
                      >
                        {TagItemIcon && <TagItemIcon size={13} />}
                        <span>{tagInfo?.label ?? t}</span>
                      </span>
                    );
                  })
                )}
                <button
                  type="button"
                  onClick={() => onOpenDispatch(current)}
                  className="inline-flex items-center gap-1 rounded-lg border border-dashed border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 hover:bg-amber-100 ml-1 transition"
                >
                  <SendHorizontal size={12} />
                  <span>+ Disposisikan Bidang</span>
                </button>
              </div>
            </div>

            {/* Info Pelapor */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs">
              <div>
                <span className="text-slate-400 flex items-center gap-1 font-medium mb-0.5">
                  <User size={13} /> Pelapor
                </span>
                <p className="font-bold text-[#173f78] truncate">{current.reporterName || "Anonim"}</p>
              </div>
              <div>
                <span className="text-slate-400 flex items-center gap-1 font-medium mb-0.5">
                  <Phone size={13} /> Kontak
                </span>
                <p className="font-bold text-[#173f78] truncate">{current.contact || "-"}</p>
              </div>
              <div>
                <span className="text-slate-400 flex items-center gap-1 font-medium mb-0.5">
                  <Calendar size={13} /> Tanggal Masuk
                </span>
                <p className="font-bold text-[#173f78] truncate">{formatDate(current.createdAt)}</p>
              </div>
            </div>

            {/* Isi Aduan */}
            <div>
              <span className="text-xs font-bold tracking-wider text-slate-400 uppercase block mb-1.5">
                Isi Laporan / Aspirasi
              </span>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                {current.content}
              </div>
            </div>

            {/* Lampiran Bukti dengan Preview & Download */}
            <div>
              <span className="text-xs font-bold tracking-wider text-slate-400 uppercase block mb-1.5">
                Lampiran Bukti ({current.attachments?.length ?? current._count?.attachments ?? 0})
              </span>
              <div className="space-y-1.5">
                {current.attachments && current.attachments.length > 0 ? (
                  current.attachments.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-800 transition hover:border-[#1f4f8f]"
                    >
                      <button
                        type="button"
                        onClick={() => setPreviewAttachment(file)}
                        className="flex items-center gap-2 truncate text-left hover:text-[#1f4f8f] transition"
                        title="Klik untuk memperbesar / pratinjau lampiran"
                      >
                        <Paperclip size={14} className="text-[#1f4f8f] shrink-0" />
                        <span className="truncate">{file.originalName}</span>
                        <small className="font-normal text-slate-400">({formatBytes(file.size)})</small>
                      </button>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setPreviewAttachment(file)}
                          className="btn-secondary px-2.5 py-1 text-xs text-[#173f78]"
                        >
                          <Eye size={12} /> Lihat
                        </button>
                        <a
                          href={`/api/admin/complaints/attachments/${file.id}`}
                          download={file.originalName}
                          className="rounded-lg p-1 text-slate-400 hover:text-[#1f4f8f]"
                          title="Download berkas"
                        >
                          <Download size={15} />
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">Tidak ada lampiran berkas.</p>
                )}
              </div>
            </div>

            {/* Riwayat Penanganan */}
            {current.histories && current.histories.length > 0 && (
              <div>
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase block mb-2">
                  Riwayat Tindak Lanjut
                </span>
                <div className="space-y-2.5 rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                  {current.histories.map((h, idx) => (
                    <div key={h.id ?? idx} className="border-l-2 pl-3" style={{ borderColor: h.status.color }}>
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="font-bold text-xs text-[#173f78]">{h.status.name}</p>
                        <p className="text-[11px] text-slate-400">{formatDate(h.createdAt)}</p>
                      </div>
                      {h.publicNote && (
                        <p className="mt-1 text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                          {h.publicNote}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Form Cepat Perbarui Status */}
            <form onSubmit={handleUpdateStatus} className="rounded-2xl border border-[#d9e3f2] bg-[#f4f7fc] p-4 space-y-2.5">
              <span className="text-xs font-bold tracking-wider text-[#1f4f8f] uppercase block">
                Perbarui Status Aduan
              </span>
              <div className="flex flex-col gap-2">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="field py-2 text-xs font-bold text-[#173f78]"
                >
                  {statuses.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                <input
                  className="field py-2 text-xs"
                  placeholder="Catatan publik untuk pelapor (opsional)..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={updating}
                  className="btn-primary text-xs px-5 py-2"
                >
                  {updating ? "Menyimpan..." : "Simpan Status"}
                </button>
              </div>
            </form>
          </div>

          {/* Footer Modal */}
          <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50 px-6 py-3.5">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary px-5 py-2 text-xs font-bold text-[#173f78]"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>

      {/* Attachment Magnified Preview Lightbox */}
      <ComplaintAttachmentPreview
        attachment={previewAttachment}
        onClose={() => setPreviewAttachment(null)}
      />
    </>
  );
}
