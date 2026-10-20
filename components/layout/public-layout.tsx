"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";
import { FloatingContact } from "@/components/public/floating-contact";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="page-shell flex min-h-screen flex-col">
      <SiteHeader />
      <main key={pathname} className="flex-1 animate-page-enter">
        {children}
      </main>
      <FloatingContact />
    </div>
  );
}
