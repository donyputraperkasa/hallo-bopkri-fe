"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";
import { CreateByMe, FloatingContact } from "@/components/brand-kit";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="page-shell flex min-h-screen flex-col">
      <SiteHeader />
      <main key={pathname} className="flex-1 animate-page-enter">
        {children}
      </main>
      <CreateByMe />
      <FloatingContact />
    </div>
  );
}
