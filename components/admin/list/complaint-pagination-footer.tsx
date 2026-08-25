"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface ComplaintPaginationFooterProps {
  filteredCount: number;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ComplaintPaginationFooter({
  filteredCount,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
}: ComplaintPaginationFooterProps) {
  return (
    <footer className="flex items-center justify-between border-t border-[#dbe5f4] bg-[#f8fbff] p-4 text-xs text-[#748299]">
      <p>
        Menampilkan <strong>{filteredCount}</strong> dari <strong>{totalCount}</strong> total aduan
      </p>
      <div className="flex items-center gap-2">
        <button
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#dbe5f4] bg-white text-[#0f2a4f] hover:bg-[#f8fbff] disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="font-semibold text-[#172033]">
          {currentPage} / {totalPages || 1}
        </span>
        <button
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#dbe5f4] bg-white text-[#0f2a4f] hover:bg-[#f8fbff] disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Halaman berikutnya"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </footer>
  );
}
