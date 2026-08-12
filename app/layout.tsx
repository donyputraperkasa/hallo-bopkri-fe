import type { Metadata } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast-provider";
import "./globals.css";

const bodyFont = DM_Sans({ subsets: ["latin"], variable: "--font-body" });
const headingFont = Manrope({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: { default: "Hallo BOPKRI", template: "%s | Hallo BOPKRI" },
  description: "Layanan aduan, aspirasi, dan apresiasi Yayasan BOPKRI.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className={`${bodyFont.variable} ${headingFont.variable}`}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
