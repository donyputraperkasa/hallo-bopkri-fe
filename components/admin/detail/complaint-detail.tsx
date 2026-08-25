"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { api } from "@/lib/client-api";
import type { Attachment, Complaint, ComplaintStatus } from "@/types/api";
import { useToast } from "@/components/ui/toast-provider";
import { StatusUpdateForm } from "../status/status-update-form";
import { ComplaintDispatchModal } from "../dispatch/complaint-dispatch-modal";
import { ComplaintMainCard } from "./complaint-main-card";
import { ComplaintBidangCard } from "./complaint-bidang-card";
import { DetailAttachmentsList } from "./detail-attachments-list";
import { DetailHistoriesList } from "./detail-histories-list";
import { ComplaintAttachmentPreview } from "./complaint-attachment-preview";

function getComplaintTags(item: Complaint): string[] {
  if (Array.isArray(item.tags) && item.tags.length > 0) return item.tags;
  const raw =
    (item as unknown as Record<string, unknown>).tags ??
    (item as unknown as Record<string, unknown>).tag;
  if (typeof raw === "string" && raw.trim()) {
    return raw.split(",").map((t) => t.trim()).filter(Boolean);
  }
  return [];
}

export function ComplaintDetail({ id }: { id: string }) {
  const { show } = useToast();
  const [item, setItem] = useState<Complaint | null>(null);
  const [statuses, setStatuses] = useState<ComplaintStatus[]>([]);
  const [error, setError] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [dispatchModalOpen, setDispatchModalOpen] = useState<boolean>(false);
  const [selectedBidangs, setSelectedBidangs] = useState<string[]>([]);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);

  const load = useCallback(async () => {
    try {
      const [complaint, statusData] = await Promise.all([
        api<Complaint>(`/api/admin/complaints/${id}`),
        api<ComplaintStatus[]>("/api/admin/complaint-statuses"),
      ]);
      setItem(complaint);
      const tags = getComplaintTags(complaint);
      setActiveTags(tags);
      setSelectedBidangs(tags.length > 0 ? tags : ["pendidikan"]);
      setStatuses(statusData);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Detail gagal dimuat.");
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleBidang = (val: string) => {
    setSelectedBidangs((prev) =>
      prev.includes(val) ? prev.filter((b) => b !== val) : [...prev, val]
    );
  };

  const handleQuickDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBidangs.length === 0) return;
    setIsDispatching(true);
    try {
      const users = await api<Array<{ id: string; role: string; bidang: string | null }>>(
        "/api/admin/complaints/users"
      );
      const matchingAdmins = users.filter(
        (u) => u.bidang && selectedBidangs.some((b) => b.toLowerCase() === u.bidang?.toLowerCase())
      );
      const adminIds = matchingAdmins.map((a) => a.id);

      if (adminIds.length > 0) {
        await api(`/api/admin/complaints/${id}/dispatch`, {
          method: "POST",
          body: JSON.stringify({ adminIds, adminId: adminIds[0] }),
        });
      }

      const newTags = Array.from(new Set([...activeTags, ...selectedBidangs]));
      setActiveTags(newTags);
      show(`Aduan berhasil dikirimkan ke ${selectedBidangs.length} bidang.`);
      void load();
    } catch {
      show("Gagal mengirimkan aduan ke bidang.", "error");
    } finally {
      setIsDispatching(false);
    }
  };

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoaderCircle className="size-8 animate-spin text-[#0f2a4f]" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Link
        href="/masdon/aduan"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f2a4f] hover:underline"
      >
        <ArrowLeft size={16} /> Kembali ke Daftar Aduan
      </Link>

      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <ComplaintMainCard
            item={item}
            activeTags={activeTags}
            onOpenDispatch={() => setDispatchModalOpen(true)}
          />

          <article className="rounded-lg border border-[#dbe5f4] bg-white p-6 shadow-sm">
            <DetailAttachmentsList
              attachments={item.attachments}
              attachmentCount={item._count?.attachments}
              onPreview={(file) => setPreviewAttachment(file)}
            />
          </article>

          <article className="rounded-lg border border-[#dbe5f4] bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-[#0f172a] mb-4">Riwayat Penanganan</h2>
            <DetailHistoriesList histories={item.histories} />
          </article>
        </div>

        <aside className="space-y-5">
          <ComplaintBidangCard
            selectedBidangs={selectedBidangs}
            isDispatching={isDispatching}
            onToggleBidang={toggleBidang}
            onSubmit={handleQuickDispatch}
            onOpenModal={() => setDispatchModalOpen(true)}
          />

          <StatusUpdateForm
            complaintId={item.id}
            currentId={item.status.id}
            statuses={statuses}
            onUpdated={load}
          />
        </aside>
      </div>

      <ComplaintDispatchModal
        item={dispatchModalOpen ? item : null}
        onClose={() => setDispatchModalOpen(false)}
        onDispatch={(_id, _adminIds, _bidangs) => {
          setDispatchModalOpen(false);
          void load();
        }}
      />

      <ComplaintAttachmentPreview
        attachment={previewAttachment}
        onClose={() => setPreviewAttachment(null)}
      />
    </div>
  );
}
