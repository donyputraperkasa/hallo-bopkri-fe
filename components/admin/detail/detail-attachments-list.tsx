"use client";

import { Download, Eye, Paperclip } from "lucide-react";
import { formatBytes } from "@/lib/constants";
import type { Attachment } from "@/types/api";

interface DetailAttachmentsListProps {
  attachments?: Attachment[];
  attachmentCount?: number;
  onPreview: (att: Attachment) => void;
}

export function DetailAttachmentsList({
  attachments,
  attachmentCount = 0,
  onPreview,
}: DetailAttachmentsListProps) {
  const count = attachments?.length ?? attachmentCount;

  return (
    <div>
      <span className="text-xs font-semibold tracking-wider text-[#748299] uppercase block mb-1.5">
        Lampiran Bukti ({count})
      </span>
      <div className="space-y-1.5">
        {attachments && attachments.length > 0 ? (
          attachments.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between rounded-lg border border-[#dbe5f4] bg-white p-3 text-xs font-semibold text-[#172033] transition hover:border-[#b6cce8]"
            >
              <button
                type="button"
                onClick={() => onPreview(file)}
                className="flex items-center gap-2 truncate text-left hover:text-[#0f2a4f] transition"
                title="Klik untuk melihat pratinjau lampiran"
              >
                <Paperclip size={14} className="text-[#0f2a4f] shrink-0" />
                <span className="truncate">{file.originalName}</span>
                <small className="font-normal text-[#8b98ad]">
                  ({formatBytes(file.size)})
                </small>
              </button>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onPreview(file)}
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
  );
}
