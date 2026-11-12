import type { Complaint } from "./api";

export type AdminRole = "owner" | "director" | "manager";

export interface AdminInfo {
  role: AdminRole;
  bidang: string | null;
  displayName: string;
  username: string;
}

export interface AuthUser {
  id: string;
  username: string;
  role: AdminRole;
  bidang: string | null;
  displayName: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: AdminRole;
  bidang: string | null;
  displayName: string | null;
}

export interface ComplaintTableProps {
  data: Complaint[];
  loading: boolean;
  overrides: Record<string, string[]>;
  onOpenDetail: (item: Complaint) => void;
  onOpenDispatch: (item: Complaint) => void;
  readOnly?: boolean;
}

export interface ComplaintReadBarProps {
  unreadCount: number;
  readCount: number;
  onMarkAllRead: () => void;
}

export interface ComplaintTableRowProps {
  item: Complaint;
  tags: string[];
  isUnread: boolean;
  readOnly: boolean;
  onToggleRead: () => void;
  onOpenDetail: () => void;
  onOpenDispatch: () => void;
}

export interface ManagerStatItem {
  href: string;
  label: string;
  value: string;
  note: string;
}

export interface ManagerRecentComplaintsProps {
  items: Complaint[];
  readIds: Set<string>;
}
