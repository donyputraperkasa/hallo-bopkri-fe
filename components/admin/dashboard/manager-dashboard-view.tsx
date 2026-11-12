"use client";

import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { api } from "@/lib/client-api";
import { useAuth } from "@/hooks/use-auth";
import { BIDANG_TAGS } from "@/lib/constants";
import {
  getReadComplaintIds,
  getReadScope,
  subscribeReadComplaints,
} from "@/lib/read-complaints";
import type { ComplaintList as ListData, ManagerStatItem } from "@/types";
import { ManagerHeaderBanner, ManagerStatGrid } from "./manager-stat-grid";
import { ManagerRecentComplaints } from "./manager-recent-complaints";

export function ManagerDashboardView() {
  const { user } = useAuth();
  const scope = getReadScope(user);
  const [data, setData] = useState<ListData | null>(null);
  const [error, setError] = useState("");
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    api<ListData>("/api/admin/complaints?page=1&limit=10")
      .then(setData)
      .catch((r) => setError(r.message));
  }, []);

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

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoaderCircle className="size-8 animate-spin text-[#0f2a4f]" />
      </div>
    );
  }

  const bidang = user?.bidang ?? "";
  const tagInfo = BIDANG_TAGS.find((b) => b.value.toLowerCase() === bidang.toLowerCase());
  const total = data.meta.total;
  const pendingCount = data.data.filter((i) => !i.status.isFinal).length;
  const completedCount = data.data.filter((i) => i.status.isFinal).length;

  const stats: ManagerStatItem[] = [
    {
      href: "/panel/manager/aduan",
      label: "Aduan Masuk",
      value: String(total),
      note: `Bidang ${tagInfo?.label ?? (bidang || "Anda")}`,
    },
    {
      href: "/panel/manager/aduan",
      label: "Belum Selesai",
      value: String(pendingCount),
      note: "Perlu tindak lanjut",
    },
    {
      href: "/panel/manager/aduan",
      label: "Telah Selesai",
      value: String(completedCount),
      note: "Laporan tuntas",
    },
  ];

  return (
    <div className="space-y-5">
      <ManagerHeaderBanner bidang={bidang} />
      <ManagerStatGrid stats={stats} />
      <ManagerRecentComplaints items={data.data} readIds={readIds} />
    </div>
  );
}
