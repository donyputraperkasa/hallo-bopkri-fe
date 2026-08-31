"use client";

import { useEffect, type ReactNode } from "react";
import { X, type LucideIcon } from "lucide-react";

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  children: ReactNode;
}

export function ActionModal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  maxWidth = "2xl",
  children,
}: ActionModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
  }[maxWidth];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
    >
      {/* Backdrop Lembut */}
      <div
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs modal-backdrop-enter"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Box (Klasik, Bersih & Terang) */}
      <div
        className={`relative z-10 flex max-h-[92vh] w-full ${maxWidthClass} flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl modal-panel-enter`}
      >
        {/* Header Modal Bersih & Elegan (Tidak Terlalu Biru/Overkill) */}
        <header className="relative flex shrink-0 items-center justify-between border-b border-stone-200 bg-stone-50/80 px-6 py-4">
          <div className="flex items-center gap-3.5 pr-4">
            {Icon && (
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#eef4fb] text-[#1f4f8f] border border-[#d8e3f4] shadow-xs">
                <Icon size={20} />
              </span>
            )}
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-stone-900 sm:text-xl">
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs text-stone-500 line-clamp-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jendela"
            className="grid size-8 shrink-0 place-items-center rounded-lg border border-stone-200 bg-white text-stone-400 transition hover:border-stone-300 hover:bg-stone-100 hover:text-stone-700 cursor-pointer shadow-xs"
          >
            <X size={17} />
          </button>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}
