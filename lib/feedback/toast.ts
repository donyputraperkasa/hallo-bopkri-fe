export type ToastType = "error" | "success";

export type ToastPayload = {
  message: string;
  title?: string;
  type?: ToastType;
};

export const toastEventName = "mybopkri:toast";
const pendingToastKey = "mybopkri.pending-toast";

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
