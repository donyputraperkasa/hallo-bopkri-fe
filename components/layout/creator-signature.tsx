type CreatorSignatureProps = {
  onOpenLicense: () => void;
  variant?: "floating" | "dashboard";
};

export function CreatorSignature({
  onOpenLicense,
  variant = "floating",
}: CreatorSignatureProps) {
  const isDashboard = variant === "dashboard";

  if (isDashboard) {
    return (
      <div className="flex w-full flex-col items-center justify-between gap-2 border-t border-[#dbe5f4] pt-4 text-xs text-[#748299] sm:flex-row">
        <p className="text-center sm:text-left">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-[#1f2a44]">
            Yayasan BOPKRI Yogyakarta
          </span>
          . All rights reserved.
        </p>
        <div className="flex items-center gap-2 text-center sm:text-right">
          <span>
            Dikembangkan oleh{" "}
            <a
              href="https://portofolio-ku-gold.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="text-[#1f4f8f] transition hover:underline"
            >
              Dony Putra Perkasa
            </a>
          </span>
          <span>•</span>
          <button
            type="button"
            onClick={onOpenLicense}
            className="text-[#64748b] transition hover:text-[#1f4f8f] hover:underline cursor-pointer"
          >
            Lisensi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full border border-[#dbe5f4] bg-white/90 px-4 py-1.5 text-xs text-[#748299] shadow-xs backdrop-blur-sm">
      <span className="font-semibold text-[#1f2a44]">Hallo BOPKRI</span>
      <span>•</span>
      <span>
        Dibuat oleh {" "}
        <a
          href="https://portofolio-ku-gold.vercel.app/"
          target="_blank"
          rel="noreferrer"
          className="text-[#1f4f8f] transition hover:underline"
        >
          Dony Putra Perkasa
        </a>
      </span>
      <span>•</span>
      <button
        type="button"
        onClick={onOpenLicense}
        className="font-medium text-[#64748b] transition hover:text-[#1f4f8f] hover:underline cursor-pointer"
      >
        Lisensi
      </button>
    </div>
  );
}
