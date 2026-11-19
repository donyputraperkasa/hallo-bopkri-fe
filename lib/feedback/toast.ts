import type { ToastType, ToastPayload } from "@/types";

export type { ToastType, ToastPayload };

export const toastEventName = "mybopkri:toast";
export const loaderEventName = "mybopkri:loader";
const pendingToastKey = "mybopkri.pending-toast";

export interface GlobalLoaderPayload {
  text?: string;
  durationMs?: number;
}

export function showGlobalLoader(text = "bentar yaaa", durationMs = 1200) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<GlobalLoaderPayload>(loaderEventName, {
      detail: { text, durationMs },
    }),
  );
}

export function showToast(payload: ToastPayload) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<ToastPayload>(toastEventName, { detail: payload }));
}

export function queueToast(payload: ToastPayload) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(pendingToastKey, JSON.stringify(payload));
}

export function consumeQueuedToast() {
  if (typeof window === "undefined") return null;
  const value = sessionStorage.getItem(pendingToastKey);
  if (!value) return null;
  sessionStorage.removeItem(pendingToastKey);

  try {
    return JSON.parse(value) as ToastPayload;
  } catch {
    return null;
  }
}
