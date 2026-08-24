"use client";

import {
  consumeQueuedToast,
  toastEventName,
  type ToastPayload,
} from "@/lib/feedback/toast";
import { CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const TOAST_DURATION_MS = 2800;

export function Toaster() {
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const displayToast = (payload: ToastPayload) => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      setToast(payload);
      timeoutRef.current = window.setTimeout(() => {
        setToast(null);
        timeoutRef.current = null;
      }, TOAST_DURATION_MS);
    };

    const handleToast = (event: Event) => {
      displayToast((event as CustomEvent<ToastPayload>).detail);
    };

    const queuedToast = consumeQueuedToast();
    if (queuedToast) displayToast(queuedToast);

    window.addEventListener(toastEventName, handleToast);
    return () => {
      window.removeEventListener(toastEventName, handleToast);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!toast) return null;

  const isError = toast.type === "error";
  const title = toast.title ?? (isError ? "Terjadi kendala" : "Berhasil");
  const iconClass = isError
    ? "bg-red-50 text-red-600"
    : "bg-[#eaf2ff] text-[#1f4f8f]";
  const progressClass = isError ? "bg-red-500" : "bg-[#f2d35f]";

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[120] grid place-items-center bg-[#071529]/55 p-5 backdrop-blur-[10px]"
    >
      <div className="notice-enter w-full max-w-[420px] rounded-xl border border-white/70 bg-white px-8 py-7 text-center shadow-[0_28px_90px_rgba(7,21,41,0.34)]">
        <span className={`mx-auto grid size-14 place-items-center rounded-full ${iconClass}`}>
          {isError ? (
            <XCircle size={27} strokeWidth={2.2} aria-hidden="true" />
          ) : (
            <CheckCircle2 size={27} strokeWidth={2.2} aria-hidden="true" />
          )}
        </span>
        <h2 className="mt-5 text-xl font-bold text-[#172033]">{title}</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-[#66758e]">
          {toast.message}
        </p>
        <div className="mx-auto mt-6 h-1.5 w-28 overflow-hidden rounded-full bg-[#e7edf6]">
          <div className={`toast-progress h-full w-full origin-left rounded-full ${progressClass}`} />
        </div>
      </div>
    </div>
  );
}
