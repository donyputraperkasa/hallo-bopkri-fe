import type { Metadata } from "next";
import { PublicLayout } from "@/components/layout/public-layout";
import { TrackingForm } from "@/components/public/tracking-form";

export const metadata: Metadata = { title: "Lacak Tiket" };

export default async function TrackComplaintPage({
  searchParams,
}: {
  searchParams: Promise<{ ticket?: string }>;
}) {
  const { ticket } = await searchParams;
  return (
    <PublicLayout>
      <section className="container py-12 sm:py-16">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <span className="eyebrow">Pantau tindak lanjut</span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Lacak status aduan
          </h1>
          <p className="mt-3 text-slate-500">
            Masukkan kode e-tiket yang diterima setelah pengiriman aduan.
          </p>
        </div>
        <div className="mx-auto max-w-3xl">
          <TrackingForm initialTicket={ticket} />
        </div>
      </section>
    </PublicLayout>
  );
}
