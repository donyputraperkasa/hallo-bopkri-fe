"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useInactivityLogout } from "@/hooks/use-inactivity";
import { showToast } from "@/lib/feedback/toast";
import { CreatorFooter } from "@/components/layout/creator-footer";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";

type AdminRole = "owner" | "director" | "manager";

interface AdminShellProps {
  children: React.ReactNode;
  role?: AdminRole;
  displayName?: string;
  bidang?: string | null;
}

function formatRole(role: AdminRole): string {
  if (role === "director") return "Direktur";
  if (role === "manager") return "Manajer";
  return "Owner";
}

export function AdminShell({
  children,
  role: forcedRole,
  displayName: forcedName,
  bidang: forcedBidang,
}: AdminShellProps) {
  useInactivityLogout(true);

  const router = useRouter();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const role: AdminRole = forcedRole ?? (user?.role as AdminRole) ?? "owner";
  const name = forcedName ?? user?.displayName ?? "Pengguna";
  const bidang = forcedBidang ?? user?.bidang;
  const roleLabel = formatRole(role);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      showToast({
        message: "Sampai jumpa lagi di Hallo BOPKRI.",
        title: "Dadaahhh sayonara",
        type: "success",
      });
      router.replace("/");
      router.refresh();
    }
  };

  return (
    <main className="h-screen overflow-hidden bg-[#eef4fb] text-[#172033]">
      <div className="flex h-full min-h-0">
        {isMenuOpen ? (
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 z-40 bg-[#071529]/55 backdrop-blur-sm lg:hidden"
            aria-label="Tutup menu"
          />
        ) : null}

        <AdminSidebar
          role={role}
          roleLabel={roleLabel}
          name={name}
          bidang={bidang}
          isMenuOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onLogout={() => void handleLogout()}
        />

        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          <AdminHeader
            name={name}
            roleLabel={roleLabel}
            onOpenMenu={() => setIsMenuOpen(true)}
          />

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex min-h-full flex-col gap-6">
              <div className="flex-1">{children}</div>
              <div className="pt-4 pb-2">
                <CreatorFooter />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
