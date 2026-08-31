"use client";

import { FormEvent, useState } from "react";
import { Paperclip, Send } from "lucide-react";
import { readResponse } from "@/lib/client-api";
import { useToast } from "@/components/ui/toast-provider";
import type { Category } from "@/types/api";
import { CategoryPicker } from "./category-picker";
import { TicketSuccess, type SubmittedComplaintDetails } from "./ticket-success";
import { Tag } from "./complaint-tag";
import { ComplainNote } from "./complain-note";

export function ComplaintForm() {
  const { show } = useToast();
  const [category, setCategory] = useState<Category>("QUESTION");
  const [ticket, setTicket] = useState("");
  const [submittedDetails, setSubmittedDetails] = useState<SubmittedComplaintDetails | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const form = new FormData(event.currentTarget);
      form.set("category", category);
      
      const reporterName = String(form.get("reporterName") ?? "").trim();
      const contact = String(form.get("contact") ?? "").trim();
      const content = String(form.get("content") ?? "").trim();

      // Kolom opsional kosong dihapus agar validator BE menerimanya sebagai opsional.
      ["reporterName", "contact"].forEach((name) => {
        if (!String(form.get(name) ?? "").trim()) form.delete(name);
      });

      // Tag: ambil nilai dari hidden input 'tags' (comma-separated) yang dibuat oleh Tag component,
      // lalu hapus input individual 'tag' agar tidak memicu forbidNonWhitelisted backend.
      const tagsValue = String(form.get("tags") ?? "").trim();
      form.delete("tag");   // hapus semua input name="tag" (individual hidden inputs)
      form.delete("tags");  // hapus lalu re-set sebagai single value
      if (tagsValue) form.set("tags", tagsValue);
      const files = form.getAll("attachments").filter((item) => item instanceof File && item.size);
      form.delete("attachments");
      files.forEach((file) => form.append("attachments", file));
      
      const result = await readResponse<{ ticketCode: string }>(
        await fetch("/api/public/complaints", { method: "POST", body: form }),
      );

      const detailsObj: SubmittedComplaintDetails = {
        category,
        content,
        reporterName: reporterName || undefined,
        contact: contact || undefined,
        tags: tagsValue ? tagsValue.split(",").map((t) => t.trim()).filter(Boolean) : undefined,
        attachmentsCount: files.length,
      };
      
      setSubmittedDetails(detailsObj);

      // Simpan di local storage agar pelapor di perangkat ini bisa langsung melihat isi aduannya
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            `hallo_complaint_${result.ticketCode}`,
            JSON.stringify(detailsObj)
          );
        } catch {
          // Ignore storage quota
        }
      }

      setTicket(result.ticketCode);
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Aduan gagal dikirim.";
      setError(message);
      show(message, "error");
    } finally {
      setLoading(false);
    }
  }

  if (ticket) return <TicketSuccess ticketCode={ticket} details={submittedDetails ?? undefined} />;

  return (
    <form onSubmit={submit} className="surface space-y-6 p-6 sm:p-8">
      <div>
        <label className="label text-stone-800 font-bold">Kategori aduan *</label>
        <CategoryPicker value={category} onChange={setCategory} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label>
          <span className="label text-stone-800 font-bold">
            Nama pelapor <small className="font-normal text-stone-500">(opsional)</small>
          </span>
          <input
            className="field placeholder:text-stone-400 text-stone-900"
            name="reporterName"
            placeholder="Contoh: Bpk. Bambang / Ibu Siti"
          />
        </label>
        <label>
          <span className="label text-stone-800 font-bold">
            Email / WhatsApp <small className="font-normal text-stone-500">(opsional)</small>
          </span>
          <input
            className="field placeholder:text-stone-400 text-stone-900"
            name="contact"
            placeholder="email@domain.com atau 0812xxxx"
          />
        </label>
      </div>

      <label>
        <span className="label text-stone-800 font-bold">Isi aduan *</span>
        <textarea
          className="field min-h-40 resize-y placeholder:text-stone-400 text-stone-900"
          name="content"
          minLength={10}
          maxLength={5000}
          required
          placeholder="Ceritakan hal yang ingin Anda sampaikan secara jelas..."
        />
      </label>

      <div>
        <label className="label flex items-center justify-between text-stone-800 font-bold">
          <span>Tag / Bidang Terkait <small className="font-normal text-stone-500">(opsional)</small></span>
        </label>
        <Tag />
      </div>

      <label className="block cursor-pointer rounded-2xl border border-dashed border-stone-300 bg-[#fbfcfd] p-5 transition hover:border-[#1f4f8f] hover:bg-[#f3f7fc]">
        <span className="flex items-center gap-2 font-bold text-stone-800">
          <Paperclip size={18} className="text-[#1f4f8f]" /> Lampirkan bukti
        </span>
        <span className="mt-1 block text-sm text-stone-600">
          Maks. 3 berkas JPG, PNG, atau PDF. Masing-masing maksimal 5 MB.
        </span>
        <input
          className="mt-3 block w-full text-sm text-stone-700 file:mr-3 file:cursor-pointer file:rounded-xl file:border file:border-[#d8e3f4] file:bg-[#eef4fb] file:px-3.5 file:py-1.5 file:text-xs file:font-bold file:text-[#1f4f8f] hover:file:bg-[#1f4f8f] hover:file:text-white file:transition-colors"
          type="file"
          name="attachments"
          accept=".jpg,.jpeg,.png,.pdf"
          multiple
        />
      </label>
      {error && <p className="error-box">{error}</p>}
      <button disabled={loading} className="btn-primary w-full shadow-md cursor-pointer" type="submit">
        <Send size={18} /> {loading ? "Mengirim..." : "Kirim aduan"}
      </button>

      <ComplainNote />
    </form>
  );
}
