import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f8ff] px-6 py-10 text-[#172033]">
      <section className="w-full max-w-md rounded-lg border border-[#d8e3f4] bg-white p-6 sm:p-8 shadow-xl shadow-[#0f2a4f]/10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#617089] hover:text-[#0f2a4f] transition"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Kembali ke Portal Publik
        </Link>

        <div className="mb-6 flex items-start gap-4">
          <Image
            src="/logo-bopkri.png"
            alt="Logo Yayasan BOPKRI Yogyakarta"
            width={52}
            height={52}
            className="h-13 w-13 rounded-full object-contain shrink-0"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-[#0f172a]">Masuk Panel Admin</h1>
            <p className="mt-1 text-xs sm:text-sm leading-5 text-[#617089]">
              Portal pengaduan Hallo BOPKRI Yayasan BOPKRI Yogyakarta.
            </p>
          </div>
        </div>

        <LoginForm />

        <p className="mt-6 text-center text-xs text-[#8b98ad]">
          Sistem Informasi & Pengaduan • Yayasan BOPKRI
        </p>
      </section>
    </main>
  );
}
