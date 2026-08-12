"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";

type Tone = "success" | "error" | "info";
type Toast = { id: number; message: string; tone: Tone };
type ToastContextValue = { show: (message: string, tone?: Tone) => void };
const ToastContext = createContext<ToastContextValue | null>(null);

const styles = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-red-200 bg-red-50 text-red-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
};
const icons = { success: CheckCircle2, error: TriangleAlert, info: Info };

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const remove = useCallback((id: number) => {
    setToasts((items) => items.filter((item) => item.id !== id));
  }, []);
  const show = useCallback((message: string, tone: Tone = "success") => {
    const id = Date.now() + Math.random();
    setToasts((items) => [...items.slice(-2), { id, message, tone }]);
    window.setTimeout(() => remove(id), 4500);
  }, [remove]);
  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <aside className="fixed top-5 right-4 z-[70] flex w-[min(380px,calc(100%-32px))] flex-col gap-3">
        {toasts.map((toast) => {
          const Icon = icons[toast.tone];
          return (
            <div
              key={toast.id}
              role="status"
              className={`toast-enter flex items-start gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur ${styles[toast.tone]}`}
            >
              <Icon className="mt-0.5 size-5 shrink-0" />
              <p className="flex-1 text-sm font-semibold leading-5">{toast.message}</p>
              <button type="button" onClick={() => remove(toast.id)} aria-label="Tutup notifikasi">
                <X className="size-4" />
              </button>
            </div>
          );
        })}
      </aside>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast harus digunakan di dalam ToastProvider.");
  return context;
}
