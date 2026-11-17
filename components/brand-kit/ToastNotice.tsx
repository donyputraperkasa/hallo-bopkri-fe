import React from 'react'
import { AlertCircle, X } from 'lucide-react'

export interface ToastNoticeProps {
  message: string | null
  onClose: () => void
}

export const ToastNotice: React.FC<ToastNoticeProps> = ({ message, onClose }) => {
  if (!message) return null

  return (
    <div className="toast-backdrop" onClick={onClose} role="presentation">
      <div className="toast-notice" role="alert" onClick={(e) => e.stopPropagation()}>
        <div className="toast-icon-wrap">
          <AlertCircle size={22} className="toast-icon" />
        </div>
        <div className="toast-text-wrap">
          <span className="toast-text">{message}</span>
        </div>
        <button
          type="button"
          className="toast-close-btn"
          onClick={onClose}
          aria-label="Tutup notifikasi"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}

export default ToastNotice
