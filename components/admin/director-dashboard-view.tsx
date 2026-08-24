"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, Inbox, LoaderCircle, Sparkles } from "lucide-react";
import { api } from "@/lib/client-api";
import { categoryLabel } from "@/lib/constants";
import { useAuth } from "@/hooks/use-auth";
import type { Dashboard } from "@/types/api";

export function DirectorDashboardView() {
  const { user } = useAuth();
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Dashboard>("/api/admin/complaints/dashboard")
      .then(setData)
      .catch((r) => setError(r.message));
  }, []);

  if (error) return <p className="error-box">{error}</p>;
  if (!data) return <LoaderCircle className="animate-spin text-[#1f4f8f]" />;

  return (
    <div>
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0f1c4d] via-[#1e2d6b] to-[#2d4ba0] p-6 text-white shadow-xl sm:p-8">
        <span className="absolute -top-20 -right-10 size-64 rounded-full border-36 border-white/5" />
        <div className="relative flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#d4c97a] uppercase">
              <Sparkles size={15} /> Director Overview
            </p>
            <h1 className="mt-3 text-3xl font-extrabold">
              Selamat datang, {user?.displayName ?? "Direktur"}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
              Pantau semua aduan yang masuk ke sistem Hallo BOPKRI secara real-time.
            </p>
          </div>
          <Link href="/masdon/director/aduan" className="btn-secondary border-white/20 bg-white text-[#1e2d6b]">
            Lihat semua aduan <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="surface interactive-card p-5">
          <span className="grid size-11 place-items-center rounded-2xl bg-sky-100 text-sky-700">
            <Inbox size={21} />
          </span>
          <p className="mt-5 text-3xl font-extrabold text-[#173f78]">{data.total}</p>
          <p className="text-sm font-semibold text-slate-500">Total aduan masuk</p>
        </article>
        {data.byCategory.map((item, index) => (
          <article key={item.category} className="surface interactive-card relative overflow-hidden p-5">
            <span className={`absolute inset-x-0 top-0 h-1 ${index === 0 ? "bg-sky-400" : index === 1 ? "bg-[#f2d35f]" : "bg-[#29328f]"}`} />
            <p className="text-sm font-bold text-slate-500">{categoryLabel(item.category)}</p>
            <p className="mt-5 text-3xl font-extrabold text-[#173f78]">{item._count}</p>
            <p className="text-sm text-slate-400">Laporan masuk</p>
          </article>
        ))}
      </section>

      <section className="surface mt-6 p-6">
        <div className="flex items-center gap-2">
          <Briefcase size={18} className="text-sky-600" />
          <div>
            <p className="text-xs font-bold tracking-wider text-sky-600 uppercase">Monitoring</p>
            <h2 className="mt-0.5 text-xl font-extrabold">Distribusi status aduan</h2>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {data.byStatus.map((item) => (
            <div key={item.status.id} className="interactive-card flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <span className="flex items-center gap-2 text-sm font-bold">
                <i className="size-2.5 rounded-full shadow-sm" style={{ background: item.status.color }} />
                {item.status.name}
              </span>
              <strong className="grid size-8 place-items-center rounded-full bg-white text-sm shadow-sm">{item.count}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
