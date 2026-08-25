"use client";

import { FormEvent } from "react";
import { Plus } from "lucide-react";

interface StatusCreateFormProps {
  saving: boolean;
  error: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function StatusCreateForm({ saving, error, onSubmit }: StatusCreateFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border border-[#dbe5f4] bg-white p-5 shadow-sm space-y-4"
    >
      <h3 className="text-base font-semibold text-[#0f172a]">Tambah Status Baru</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="block text-xs font-semibold uppercase tracking-wider text-[#748299] mb-1.5">
            Nama status *
          </span>
          <input
            className="h-10 w-full rounded-md border border-[#dbe5f4] bg-[#f8fbff] px-3 text-sm text-[#172033] outline-none placeholder:text-[#8b98ad] focus:border-[#0f2a4f] focus:bg-white"
            name="name"
            placeholder="Contoh: Menunggu konfirmasi"
            required
          />
        </label>

        <label className="block">
          <span className="block text-xs font-semibold uppercase tracking-wider text-[#748299] mb-1.5">
            Kode unik *
          </span>
          <input
            className="h-10 w-full rounded-md border border-[#dbe5f4] bg-[#f8fbff] px-3 text-sm text-[#172033] outline-none uppercase placeholder:text-[#8b98ad] focus:border-[#0f2a4f] focus:bg-white"
            name="code"
            placeholder="MENUNGGU_KONFIRMASI"
            required
          />
        </label>

        <label className="block">
          <span className="block text-xs font-semibold uppercase tracking-wider text-[#748299] mb-1.5">
            Warna Penanda
          </span>
          <div className="flex h-10 items-center gap-3 rounded-md border border-[#dbe5f4] bg-[#f8fbff] px-3">
            <input
              className="size-7 cursor-pointer rounded border-0 bg-transparent"
              type="color"
              name="color"
              defaultValue="#0f2a4f"
            />
            <span className="text-xs text-[#748299]">Pilih warna badge status</span>
          </div>
        </label>

        <label className="block">
          <span className="block text-xs font-semibold uppercase tracking-wider text-[#748299] mb-1.5">
            Deskripsi
          </span>
          <input
            className="h-10 w-full rounded-md border border-[#dbe5f4] bg-[#f8fbff] px-3 text-sm text-[#172033] outline-none placeholder:text-[#8b98ad] focus:border-[#0f2a4f] focus:bg-white"
            name="description"
            placeholder="Keterangan alur status..."
          />
        </label>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          {error}
        </div>
      ) : null}

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#0f2a4f] px-5 text-sm font-semibold text-white transition hover:bg-[#173b6b] disabled:opacity-50 shadow-xs"
        >
          <Plus size={16} />
          <span>{saving ? "Menyimpan..." : "Tambah Status"}</span>
        </button>
      </div>
    </form>
  );
}
