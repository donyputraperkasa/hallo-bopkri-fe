"use client"

import React from 'react'
import catImg from './cat.png'

const catSrc = typeof catImg === 'string' ? catImg : catImg.src

interface GlobalLoadingProps {
  isLoading: boolean
  text?: string
}

export const GlobalLoading: React.FC<GlobalLoadingProps> = ({
  isLoading,
  text = 'bentar yaaa',
}) => {
  if (!isLoading) return null

  return (
    <div className="satelyd-loading-backdrop" role="status" aria-live="polite">
      <div className="satelyd-loading-card">
        <img
          src={catSrc}
          alt="Loading"
          width={110}
          height={110}
          className="satelyd-loading-cat"
        />
        <p className="satelyd-loading-text">{text}</p>
        <div className="satelyd-loading-bar-track">
          <div className="satelyd-loading-bar-fill" />
        </div>
      </div>
    </div>
  )
}

export default GlobalLoading
