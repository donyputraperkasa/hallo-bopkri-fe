export type Category = "QUESTION" | "APPRECIATION" | "COMPLAINT";

export interface ComplaintStatus {
  id: string;
  code: string;
  name: string;
  color: string;
  description?: string | null;
  isFinal?: boolean;
  isActive?: boolean;
}

export interface ComplaintHistory {
  id: string;
  status: ComplaintStatus;
  publicNote?: string | null;
  createdAt: string;
}

export interface Attachment {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface Complaint {
  id: string;
  ticketCode: string;
  category: Category;
  reporterName?: string | null;
  contact?: string | null;
  content: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  histories?: ComplaintHistory[];
  attachments?: Attachment[];
  _count?: { attachments: number };
}

export interface ComplaintList {
  data: Complaint[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface Dashboard {
  total: number;
  byStatus: { status: ComplaintStatus; count: number }[];
  byCategory: { category: Category; _count: number }[];
}

export interface TrackResult {
  ticketCode: string;
  category: Category;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  histories: ComplaintHistory[];
}
