"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { showToast, type ToastType } from "@/lib/feedback/toast";

type Tone = "success" | "error" | "info";
type ToastContextValue = {
  show: (message: string, tone?: Tone, title?: string) => void;
};
const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const show = useCallback((message: string, tone: Tone = "success", title?: string) => {
    const type: ToastType = tone === "error" ? "error" : "success";
    showToast({
      message,
      type,
      title: title ?? (tone === "error" ? "Terjadi kendala" : "Berhasil"),
    });
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast harus digunakan di dalam ToastProvider.");
  return context;
}
