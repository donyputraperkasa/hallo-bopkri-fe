import type { Metadata } from "next";
import { ComplaintForm } from "@/components/public/complaint-form";
import { PublicLayout } from "@/components/layout/public-layout";

export const metadata: Metadata = { title: "Kirim Aduan" };

export default function SendComplaintPage() {
  return (
    <PublicLayout>
      <section className="container py-12 sm:py-16">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Sampaikan suara Anda
          </h1>
          <p className="mt-3 text-slate-500">
            Data kontak bersifat opsional. Pastikan isi aduan cukup jelas agar
            dapat kami tindak lanjuti dengan tepat.
          </p>
        </div>
        <div className="mx-auto max-w-3xl"><ComplaintForm /></div>
      </section>
    </PublicLayout>
  );
}
