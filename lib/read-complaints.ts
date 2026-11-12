import type { AuthUser } from "@/types";

const READ_COMPLAINTS_STORAGE_PREFIX = "hallo_admin_read_complaints";
const READ_COMPLAINTS_EVENT = "hallo:read-complaints-changed";

export function getReadScope(user?: AuthUser | null): string {
  if (!user) return "default";
  const bidangPart = user.bidang ? `_${user.bidang.toLowerCase()}` : "";
  return `${user.role}${bidangPart}_${user.username || user.id}`;
}

function storageKeyFor(scope = "default"): string {
  return `${READ_COMPLAINTS_STORAGE_PREFIX}:${scope}`;
}

export function getReadComplaintIds(scope = "default"): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(storageKeyFor(scope));
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? new Set(parsed.filter((v): v is string => typeof v === "string"))
      : new Set();
  } catch {
    return new Set();
  }
}

function saveReadComplaintIds(ids: Set<string>, scope = "default") {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKeyFor(scope), JSON.stringify(Array.from(ids)));
    window.dispatchEvent(new CustomEvent(READ_COMPLAINTS_EVENT));
  } catch {
    // Ignore storage quota errors
  }
}

export function markComplaintAsRead(id: string, scope = "default") {
  if (!id) return;
  const ids = getReadComplaintIds(scope);
  if (!ids.has(id)) {
    ids.add(id);
    saveReadComplaintIds(ids, scope);
  }
}

export function toggleComplaintRead(id: string, scope = "default") {
  if (!id) return;
  const ids = getReadComplaintIds(scope);
  if (ids.has(id)) {
    ids.delete(id);
  } else {
    ids.add(id);
  }
  saveReadComplaintIds(ids, scope);
}

export function markAllComplaintsAsRead(complaintIds: string[], scope = "default") {
  const ids = getReadComplaintIds(scope);
  let changed = false;
  for (const id of complaintIds) {
    if (id && !ids.has(id)) {
      ids.add(id);
      changed = true;
    }
  }
  if (changed) {
    saveReadComplaintIds(ids, scope);
  }
}

export function subscribeReadComplaints(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(READ_COMPLAINTS_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(READ_COMPLAINTS_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
