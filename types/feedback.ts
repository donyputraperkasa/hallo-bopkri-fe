export type ToastType = "error" | "success";

export interface ToastPayload {
  message: string;
  title?: string;
  type?: ToastType;
}
