"use client";

import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { api } from "@/lib/client-api";
import type { Attachment, Complaint, ComplaintStatus } from "@/types/api";
import { ComplaintAttachmentPreview } from "./complaint-attachment-preview";
import { DetailModalHeader } from "./detail-modal-header";
import { DetailTagsBar } from "./detail-tags-bar";
import { DetailReporterGrid } from "./detail-reporter-grid";
import { DetailAttachmentsList } from "./detail-attachments-list";
import { DetailHistoriesList } from "./detail-histories-list";
import { DetailQuickStatusForm } from "./detail-quick-status-form";

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
  const [fullItem, setFullItem] = useState<Complaint | null>(item);
  const [loading, setLoading] = useState<boolean>(false);
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);

  useEffect(() => {
    if (!item) return;
    setFullItem(item);
    setLoading(true);
    api<Complaint>(`/api/admin/complaints/${item.id}`)
      .then((res) => setFullItem(res))
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
          <DetailModalHeader current={current} onClose={onClose} />

          <div className="flex-1 overflow-y-auto p-6 space-y-4.5">
            {loading && !fullItem && (
              <div className="py-10 flex justify-center">
                <LoaderCircle className="size-6 animate-spin text-[#0f2a4f]" />
              </div>
            )}

            <DetailTagsBar
              tags={tags}
              current={current}
              readOnly={readOnly}
              onOpenDispatch={onOpenDispatch}
            />

            <DetailReporterGrid item={current} />

            <div>
              <span className="text-xs font-semibold tracking-wider text-[#748299] uppercase block mb-1.5">
                Isi Laporan / Aspirasi
              </span>
              <div className="rounded-lg border border-[#dbe5f4] bg-[#f8fbff]/60 p-4 text-sm leading-relaxed text-[#172033] whitespace-pre-wrap">
                {current.content}
              </div>
            </div>

            <DetailAttachmentsList
              attachments={current.attachments}
              attachmentCount={current._count?.attachments}
              onPreview={(file) => setPreviewAttachment(file)}
            />

            <DetailHistoriesList histories={current.histories} />

            {!readOnly && (
              <DetailQuickStatusForm
                complaintId={current.id}
                currentStatusId={current.status.id}
                statuses={statuses}
                onUpdated={(updated) => {
                  setFullItem(updated);
                  onStatusUpdated();
                }}
              />
            )}
          </div>

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

      <ComplaintAttachmentPreview
        attachment={previewAttachment}
        onClose={() => setPreviewAttachment(null)}
      />
    </>
  );
}
