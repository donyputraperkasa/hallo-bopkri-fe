import type { FormEvent } from "react";
import type { ComplaintStatus } from "./api";

export interface StatusCreateFormProps {
  saving: boolean;
  error: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export interface StatusListSectionProps {
  statuses: ComplaintStatus[] | null;
  onToggle: (item: ComplaintStatus) => void;
}

export interface StatusUpdateFormProps {
  complaintId: string;
  currentId: string;
  statuses: ComplaintStatus[];
  onUpdated: () => void;
}

