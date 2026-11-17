"use client"

import { Headphones, MessageCircle, X } from 'lucide-react'
import { useState } from 'react'
import catImg from './cat.png'

const catSrc = typeof catImg === 'string' ? catImg : catImg.src

export function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false)
  const itWhatsappUrl =
    'https://wa.me/6282236343404?text=Halo%20mas%20don,%20saya%20membutuhkan%20bantuan%20sistem%20Dokumen%20Sekolahku.'

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          className="floating-backdrop"
          onClick={() => setIsOpen(false)}
          aria-label="Tutup menu bantuan"
        />
      ) : null}

      <div className="floating-contact-container">
        {isOpen ? (
          <section className="floating-help-card">
            <div className="floating-help-header">
              <div>
                <p className="floating-help-title">Bantuan sistem</p>
                <p className="floating-help-subtitle">
                  Klik tombol di bawah ini apabila menemukan masalah
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="floating-close-btn"
                aria-label="Tutup menu bantuan"
              >
                <X size={17} aria-hidden="true" />
              </button>
            </div>

            <a
              href={itWhatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="floating-wa-btn"
            >
              <Headphones size={18} aria-hidden="true" />
              Hallo masdon
            </a>
          </section>
        ) : null}

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="floating-cat-btn"
          aria-label={isOpen ? 'Tutup menu bantuan' : 'Buka menu bantuan'}
          title="Bantuan WhatsApp"
        >
          <img
            src={catSrc}
            alt="Bantuan"
            width={54}
            height={54}
            className="floating-cat-img"
          />
          <span className="floating-cat-badge">
            <MessageCircle size={16} color="#ffffff" strokeWidth={2} aria-hidden="true" />
          </span>
        </button>
      </div>
    </>
  )
}

export default FloatingContact
