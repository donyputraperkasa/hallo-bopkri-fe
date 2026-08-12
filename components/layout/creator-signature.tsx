import { ExternalLink, ShieldCheck, Sparkles } from "lucide-react";

export function CreatorSignature({
  onOpenLicense,
}: {
  onOpenLicense: () => void;
}) {
  return (
    <div className="group relative isolate flex max-w-full flex-wrap items-center justify-center gap-2 overflow-hidden rounded-full border border-[#d7e4f5] bg-white/90 px-4 py-3 text-xs text-[#60708b] shadow-lg shadow-[#1f4f8f]/10 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#b9cce7] hover:shadow-xl sm:gap-3 sm:px-5 sm:text-sm">
      <span className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#f2d35f] to-transparent" />
      <span className="flex items-center gap-2 font-semibold text-[#1f4f8f]">
        <Sparkles className="size-4 text-[#d4a900]" />
        Hallo BOPKRI v1.0
      </span>
      <Dot />
      <span>created by</span>
      <a
        href="https://portofolio-ku-gold.vercel.app/"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 font-bold text-[#1f4f8f] hover:text-[#29328f]"
      >
        Dony Putra Perkasa
        <ExternalLink className="size-3.5" />
      </a>
      <Dot />
      <button
        type="button"
        onClick={onOpenLicense}
        className="inline-flex items-center gap-1 font-semibold text-[#1f4f8f] hover:text-[#29328f]"
      >
        <ShieldCheck className="size-4" /> Lisensi
      </button>
    </div>
  );
}

function Dot() {
  return (
    <span className="size-2 rounded-full bg-[#f2d35f] shadow-[0_0_0_4px_rgba(242,211,95,0.16)]" />
  );
}
