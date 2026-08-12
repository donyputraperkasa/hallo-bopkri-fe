import { Heart, HelpCircle, MessageSquareWarning } from "lucide-react";
import type { Category } from "@/types/api";

export const CATEGORIES = [
  {
    value: "QUESTION",
    label: "Pertanyaan",
    description: "Tanyakan informasi atau layanan yayasan.",
    icon: HelpCircle,
    tone: "blue",
  },
  {
    value: "APPRECIATION",
    label: "Apresiasi",
    description: "Sampaikan penghargaan dan pengalaman baik.",
    icon: Heart,
    tone: "green",
  },
  {
    value: "COMPLAINT",
    label: "Keluhan",
    description: "Laporkan masalah yang perlu ditindaklanjuti.",
    icon: MessageSquareWarning,
    tone: "red",
  },
] as const;

export const categoryLabel = (category: Category) =>
  CATEGORIES.find((item) => item.value === category)?.label ?? category;

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));

export const formatBytes = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};
