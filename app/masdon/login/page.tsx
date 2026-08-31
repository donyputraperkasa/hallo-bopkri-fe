import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/admin";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f3f7fd] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#526078] hover:text-[#0f2a4f] transition"
        >
          <ArrowLeft size={14} />
          Kembali ke Beranda
        </Link>

        <section className="rounded-2xl border border-[#dbe5f4] bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col items-center text-center gap-3">
            <Image
              src="/logo-yayasan.png"
              alt="Logo Yayasan BOPKRI"
              width={64}
              height={64}
              className="h-16 w-16 rounded-full bg-[#f8fbff] p-1 border border-[#dbe5f4] object-contain shadow-xs"
            />
            <div>
              <h1 className="text-xl font-bold text-[#0f172a]">Portal Login</h1>
              <p className="mt-1 text-xs text-[#748299]">
                Silakan masuk dengan akun pengurus atau bidang Anda.
              </p>
            </div>
          </div>

          <LoginForm />
        </section>
      </div>
    </main>
  );
}
