"use client";

import { FormEvent, useState, useMemo } from "react";
import { readResponse } from "@/lib/client-api";
import { useToast } from "@/components/ui/toast-provider";
import { saveSessionTicket } from "@/lib/client-tickets";
import type { Category } from "@/types/api";
import { ComplaintFields } from "./complaint-fields";
import { ComplaintPreview, type PreviewFileItem } from "./complaint-preview";
import { TicketSuccess, type SubmittedComplaintDetails } from "./ticket-success";

export function ComplaintForm() {
  const { show } = useToast();
  const [step, setStep] = useState<"form" | "preview">("form");
  const [category, setCategory] = useState<Category>("QUESTION");
  const [reporterName, setReporterName] = useState("");
  const [contact, setContact] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [ticket, setTicket] = useState("");
  const [submittedDetails, setSubmittedDetails] = useState<SubmittedComplaintDetails | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const filePreviews: PreviewFileItem[] = useMemo(() => {
    return files.map((file) => {
      const isImage = file.type.startsWith("image/") || /\.(jpg|jpeg|png|webp)$/i.test(file.name);
      return {
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        isImage,
        url: isImage ? URL.createObjectURL(file) : undefined,
      };
    });
  }, [files]);

  const handleProceedToPreview = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!content.trim() || content.trim().length < 10) {
      setError("Isi aduan minimal terdiri dari 10 karakter.");
      return;
    }
    setStep("preview");
  };

  const handleFinalSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const form = new FormData();
      form.set("category", category);
      form.set("content", content.trim());
      if (reporterName.trim()) form.set("reporterName", reporterName.trim());
      if (contact.trim()) form.set("contact", contact.trim());
      if (selectedTags.length > 0) form.set("tags", selectedTags.join(","));
      files.forEach((file) => form.append("attachments", file));

      const result = await readResponse<{ ticketCode: string }>(
        await fetch("/api/public/complaints", { method: "POST", body: form }),
      );

      const detailsObj: SubmittedComplaintDetails = {
        category,
        content: content.trim(),
        reporterName: reporterName.trim() || undefined,
        contact: contact.trim() || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        attachmentsCount: files.length,
        files: filePreviews.map((fp) => ({ name: fp.name, size: fp.size, type: fp.type, url: fp.url })),
      };

      setSubmittedDetails(detailsObj);

      // Simpan hanya nomor tiket dan kategori ke sessionStorage sementara (tanpa teks isi aduan)
      saveSessionTicket({
        ticketCode: result.ticketCode,
        category,
        createdAt: new Date().toISOString(),
      });

      show("Aduan berhasil dikirim. Simpan kode tiket Anda.");
      setTicket(result.ticketCode);
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Aduan gagal dikirim.";
      setError(message);
      show(message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (ticket) return <TicketSuccess ticketCode={ticket} details={submittedDetails ?? undefined} />;

  if (step === "preview") {
    return (
      <ComplaintPreview
        category={category}
        reporterName={reporterName}
        contact={contact}
        content={content}
        selectedTags={selectedTags}
        filePreviews={filePreviews}
        loading={loading}
        error={error}
        onBack={() => setStep("form")}
        onSubmit={handleFinalSubmit}
      />
    );
  }

  return (
    <ComplaintFields
      category={category}
      setCategory={setCategory}
      reporterName={reporterName}
      setReporterName={setReporterName}
      contact={contact}
      setContact={setContact}
      content={content}
      setContent={setContent}
      selectedTags={selectedTags}
      setSelectedTags={setSelectedTags}
      files={files}
      onFilesChange={setFiles}
      error={error}
      onSubmit={handleProceedToPreview}
    />
  );
}
