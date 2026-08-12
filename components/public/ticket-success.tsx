"use client";

import Link from "next/link";
import { CheckCircle2, Copy } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";

export function TicketSuccess({ ticketCode }: { ticketCode: string }) {
  const { show } = useToast();
  async function copyTicket() {
    await navigator.clipboard.writeText(ticketCode);
    show("Kode tiket berhasil disalin.", "info");
  }

  return (
    <div className="surface p-8 text-center sm:p-12">
      <CheckCircle2 className="mx-auto text-emerald-600" size={54} />
      <h2 className="mt-5 text-2xl font-extrabold">Aduan berhasil dikirim</h2>
      <p className="mx-auto mt-2 max-w-md text-slate-500">
        Simpan kode berikut. Kode ini menjadi akses Anda untuk memantau aduan.
      </p>
      <button
        type="button"
        onClick={copyTicket}
        className="mx-auto mt-6 flex items-center gap-3 rounded-2xl bg-[#edf3fb] px-6 py-4 transition hover:-translate-y-1 hover:shadow-lg"
      >
        <strong className="font-mono text-xl tracking-wider text-[#1f4f8f]">
          {ticketCode}
        </strong>
        <Copy size={18} />
      </button>
      <Link href={`/lacak-aduan?ticket=${ticketCode}`} className="btn-primary mt-7">
        Lacak aduan sekarang
      </Link>
    </div>
  );
}
