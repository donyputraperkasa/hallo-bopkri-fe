"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle open / close animations
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      // Double requestAnimationFrame untuk memastikan initial state ter-render sebelum transisi aktif
      const frame1 = requestAnimationFrame(() => {
        const frame2 = requestAnimationFrame(() => {
          setIsVisible(true);
        });
        return () => cancelAnimationFrame(frame2);
      });
      return () => cancelAnimationFrame(frame1);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsRendered(false);
      }, 260); // Durasi transisi keluar selesai
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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

  if (!isRendered || !mounted) return null;

  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
  }[maxWidth];

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop Lembut dengan Efek Fade In & Fade Out Halus */}
      <div
        className={`fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-300 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Box dengan Animasi Meluncur Lembut (Fluid Glide & Spring Deceleration) */}
      <div
        className={`relative z-10 flex max-h-[90vh] w-full ${maxWidthClass} flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl my-auto transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-[0.95] translate-y-6"
        }`}
      >
        {/* Header Modal Bersih & Elegan */}
        <header className="relative flex shrink-0 items-center justify-between border-b border-stone-200 bg-stone-50/90 px-6 py-4">
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
            className="grid size-8 shrink-0 place-items-center rounded-lg border border-stone-200 bg-white text-stone-400 transition hover:border-stone-300 hover:bg-stone-100 hover:text-stone-700 cursor-pointer shadow-xs active:scale-95"
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

  return createPortal(modalContent, document.body);
}
