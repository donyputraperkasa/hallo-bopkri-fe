"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Inbox, LoaderCircle, Sparkles } from "lucide-react";
import { api } from "@/lib/client-api";
import { categoryLabel } from "@/lib/constants";
import type { Dashboard } from "@/types/api";

export function DashboardView() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Dashboard>("/api/admin/complaints/dashboard").then(setData).catch((reason) => {
      setError(reason.message);
    });
  }, []);

  if (error) return <p className="error-box">{error}</p>;
  if (!data) return <LoaderCircle className="animate-spin text-[#1f4f8f]" />;

  return (
    <div>
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#173f78] via-[#1f4f8f] to-[#29328f] p-6 text-white shadow-xl shadow-[#1f4f8f]/15 sm:p-8">
        <span className="absolute -top-20 -right-10 size-64 rounded-full border-36 border-white/5" />
        <div className="relative flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#f2d35f] uppercase">
              <Sparkles size={15} /> Ringkasan terkini
            </p>
            <h1 className="mt-3 text-3xl font-extrabold">Selamat datang di panel admin</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
              Pantau laporan, tindak lanjuti setiap suara, dan kelola status dari satu tempat.
            </p>
          </div>
          <Link href="/masdon/aduan" className="btn-secondary border-white/20 bg-white text-[#173f78]">
            Lihat seluruh aduan <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="surface interactive-card p-5">
          <span className="grid size-11 place-items-center rounded-2xl bg-[#eaf1fb] text-[#1f4f8f]">
            <Inbox size={21} />
          </span>
          <p className="mt-5 text-3xl font-extrabold text-[#173f78]">{data.total}</p>
          <p className="text-sm font-semibold text-slate-500">Total aduan</p>
        </article>
        {data.byCategory.map((item, index) => (
          <article key={item.category} className="surface interactive-card relative overflow-hidden p-5">
            <span className={`absolute inset-x-0 top-0 h-1 ${index === 1 ? "bg-[#f2d35f]" : index === 2 ? "bg-[#29328f]" : "bg-[#1f4f8f]"}`} />
            <p className="text-sm font-bold text-slate-500">{categoryLabel(item.category)}</p>
            <p className="mt-5 text-3xl font-extrabold text-[#173f78]">{item._count}</p>
            <p className="text-sm text-slate-400">Laporan masuk</p>
          </article>
        ))}
      </section>
      <section className="surface mt-6 p-6">
        <div>
          <p className="text-xs font-bold tracking-wider text-[#b48700] uppercase">Monitoring</p>
          <h2 className="mt-1 text-xl font-extrabold">Distribusi status aduan</h2>
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
