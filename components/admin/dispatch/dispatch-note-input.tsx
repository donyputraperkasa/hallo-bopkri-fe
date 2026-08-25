"use client";

interface DispatchNoteInputProps {
  note: string;
  onChange: (value: string) => void;
}

export function DispatchNoteInput({ note, onChange }: DispatchNoteInputProps) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-[#748299] mb-1">
        Catatan Pengiriman <small className="font-normal text-[#8b98ad]">(opsional)</small>
      </label>
      <textarea
        className="w-full min-h-20 rounded-md border border-[#dbe5f4] bg-[#f8fbff] p-3 text-xs text-[#172033] outline-none placeholder:text-[#8b98ad] focus:border-[#0f2a4f] focus:bg-white"
        placeholder="Misal: Mohon ditindaklanjuti dan dilaporkan kembali..."
        value={note}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
