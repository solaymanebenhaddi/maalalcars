'use client'

import React from 'react'

interface ConfirmButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  confirmMessage?: string
  children: React.ReactNode
}

export function ConfirmButton({
  confirmMessage = 'Êtes-vous sûr de vouloir effectuer cette action ?',
  children,
  onClick,
  ...props
}: ConfirmButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!window.confirm(confirmMessage)) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <button {...props} onClick={handleClick}>
      {children}
    </button>
  )
}
