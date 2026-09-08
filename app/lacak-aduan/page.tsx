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
      <div className="hero-building min-h-[calc(100vh-160px)] py-10 sm:py-16 relative overflow-hidden text-white">
        {/* Ornamen dekoratif sudut: dot matrix kanan atas */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-8 right-8 hidden md:block opacity-20"
        >
          <div className="grid grid-cols-6 gap-3">
            {Array.from({ length: 30 }).map((_, i) => (
              <span key={i} className="size-1.5 rounded-full bg-white" />
            ))}
          </div>
        </div>

        {/* Ornamen cincin aksen emas kanan atas */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-20 right-16 hidden md:block size-14 rounded-full border-2 border-[#f2d35f]/30"
        />

        {/* Garis aksen emas horizontal di atas */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f2d35f]/50 to-transparent"
        />

        <section className="container relative z-10">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="inline-flex items-center rounded-md bg-[#f2d35f] px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[#2d2a16] shadow-xs">
              Pelacakan Status & Tindak Lanjut
            </span>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Lacak Progres Aduan Anda
            </h1>

            <p className="mt-3 text-sm sm:text-base leading-relaxed text-blue-50/90 font-normal">
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
