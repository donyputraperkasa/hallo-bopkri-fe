import { Brand } from "@/components/layout/brand";
import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <main className="page-shell grid min-h-screen place-items-center p-5">
      <div className="w-full max-w-md">
        <div className="mb-7 flex justify-center"><Brand /></div>
        <LoginForm />
        <p className="mt-5 text-center text-xs text-slate-400">
          Halaman ini khusus administrator Yayasan BOPKRI.
        </p>
      </div>
    </main>
  );
}
