"use client";

import { FormEvent, useState } from "react";
import { Paperclip, Send } from "lucide-react";
import { readResponse } from "@/lib/client-api";
import { useToast } from "@/components/ui/toast-provider";
import type { Category } from "@/types/api";
import { CategoryPicker } from "./category-picker";
import { TicketSuccess } from "./ticket-success";
import { Tag } from "./complaint-tag";
import { ComplainNote } from "./complain-note";

export function ComplaintForm() {
  const { show } = useToast();
  const [category, setCategory] = useState<Category>("QUESTION");
  const [ticket, setTicket] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const form = new FormData(event.currentTarget);
      form.set("category", category);
      // Kolom opsional kosong dihapus agar validator BE menerimanya sebagai opsional.
      ["reporterName", "contact"].forEach((name) => {
        if (!String(form.get(name) ?? "").trim()) form.delete(name);
      });
      const files = form.getAll("attachments").filter((item) => item instanceof File && item.size);
      form.delete("attachments");
      files.forEach((file) => form.append("attachments", file));
      const result = await readResponse<{ ticketCode: string }>(
        await fetch("/api/public/complaints", { method: "POST", body: form }),
      );
      show("Aduan berhasil dikirim. Simpan kode tiket Anda.");
      setTicket(result.ticketCode);
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Aduan gagal dikirim.";
      setError(message);
      show(message, "error");
    } finally {
      setLoading(false);
    }
  }

  if (ticket) return <TicketSuccess ticketCode={ticket} />;

  return (
    <form onSubmit={submit} className="surface space-y-6 p-6 sm:p-8">
      <div>
        <label className="label">Kategori aduan *</label>
        <CategoryPicker value={category} onChange={setCategory} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label>
          <span className="label">Nama pelapor <small className="font-normal">(opsional)</small></span>
          <input className="field" name="reporterName" placeholder="Contoh: mas dondon" />
        </label>
        <label>
          <span className="label">Email / WhatsApp <small className="font-normal">(opsional)</small></span>
          <input className="field" name="contact" placeholder="email atau nomor WhatsApp" />
        </label>
      </div>

      <label>
        <span className="label">Isi aduan *</span>
        <textarea
          className="field min-h-40 resize-y"
          name="content"
          minLength={10}
          maxLength={5000}
          required
          placeholder="Ceritakan hal yang ingin Anda sampaikan secara jelas..."
        />
      </label>

      <div>
        <label className="label flex items-center justify-between">
          <span>Tag / Bidang Terkait <small className="font-normal text-slate-500">(opsional)</small></span>
        </label>
        <Tag />
      </div>

      <label className="block cursor-pointer rounded-2xl border border-dashed border-[#aebfbd] bg-[#f8faf9] p-5 transition hover:border-[#1f4f8f] hover:bg-[#f3f7fc]">
        <span className="flex items-center gap-2 font-bold"><Paperclip size={18} /> Lampirkan bukti</span>
        <span className="mt-1 block text-sm text-slate-500">
          Maks. 3 berkas JPG, PNG, atau PDF. Masing-masing maksimal 5 MB.
        </span>
        <input
          className="mt-3 block w-full text-sm"
          type="file"
          name="attachments"
          accept=".jpg,.jpeg,.png,.pdf"
          multiple
        />
      </label>
      {error && <p className="error-box">{error}</p>}
      <button disabled={loading} className="btn-primary w-full" type="submit">
        <Send size={18} /> {loading ? "Mengirim..." : "Kirim aduan"}
      </button>

      <ComplainNote />
    </form>
  );
}
