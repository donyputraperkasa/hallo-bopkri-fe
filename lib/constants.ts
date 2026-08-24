import {
  Building2,
  Coins,
  FileText,
  FolderArchive,
  GraduationCap,
  Heart,
  HelpCircle,
  Megaphone,
  MessageSquareWarning,
  Users2,
  type LucideIcon,
} from "lucide-react";
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

export interface BidangTagConfig {
  value: string;
  label: string;
  managerTitle: string;
  icon: LucideIcon;
  colorClass: string;
  badgeColor: string;
}

export const BIDANG_TAGS: BidangTagConfig[] = [
  {
    value: "pendidikan",
    label: "Pendidikan",
    managerTitle: "Manajer Bidang Pendidikan",
    icon: GraduationCap,
    colorClass: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
    badgeColor: "#1d4ed8",
  },
  {
    value: "keuangan",
    label: "Keuangan",
    managerTitle: "Manajer Bidang Keuangan",
    icon: Coins,
    colorClass: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    badgeColor: "#047857",
  },
  {
    value: "PSDM",
    label: "PSDM",
    managerTitle: "Manajer Bidang PSDM",
    icon: Users2,
    colorClass: "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100",
    badgeColor: "#7e22ce",
  },
  {
    value: "humas",
    label: "Humas",
    managerTitle: "Manajer Bidang Humas",
    icon: Megaphone,
    colorClass: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",
    badgeColor: "#b45309",
  },
  {
    value: "asset",
    label: "Asset / Sarpras",
    managerTitle: "Manajer Bidang Asset & Sarana Prasarana",
    icon: Building2,
    colorClass: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
    badgeColor: "#be123c",
  },
  {
    value: "sekretariat",
    label: "Sekretariat",
    managerTitle: "Manajer Bidang Sekretariat",
    icon: FileText,
    colorClass: "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200",
    badgeColor: "#334155",
  },
  {
    value: "lainnya",
    label: "Lainnya / Umum",
    managerTitle: "Manajer Bidang Umum & Lainnya",
    icon: FolderArchive,
    colorClass: "border-stone-200 bg-stone-100 text-stone-700 hover:bg-stone-200",
    badgeColor: "#44403c",
  },
];

export type BidangTagValue = string;

export const formatBytes = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

export const getTagStyle = (tag: string) => {
  const found = BIDANG_TAGS.find((item) => item.value.toLowerCase() === tag.toLowerCase());
  return found?.colorClass ?? "border-stone-200 bg-stone-100 text-stone-700";
};
