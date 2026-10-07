import type { Category } from "./api";

export interface StoredTicket {
  ticketCode: string;
  category: Category;
  createdAt: string;
  expiresAt?: number;
}

export interface PreviewFileItem {
  file: File;
  name: string;
  size: number;
  type: string;
  isImage: boolean;
  url?: string;
}

export interface FileItemInfo {
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface SubmittedComplaintDetails {
  category: Category;
  content: string;
  reporterName?: string;
  contact?: string;
  tags?: string[];
  attachmentsCount?: number;
  files?: FileItemInfo[];
}
