"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Inbox, LoaderCircle, Users } from "lucide-react";
import { api } from "@/lib/client-api";
import { useAuth } from "@/hooks/use-auth";
import { getTagStyle, BIDANG_TAGS } from "@/lib/constants";
import type { ComplaintList as ListData } from "@/types/api";

export function ManagerDashboardView() {
  const { user } = useAuth();
  const [data, setData] = useState<ListData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<ListData>("/api/admin/complaints?page=1&limit=10")
      .then(setData)
      .catch((r) => setError(r.message));
  }, []);

  const bidang = user?.bidang ?? "";
  const tagInfo = BIDANG_TAGS.find((b) => b.value.toLowerCase() === bidang.toLowerCase());
  const BidangIcon = tagInfo?.icon;

  if (error) return <p className="error-box">{error}</p>;
  if (!data) return <LoaderCircle className="animate-spin text-[#1f4f8f]" />;

  const total = data.meta.total;

  return (
    <div>
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1a3a2a] via-[#1e5c3a] to-[#1a6b44] p-6 text-white shadow-xl sm:p-8">
        <span className="absolute -top-20 -right-10 size-64 rounded-full border-36 border-white/5" />
        <div className="relative flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold tracking-widest text-emerald-200 uppercase">
              <Users size={15} /> Manager Portal
            </p>
            <h1 className="mt-3 text-3xl font-extrabold">
              Selamat datang, {user?.displayName ?? "Manajer"}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-100">
              Aduan di bawah ini telah didisposisikan langsung oleh owner kepada Anda.
            </p>
            {bidang && (
              <span className={`mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${getTagStyle(bidang)} opacity-90`}>
                {BidangIcon && <BidangIcon size={12} />}
                Bidang: {tagInfo?.label ?? bidang}
              </span>
            )}
          </div>
          <Link href="/masdon/manager/aduan" className="btn-secondary border-white/20 bg-white text-emerald-800">
            Lihat aduan saya <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <section className="mt-7 grid gap-4 sm:grid-cols-3">
        <article className="surface interactive-card p-5">
          <span className="grid size-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Inbox size={21} />
          </span>
          <p className="mt-5 text-3xl font-extrabold text-[#173f78]">{total}</p>
          <p className="text-sm font-semibold text-slate-500">Aduan dikirim ke saya</p>
        </article>
        <article className="surface interactive-card p-5">
          <span className="grid size-11 place-items-center rounded-2xl bg-amber-100 text-amber-700">
            <Inbox size={21} />
          </span>
          <p className="mt-5 text-3xl font-extrabold text-[#173f78]">
            {data.data.filter((i) => !i.status.isFinal).length}
          </p>
          <p className="text-sm font-semibold text-slate-500">Belum selesai</p>
        </article>
        <article className="surface interactive-card p-5">
          <span className="grid size-11 place-items-center rounded-2xl bg-green-100 text-green-700">
            <Inbox size={21} />
          </span>
          <p className="mt-5 text-3xl font-extrabold text-[#173f78]">
            {data.data.filter((i) => i.status.isFinal).length}
          </p>
          <p className="text-sm font-semibold text-slate-500">Sudah selesai</p>
        </article>
      </section>

      <section className="surface mt-6 p-6">
        <h2 className="text-xl font-extrabold text-stone-800">Aduan Terbaru</h2>
        <p className="mt-1 text-sm text-stone-500">10 aduan terbaru yang masuk ke bidang Anda.</p>
        <div className="mt-4 space-y-3">
          {data.data.length === 0 && (
            <p className="text-sm text-stone-400 text-center py-6">Belum ada aduan yang dikirim ke Anda.</p>
          )}
          {data.data.slice(0, 5).map((item) => (
            <div key={item.id} className="interactive-card flex items-center justify-between rounded-2xl border border-stone-100 bg-stone-50 p-4">
              <div>
                <p className="font-mono text-xs text-stone-500">{item.ticketCode}</p>
                <p className="mt-0.5 text-sm font-semibold text-stone-800 line-clamp-1">{item.content}</p>
              </div>
              <span className="ml-3 shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-bold" style={{ borderColor: item.status.color, color: item.status.color }}>
                {item.status.name}
              </span>
            </div>
          ))}
        </div>
        {data.data.length > 0 && (
          <div className="mt-4 text-center">
            <Link href="/masdon/manager/aduan" className="btn-secondary text-sm">
              Lihat semua <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
