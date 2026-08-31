"use client";

import { useRef } from "react";
import { ArrowRight, Paperclip } from "lucide-react";
import type { Category } from "@/types/api";
import { CategoryPicker } from "./category-picker";
import { Tag } from "./complaint-tag";
import { ComplainNote } from "./complain-note";

interface ComplaintFieldsProps {
  category: Category;
  setCategory: (val: Category) => void;
  reporterName: string;
  setReporterName: (val: string) => void;
  contact: string;
  setContact: (val: string) => void;
  content: string;
  setContent: (val: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  files: File[];
  onFilesChange: (files: File[]) => void;
  error?: string;
  onSubmit: (e: React.FormEvent) => void;
}

export function ComplaintFields({
  category,
  setCategory,
  reporterName,
  setReporterName,
  contact,
  setContact,
  content,
  setContent,
  selectedTags,
  setSelectedTags,
  files,
  onFilesChange,
  error,
  onSubmit,
}: ComplaintFieldsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).filter((f) => f.size > 0).slice(0, 3);
      onFilesChange(selected);
    }
  };

  return (
    <form onSubmit={onSubmit} className="surface space-y-6 p-6 sm:p-8 bg-white border border-stone-200">
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
            value={reporterName}
            onChange={(e) => setReporterName(e.target.value)}
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
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="email@domain.com atau 0812xxxx"
          />
        </label>
      </div>

      <label>
        <span className="label text-stone-800 font-bold">Isi aduan *</span>
        <textarea
          className="field min-h-40 resize-y placeholder:text-stone-400 text-stone-900"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
        <Tag value={selectedTags} onChange={setSelectedTags} />
      </div>

      <label className="block cursor-pointer rounded-2xl border border-dashed border-stone-300 bg-[#fbfcfd] p-5 transition hover:border-[#1f4f8f] hover:bg-[#f3f7fc]">
        <span className="flex items-center gap-2 font-bold text-stone-800">
          <Paperclip size={18} className="text-[#1f4f8f]" /> Lampirkan bukti
        </span>
        <span className="mt-1 block text-sm text-stone-600">
          Maks. 3 berkas JPG, PNG, atau PDF. Masing-masing maksimal 5 MB.
        </span>
        <input
          ref={fileInputRef}
          className="mt-3 block w-full text-sm text-stone-700 file:mr-3 file:cursor-pointer file:rounded-xl file:border file:border-[#d8e3f4] file:bg-[#eef4fb] file:px-3.5 file:py-1.5 file:text-xs file:font-bold file:text-[#1f4f8f] hover:file:bg-[#1f4f8f] hover:file:text-white file:transition-colors"
          type="file"
          name="attachments"
          accept=".jpg,.jpeg,.png,.pdf"
          multiple
          onChange={handleFileChange}
        />
        {files.length > 0 && (
          <p className="mt-2 text-xs font-semibold text-[#1f4f8f]">
            ✓ {files.length} berkas dipilih: {files.map((f) => f.name).join(", ")}
          </p>
        )}
      </label>

      {error && <p className="error-box">{error}</p>}

      <button className="btn-primary w-full shadow-md cursor-pointer" type="submit">
        <span>Pratinjau Aduan</span>
        <ArrowRight size={17} />
      </button>

      <ComplainNote />
    </form>
  );
}
