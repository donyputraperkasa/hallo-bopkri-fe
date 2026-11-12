"use client";

import { useEffect, useState } from "react";
import { Inbox, LoaderCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  getReadComplaintIds,
  getReadScope,
  markAllComplaintsAsRead,
  markComplaintAsRead,
  subscribeReadComplaints,
  toggleComplaintRead,
} from "@/lib/read-complaints";
import type { ComplaintTableProps } from "@/types";
import { ComplaintReadBar } from "./complaint-read-bar";
import { ComplaintTableRow, getRowTags } from "./complaint-table-row";

export function ComplaintTable({
  data,
  loading,
  overrides,
  onOpenDetail,
  onOpenDispatch,
  readOnly = false,
}: ComplaintTableProps) {
  const { user } = useAuth();
  const scope = getReadScope(user);
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setReadIds(getReadComplaintIds(scope));
    });
    const unsubscribe = subscribeReadComplaints(() => {
      setReadIds(getReadComplaintIds(scope));
    });
    return () => {
      cancelAnimationFrame(frameId);
      unsubscribe();
    };
  }, [scope]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <LoaderCircle className="size-8 animate-spin text-[#0f2a4f]" />
        <p className="text-sm font-medium text-[#748299]">Memuat data aduan...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-[#eef4fb] text-[#748299]">
          <Inbox size={24} />
        </div>
        <h3 className="mt-3 text-base font-semibold text-[#0f172a]">Tidak ada aduan</h3>
        <p className="mx-auto mt-1 max-w-sm text-xs text-[#748299]">
          Belum ada aduan yang sesuai dengan kriteria pencarian ini.
        </p>
      </div>
    );
  }

  const unreadCount = data.filter((item) => !readIds.has(item.id)).length;

  return (
    <div>
      <ComplaintReadBar
        unreadCount={unreadCount}
        readCount={data.length - unreadCount}
        onMarkAllRead={() => markAllComplaintsAsRead(data.map((i) => i.id), scope)}
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-[#dbe5f4] bg-[#f8fbff] text-xs font-semibold text-[#748299]">
            <tr>
              <th className="px-5 py-3.5">KODE TIKET</th>
              <th className="px-5 py-3.5">KATEGORI</th>
              <th className="px-5 py-3.5">BIDANG SASARAN</th>
              <th className="px-5 py-3.5">STATUS</th>
              <th className="px-5 py-3.5">TANGGAL MASUK</th>
              <th className="px-5 py-3.5 text-right">AKSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eef3fb]">
            {data.map((item) => (
              <ComplaintTableRow
                key={item.id}
                item={item}
                tags={overrides[item.id] ?? getRowTags(item)}
                isUnread={!readIds.has(item.id)}
                readOnly={readOnly}
                onToggleRead={() => toggleComplaintRead(item.id, scope)}
                onOpenDetail={() => {
                  markComplaintAsRead(item.id, scope);
                  onOpenDetail(item);
                }}
                onOpenDispatch={() => {
                  markComplaintAsRead(item.id, scope);
                  onOpenDispatch(item);
                }}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
