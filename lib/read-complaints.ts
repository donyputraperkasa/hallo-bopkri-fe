import type { AdminRole, Complaint } from "@/types";

const READ_COMPLAINTS_EVENT = "hallo:read-complaints-changed";

// State di memori (tanpa localStorage) untuk respons instan sebelum/saat request API ke database selesai
const memoryReadOverrides: Record<string, boolean> = {};

export function getReadOverrides(): Record<string, boolean> {
  return { ...memoryReadOverrides };
}

function notifyReadChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(READ_COMPLAINTS_EVENT));
  }
}

/**
 * Menentukan apakah aduan berstatus "Belum dibuka" (Unread) murni dari Database Server
 * (serta state aksi klik pada sesi berjalan, tanpa localStorage).
 */
export function isComplaintUnread(
  item: Complaint,
  role: AdminRole = "owner",
  overrides: Record<string, boolean> = memoryReadOverrides,
): boolean {
  // 1. Jika baru saja diklik/diubah status bacanya pada sesi aktif
  if (item.id in overrides) {
    return !overrides[item.id];
  }

  // 2. Jika backend mengirimkan field `isRead` per user dari database
  if (typeof item.isRead === "boolean") {
    return !item.isRead;
  }

  // 3. Penentuan otomatis dari status Database Server:
  const code = (item.status?.code ?? "").toUpperCase();
  const name = (item.status?.name ?? "").toLowerCase();
  const isFinal = Boolean(item.status?.isFinal);

  if (isFinal || ["SELESAI", "DITOLAK", "CLOSED", "RESOLVED"].includes(code)) {
    return false;
  }

  const isInitialNew =
    code === "NEW" ||
    code === "BARU" ||
    name.includes("aduan baru") ||
    name === "baru";

  if (role === "owner" || role === "director") {
    // Bagi Owner & Direktur: hanya yang statusnya masih "Aduan Baru" di database yang belum dibuka.
    // Begitu dikirim ke bidang ("Diteruskan"), otomatis berstatus sudah dibuka bagi Owner.
    return isInitialNew;
  }

  // Bagi Manajer Bidang: aduan yang baru dikirim oleh Owner ke bidangnya
  // (status "Diteruskan" / "Aduan Baru") otomatis berstatus baru/belum dibuka.
  const isNewForManager =
    isInitialNew ||
    code === "DISPATCHED" ||
    code === "DITERUSKAN" ||
    name.includes("diteruskan") ||
    name.includes("disposisi");

  return isNewForManager;
}

/**
 * Label status tampilan: untuk Manajer Bidang, aduan yang baru dikirim dari Owner
 * ("Diteruskan") dan belum dibuka ditampilkan sebagai "Aduan Baru".
 */
export function getDisplayStatusName(
  item: Complaint,
  role: AdminRole = "owner",
  isUnread = false,
): string {
  if (role === "manager" && isUnread) {
    const code = (item.status?.code ?? "").toUpperCase();
    const name = (item.status?.name ?? "").toLowerCase();
    if (
      code === "DISPATCHED" ||
      code === "DITERUSKAN" ||
      name.includes("diteruskan") ||
      name.includes("disposisi")
    ) {
      return "Aduan Baru";
    }
  }
  return item.status?.name ?? "Aduan Baru";
}

export function markComplaintAsRead(id: string) {
  if (!id) return;
  if (memoryReadOverrides[id] !== true) {
    memoryReadOverrides[id] = true;
    notifyReadChange();
  }
  // Sinkronkan ke endpoint database backend jika tersedia
  if (typeof window !== "undefined") {
    void fetch(`/api/admin/complaints/${encodeURIComponent(id)}/read`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ isRead: true }),
    }).catch(() => {});
  }
}

export function toggleComplaintRead(item: Complaint, role: AdminRole = "owner") {
  if (!item?.id) return;
  const currentlyUnread = isComplaintUnread(item, role, memoryReadOverrides);
  const nextIsRead = currentlyUnread;
  memoryReadOverrides[item.id] = nextIsRead;
  notifyReadChange();

  if (typeof window !== "undefined") {
    void fetch(`/api/admin/complaints/${encodeURIComponent(item.id)}/read`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ isRead: nextIsRead }),
    }).catch(() => {});
  }
}

export function markAllComplaintsAsRead(complaintIds: string[]) {
  let changed = false;
  for (const id of complaintIds) {
    if (id && memoryReadOverrides[id] !== true) {
      memoryReadOverrides[id] = true;
      changed = true;
    }
  }
  if (changed) {
    notifyReadChange();
  }
  if (typeof window !== "undefined" && complaintIds.length > 0) {
    void fetch("/api/admin/complaints/read-all", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ids: complaintIds }),
    }).catch(() => {});
  }
}

export function subscribeReadComplaints(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(READ_COMPLAINTS_EVENT, handler);
  return () => {
    window.removeEventListener(READ_COMPLAINTS_EVENT, handler);
  };
}
