import type { Complaint } from "@/types/api";

export interface AdminUser {
  id: string;
  username: string;
  role: "owner" | "director" | "manager";
  bidang: string | null;
  displayName: string | null;
}

export function extractComplaintTags(item: Complaint): string[] {
  if (Array.isArray(item.tags) && item.tags.length > 0) {
    return item.tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean);
  }
  const raw =
    (item as unknown as Record<string, unknown>).tags ??
    (item as unknown as Record<string, unknown>).tag;
  if (typeof raw === "string" && raw.trim()) {
    return raw
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
  }
  return [];
}
