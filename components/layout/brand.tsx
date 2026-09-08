import Link from "next/link";
import Image from "next/image";

export function Brand({
  href = "/",
  inverse = false,
}: {
  href?: string;
  inverse?: boolean;
}) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-xl">
      <Image
        src="/logo-yayasan.png"
        alt="Logo Yayasan BOPKRI"
        width={44}
        height={44}
        className="size-11 object-contain drop-shadow-sm transition-transform hover:scale-105"
      />
      <span className="leading-tight">
        <strong className={`block text-[17px] font-semibold tracking-tight ${inverse ? "text-white" : "text-[#111827]"}`}>
          Hallo BOPKRI
        </strong>
        <small className={`text-[11px] font-medium tracking-wide ${inverse ? "text-blue-100" : "text-[#617089]"}`}>
          RUANG SUARA BERSAMA
        </small>
      </span>
    </Link>
  );
}
