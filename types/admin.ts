import type { Attachment, Complaint, ComplaintStatus } from "./api";

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
  role?: AdminRole;
  readOnly: boolean;
  onToggleRead: () => void;
  onOpenDetail: () => void;
  onOpenDispatch: () => void;
}

export interface ComplaintBidangCardProps {
  selectedBidangs: string[];
  isDispatching: boolean;
  onToggleBidang: (bidang: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onOpenModal: () => void;
}

export interface ComplaintMainCardProps {
  item: Complaint;
  activeTags: string[];
  onOpenDispatch: () => void;
}

export interface DetailAttachmentsListProps {
  attachments?: Attachment[];
  attachmentCount?: number;
  onPreview: (att: Attachment) => void;
  allowDownload?: boolean;
}


export interface DetailModalHeaderProps {
  current: Complaint;
  onClose: () => void;
}

export interface DetailQuickStatusFormProps {
  complaintId: string;
  currentStatusId: string;
  statuses: ComplaintStatus[];
  onUpdated: (updatedComplaint: Complaint) => void;
}

export interface DetailTagsBarProps {
  tags: string[];
  current: Complaint;
  readOnly: boolean;
  onOpenDispatch: (c: Complaint) => void;
}

export interface DispatchModalHeaderProps {
  ticketCode: string;
  onClose: () => void;
}

export interface DispatchNoteInputProps {
  note: string;
  onChange: (value: string) => void;
}

export interface DispatchRecipientListProps {
  directors: AdminUser[];
  managers: AdminUser[];
  selectedIds: string[];
  complaintTags: string[];
  onToggle: (userId: string) => void;
  onSelectAllManagers: () => void;
  onClear: () => void;
}

export interface DispatchSummaryBoxProps {
  selectedUsers: AdminUser[];
}

export interface DispatchTagBarProps {
  tags: string[];
  matchingCount: number;
  onSelectMatching: () => void;
}

export interface ManagerStatItem {
  href: string;
  label: string;
  value: string;
  note: string;
}

export interface ManagerRecentComplaintsProps {
  items: Complaint[];
  readOverrides: Record<string, boolean>;
}

export interface AdminSidebarProps {
  role: "owner" | "director" | "manager";
  roleLabel: string;
  name: string;
  bidang?: string | null;
  isMenuOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export interface AdminShellProps {
  children: React.ReactNode;
  role?: AdminRole;
  displayName?: string;
  bidang?: string | null;
}

export interface AdminHeaderProps {
  name: string;
  roleLabel: string;
  onOpenMenu: () => void;
}

export interface LogoutButtonProps {
  /** "sidebar" → full-width, gaya sidebar. "header" → compact text button (default) */
  variant?: "header" | "sidebar";
}

export interface ComplaintPaginationFooterProps {
  filteredCount: number;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}