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
  readOnly = false,
}: {
  item: Complaint | null;
  statuses: ComplaintStatus[];
  onClose: () => void;
  onOpenDispatch: (complaint: Complaint) => void;
  onStatusUpdated: () => void;
  readOnly?: boolean;
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
        className="fixed inset-0 z-50 grid place-items-center bg-[#071529]/55 p-4 backdrop-blur-sm modal-backdrop-enter overflow-y-auto"
      >
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl border border-[#dbe5f4] bg-white shadow-2xl overflow-hidden modal-panel-enter my-auto"
        >
          {/* Header Modal */}
          <div className="flex items-center justify-between border-b border-[#dbe5f4] bg-[#f8fbff] px-6 py-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm sm:text-base font-semibold text-[#1f4f8f]">
                  {current.ticketCode}
                </span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{
                    color: current.status.color,
                    backgroundColor: `${current.status.color}18`,
                  }}
                >
                  {current.status.name}
                </span>
              </div>
              <h3 className="mt-0.5 text-lg font-semibold text-[#0f172a]">
                {categoryLabel(current.category)}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1.5 text-[#748299] hover:bg-[#eef4fb] hover:text-[#0f2a4f] transition"
              title="Tutup (Esc)"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4.5">
            {loading && !fullItem && (
              <div className="py-10 flex justify-center">
                <LoaderCircle className="size-6 animate-spin text-[#0f2a4f]" />
              </div>
            )}

            {/* Tag / Bidang Sasaran */}
            <div>
              <span className="text-xs font-semibold tracking-wider text-[#748299] uppercase block mb-1.5">
                Bidang Sasaran
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {tags.length === 0 ? (
                  <span className="text-xs text-[#8b98ad] italic">Belum ditentukan bidang</span>
                ) : (
                  tags.map((t) => {
                    const tagInfo = BIDANG_TAGS.find((b) => b.value === t);
                    const TagItemIcon = tagInfo?.icon;
                    return (
                      <span
                        key={t}
                        className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold ${getTagStyle(
                          t
                        )}`}
                      >
                        {TagItemIcon && <TagItemIcon size={13} />}
                        <span>{tagInfo?.label ?? t}</span>
                      </span>
                    );
                  })
                )}
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => onOpenDispatch(current)}
                    className="inline-flex items-center gap-1 rounded-md border border-dashed border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100 ml-1 transition"
                  >
                    <SendHorizontal size={12} />
                    <span>+ Disposisikan Bidang</span>
                  </button>
                )}
              </div>
            </div>

            {/* Info Pelapor */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-lg border border-[#dbe5f4] bg-[#f8fbff] p-4 text-xs">
              <div>
                <span className="text-[#748299] flex items-center gap-1 font-medium mb-0.5">
                  <User size={13} /> Pelapor
                </span>
                <p className="font-semibold text-[#172033] truncate">{current.reporterName || "Anonim"}</p>
              </div>
              <div>
                <span className="text-[#748299] flex items-center gap-1 font-medium mb-0.5">
                  <Phone size={13} /> Kontak
                </span>
                <p className="font-semibold text-[#172033] truncate">{current.contact || "-"}</p>
              </div>
              <div>
                <span className="text-[#748299] flex items-center gap-1 font-medium mb-0.5">
                  <Calendar size={13} /> Tanggal Masuk
                </span>
                <p className="font-semibold text-[#172033] truncate">{formatDate(current.createdAt)}</p>
              </div>
            </div>

            {/* Isi Aduan */}
            <div>
              <span className="text-xs font-semibold tracking-wider text-[#748299] uppercase block mb-1.5">
                Isi Laporan / Aspirasi
              </span>
              <div className="rounded-lg border border-[#dbe5f4] bg-[#f8fbff]/60 p-4 text-sm leading-relaxed text-[#172033] whitespace-pre-wrap">
                {current.content}
              </div>
            </div>

            {/* Lampiran Bukti */}
            <div>
              <span className="text-xs font-semibold tracking-wider text-[#748299] uppercase block mb-1.5">
                Lampiran Bukti ({current.attachments?.length ?? current._count?.attachments ?? 0})
              </span>
              <div className="space-y-1.5">
                {current.attachments && current.attachments.length > 0 ? (
                  current.attachments.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between rounded-lg border border-[#dbe5f4] bg-white p-3 text-xs font-semibold text-[#172033] transition hover:border-[#b6cce8]"
                    >
                      <button
                        type="button"
                        onClick={() => setPreviewAttachment(file)}
                        className="flex items-center gap-2 truncate text-left hover:text-[#0f2a4f] transition"
                        title="Klik untuk melihat pratinjau lampiran"
                      >
                        <Paperclip size={14} className="text-[#0f2a4f] shrink-0" />
                        <span className="truncate">{file.originalName}</span>
                        <small className="font-normal text-[#8b98ad]">({formatBytes(file.size)})</small>
                      </button>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setPreviewAttachment(file)}
                          className="rounded-md border border-[#cfe0f5] bg-[#eaf2ff] px-2.5 py-1 text-xs font-semibold text-[#0f2a4f] hover:bg-[#dbeafe] transition"
                        >
                          <Eye size={12} /> Lihat
                        </button>
                        <a
                          href={`/api/admin/complaints/attachments/${file.id}`}
                          download={file.originalName}
                          className="rounded-md p-1 text-[#748299] hover:text-[#0f2a4f]"
                          title="Download berkas"
                        >
                          <Download size={15} />
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#8b98ad] italic">Tidak ada lampiran berkas.</p>
                )}
              </div>
            </div>

            {/* Riwayat Penanganan */}
            {current.histories && current.histories.length > 0 && (
              <div>
                <span className="text-xs font-semibold tracking-wider text-[#748299] uppercase block mb-2">
                  Riwayat Tindak Lanjut
                </span>
                <div className="space-y-2.5 rounded-lg border border-[#dbe5f4] bg-[#f8fbff] p-3.5">
                  {current.histories.map((h, idx) => (
                    <div key={h.id ?? idx} className="border-l-2 pl-3" style={{ borderColor: h.status.color }}>
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="font-semibold text-xs text-[#0f172a]">{h.status.name}</p>
                        <p className="text-[11px] text-[#748299]">{formatDate(h.createdAt)}</p>
                      </div>
                      {h.publicNote && (
                        <p className="mt-1 text-xs text-[#526078] bg-white p-2.5 rounded-md border border-[#dbe5f4]">
                          {h.publicNote}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Form Cepat Perbarui Status */}
            {!readOnly && (
              <form onSubmit={handleUpdateStatus} className="rounded-lg border border-[#dbe5f4] bg-[#f8fbff] p-4 space-y-2.5">
                <span className="text-xs font-semibold tracking-wider text-[#0f2a4f] uppercase block">
                  Perbarui Status Aduan
                </span>
                <div className="flex flex-col gap-2">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="h-10 rounded-md border border-[#dbe5f4] bg-white px-3 text-xs font-semibold text-[#172033] outline-none"
                  >
                    {statuses.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>

                  <input
                    className="h-10 rounded-md border border-[#dbe5f4] bg-white px-3 text-xs text-[#172033] outline-none placeholder:text-[#8b98ad]"
                    placeholder="Catatan publik untuk pelapor (opsional)..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={updating}
                    className="inline-flex h-9 items-center justify-center rounded-md bg-[#0f2a4f] px-4 text-xs font-semibold text-white transition hover:bg-[#173b6b] disabled:opacity-50"
                  >
                    {updating ? "Menyimpan..." : "Simpan Status"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer Modal */}
          <div className="flex items-center justify-end border-t border-[#dbe5f4] bg-[#f8fbff] px-6 py-3.5">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 items-center justify-center rounded-md border border-[#dbe5f4] bg-white px-5 text-xs font-semibold text-[#0f2a4f] hover:bg-[#eef4fb] transition"
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
