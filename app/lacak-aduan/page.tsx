import type { Metadata } from "next";
import { PublicLayout } from "@/components/layout/public-layout";
import { TrackingForm } from "@/components/public/tracking-form";
import { SearchCheck, ShieldCheck } from "lucide-react";

export const metadata: Metadata = { title: "Lacak Aduan - Hallo BOPKRI" };

export default async function TrackComplaintPage({
  searchParams,
}: {
  searchParams: Promise<{ ticket?: string }>;
}) {
  const { ticket } = await searchParams;
  return (
    <PublicLayout>
      <div className="classic-backdrop min-h-[calc(100vh-160px)] py-10 sm:py-16 relative overflow-hidden">
        {/* Decorative Classic Background Elements */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-gradient-to-b from-[#1f4f8f]/8 via-[#f2d35f]/5 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute top-40 -right-20 size-72 rounded-full bg-[#1f4f8f]/5 blur-2xl" />
        <div className="pointer-events-none absolute bottom-20 -left-20 size-80 rounded-full bg-[#f2d35f]/10 blur-2xl" />

        {/* Vintage subtle watermark emblem */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.025] select-none">
          <ShieldCheck className="size-[580px] text-[#1f4f8f]" />
        </div>

        <section className="container relative z-10">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#1f4f8f]/20 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#1f4f8f] shadow-xs backdrop-blur-xs">
              <SearchCheck size={14} className="text-[#1f4f8f]" />
              Pelacakan Status & Tindak Lanjut
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
              Lacak Progres Aduan Anda
            </h1>

            <div className="mx-auto my-3 flex items-center justify-center gap-2">
              <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#1f4f8f]/30" />
              <span className="size-1.5 rounded-full bg-[#f2d35f]" />
              <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#1f4f8f]/30" />
            </div>

            <p className="mt-2 text-sm sm:text-base leading-relaxed text-stone-600">
              Masukkan kode e-tiket resmi yang Anda peroleh saat mengirimkan laporan untuk melihat catatan dan tahapan penanganan oleh tim BOPKRI.
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <TrackingForm initialTicket={ticket} />
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
