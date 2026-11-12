const READ_COMPLAINTS_STORAGE_KEY = "hallo_admin_read_complaints";
const READ_COMPLAINTS_EVENT = "hallo:read-complaints-changed";

export function getReadComplaintIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(READ_COMPLAINTS_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed.filter((v): v is string => typeof v === "string")) : new Set();
  } catch {
    return new Set();
  }
}

function saveReadComplaintIds(ids: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(READ_COMPLAINTS_STORAGE_KEY, JSON.stringify(Array.from(ids)));
    window.dispatchEvent(new CustomEvent(READ_COMPLAINTS_EVENT));
  } catch {
    // Ignore storage quota errors
  }
}

export function markComplaintAsRead(id: string) {
  if (!id) return;
  const ids = getReadComplaintIds();
  if (!ids.has(id)) {
    ids.add(id);
    saveReadComplaintIds(ids);
  }
}

export function toggleComplaintRead(id: string) {
  if (!id) return;
  const ids = getReadComplaintIds();
  if (ids.has(id)) {
    ids.delete(id);
  } else {
    ids.add(id);
  }
  saveReadComplaintIds(ids);
}

export function markAllComplaintsAsRead(complaintIds: string[]) {
  const ids = getReadComplaintIds();
  let changed = false;
  for (const id of complaintIds) {
    if (id && !ids.has(id)) {
      ids.add(id);
      changed = true;
    }
  }
  if (changed) {
    saveReadComplaintIds(ids);
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
