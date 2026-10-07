import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { Category, ComplaintHistory, TrackResult } from "./api";
import type { PreviewFileItem, StoredTicket, SubmittedComplaintDetails } from "./ticket";

export interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  children: ReactNode;
}

export interface TagProps {
  value?: string[];
  onChange?: (tags: string[]) => void;
  name?: string;
  placeholder?: string;
}

export interface RecentTicketsListProps {
  tickets: StoredTicket[];
  onSelect: (ticketCode: string) => void;
  onRemove: (ticketCode: string, e: React.MouseEvent) => void;
}

export interface ComplaintPreviewProps {
  category: Category;
  reporterName: string;
  contact: string;
  content: string;
  selectedTags: string[];
  filePreviews: PreviewFileItem[];
  loading: boolean;
  error?: string;
  onBack: () => void;
  onSubmit: () => void;
}

export interface ComplaintFieldsProps {
  category: Category;
  setCategory: (val: Category) => void;
  reporterName: string;
  setReporterName: (val: string) => void;
  contact: string;
  setContact: (val: string) => void;
  content: string;
  setContent: (val: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  files: File[];
  onFilesChange: (files: File[]) => void;
  error?: string;
  onSubmit: (e: React.FormEvent) => void;
}

export interface CategoryPickerProps {
  value: Category;
  onChange: (category: Category) => void;
}

export interface PreviewAttachmentsListProps {
  files: PreviewFileItem[];
}

export interface RecentTicketBannerProps {
  onTrack: (ticketCode: string) => void;
}

export interface TicketDetailsCardProps {
  details: SubmittedComplaintDetails;
}

export interface TicketSuccessProps {
  ticketCode: string;
  details?: SubmittedComplaintDetails;
}

export interface TrackingFormProps {
  initialTicket?: string;
}

export interface TrackingHistoryTimelineProps {
  histories: ComplaintHistory[];
}

export interface TrackingResultProps {
  data: TrackResult;
}
