"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList, LoaderCircle, Mail, MailOpen } from "lucide-react";
import { api } from "@/lib/client-api";
import { useAuth } from "@/hooks/use-auth";
import { getTagStyle, BIDANG_TAGS } from "@/lib/constants";
import {
  getReadComplaintIds,
  getReadScope,
  subscribeReadComplaints,
} from "@/lib/read-complaints";
import type { ComplaintList as ListData } from "@/types/api";

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

  const bidang = user?.bidang ?? "";
  const tagInfo = BIDANG_TAGS.find((b) => b.value.toLowerCase() === bidang.toLowerCase());
  const BidangIcon = tagInfo?.icon;

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

  const total = data.meta.total;
  const pendingCount = data.data.filter((i) => !i.status.isFinal).length;
  const completedCount = data.data.filter((i) => i.status.isFinal).length;

  const stats = [
    {
      href: "/panel/manager/aduan",
      label: "Aduan Masuk",
      value: String(total),
      note: `Bidang ${tagInfo?.label ?? bidang ?? "Anda"}`,
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
      {/* Header Banner */}
      <section className="rounded-lg border border-[#dbe5f4] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-[#0f172a]">
                Portal Manajer {tagInfo?.label ?? bidang}
              </h2>
              {bidang && (
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${getTagStyle(bidang)}`}>
                  {BidangIcon && <BidangIcon size={12} />}
                  {tagInfo?.label ?? bidang}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-[#748299]">
              Daftar laporan aduan yang telah didisposisikan secara khusus oleh owner untuk bidang tugas Anda.
            </p>
          </div>

          <Link
            href="/panel/manager/aduan"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#0f2a4f] px-4 text-sm font-semibold text-white transition hover:bg-[#173b6b]"
          >
            <ClipboardList size={16} aria-hidden="true" />
            Buka Semua Aduan
          </Link>
        </div>
      </section>

      {/* Stat Grid */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="block rounded-lg border border-[#dbe5f4] bg-white p-4 shadow-sm transition sm:p-5 hover:-translate-y-0.5 hover:border-[#b6cce8] hover:shadow-md"
          >
            <p className="text-sm font-semibold text-[#748299]">{stat.label}</p>
            <p className="mt-3 text-2xl font-semibold sm:text-3xl text-[#172033]">
              {stat.value}
            </p>
            <p className="mt-2 text-xs text-[#8b98ad]">{stat.note}</p>
          </Link>
        ))}
      </section>

      {/* Recent Complaints Table/Card */}
      <section className="rounded-lg border border-[#dbe5f4] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#0f172a]">Aduan Terbaru Bidang Anda</h2>
            <p className="mt-1 text-sm text-[#748299]">
              10 laporan terbaru yang membutuhkan tindak lanjut.
            </p>
          </div>
          <Link
            href="/panel/manager/aduan"
            className="text-sm font-semibold text-[#0f2a4f] hover:underline"
          >
            Lihat Semua
          </Link>
        </div>

        <div className="mt-5 space-y-3">
          {data.data.length === 0 ? (
            <p className="py-8 text-center text-sm font-semibold text-[#748299]">
              Belum ada aduan yang dikirim ke bidang Anda.
            </p>
          ) : (
            data.data.slice(0, 5).map((item) => {
              const isUnread = !readIds.has(item.id);
              return (
                <Link
                  key={item.id}
                  href="/panel/manager/aduan"
                  className={[
                    "flex items-center justify-between rounded-lg border border-l-4 p-4 transition",
                    isUnread
                      ? "border-[#cfe0f5] border-l-[#2563eb] bg-[#eff6ff]/70 hover:bg-[#e5f0ff]/80"
                      : "border-[#dbe5f4] border-l-transparent bg-[#f8fbff] hover:border-[#b6cce8] hover:bg-white",
                  ].join(" ")}
                >
                  <div className="min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      {isUnread ? (
                        <Mail size={14} className="text-[#2563eb] shrink-0" />
                      ) : (
                        <MailOpen size={14} className="text-[#94a3b8] shrink-0" />
                      )}
                      <span
                        className={[
                          "font-mono text-xs",
                          isUnread ? "font-bold text-[#0f2a4f]" : "font-semibold text-[#1f4f8f]",
                        ].join(" ")}
                      >
                        {item.ticketCode}
                      </span>
                      {isUnread && (
                        <span className="inline-flex items-center rounded-full bg-[#2563eb] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                          Baru
                        </span>
                      )}
                    </div>
                    <p
                      className={[
                        "mt-1 truncate text-sm",
                        isUnread ? "font-bold text-[#0f172a]" : "font-medium text-[#475569]",
                      ].join(" ")}
                    >
                      {item.content}
                    </p>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: `${item.status.color}18`,
                      color: item.status.color,
                    }}
                  >
                    {item.status.name}
                  </span>
                </Link>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
