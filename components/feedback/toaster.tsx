"use client";

import {
  consumeQueuedToast,
  toastEventName,
  type ToastPayload,
} from "@/lib/feedback/toast";
import { GlobalLoading, ToastNotice } from "@/components/brand-kit";
import { useEffect, useRef, useState } from "react";

const TOAST_DURATION_MS = 2800;

export function Toaster() {
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const [refreshLoading, setRefreshLoading] = useState(true);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const refreshTimer = window.setTimeout(() => {
      setRefreshLoading(false);
    }, 650);
    return () => window.clearTimeout(refreshTimer);
  }, []);

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

  const handleClose = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setToast(null);
  };

  return (
    <>
      <GlobalLoading isLoading={refreshLoading} />
      <ToastNotice
        message={toast?.message ?? null}
        onClose={handleClose}
      />
    </>
  );
}
