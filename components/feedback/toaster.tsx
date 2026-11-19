"use client";

import {
  consumeQueuedToast,
  loaderEventName,
  toastEventName,
  type GlobalLoaderPayload,
  type ToastPayload,
} from "@/lib/feedback/toast";
import { GlobalLoading, ToastNotice } from "@/components/brand-kit";
import { useEffect, useRef, useState } from "react";

const TOAST_DURATION_MS = 2800;

export function Toaster() {
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const [loader, setLoader] = useState<{ visible: boolean; text?: string }>({
    visible: true,
    text: "bentar yaaa",
  });
  const timeoutRef = useRef<number | null>(null);
  const loaderTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    loaderTimeoutRef.current = window.setTimeout(() => {
      setLoader((prev) => ({ ...prev, visible: false }));
      loaderTimeoutRef.current = null;
    }, 650);

    const handleLoader = (event: Event) => {
      const { text = "bentar yaaa", durationMs = 1200 } =
        (event as CustomEvent<GlobalLoaderPayload>).detail ?? {};
      if (loaderTimeoutRef.current) window.clearTimeout(loaderTimeoutRef.current);
      setLoader({ visible: true, text });
      loaderTimeoutRef.current = window.setTimeout(() => {
        setLoader((prev) => ({ ...prev, visible: false }));
        loaderTimeoutRef.current = null;
      }, durationMs);
    };

    window.addEventListener(loaderEventName, handleLoader);
    return () => {
      window.removeEventListener(loaderEventName, handleLoader);
      if (loaderTimeoutRef.current) window.clearTimeout(loaderTimeoutRef.current);
    };
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
      <GlobalLoading isLoading={loader.visible} text={loader.text} />
      <ToastNotice
        message={toast?.message ?? null}
        onClose={handleClose}
      />
    </>
  );
}
