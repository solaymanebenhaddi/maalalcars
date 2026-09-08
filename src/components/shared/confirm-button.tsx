'use client'

import React, { useRef } from 'react'
import { useConfirm } from '@/components/modals/confirm-dialog'

interface ConfirmButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  dialogTitle?: string
  confirmMessage?: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  children: React.ReactNode
}

export function ConfirmButton({
  dialogTitle = 'Confirmation requise',
  confirmMessage = 'Êtes-vous sûr de vouloir effectuer cette action ?',
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'danger',
  children,
  onClick,
  ...props
}: ConfirmButtonProps) {
  const { confirm } = useConfirm()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const ok = await confirm({
      title: dialogTitle,
      description: confirmMessage,
      confirmText,
      cancelText,
      variant,
    })

    if (!ok) return

    // Safely submit the parent form or trigger custom onClick handler
    const form = buttonRef.current?.closest('form')
    if (form) {
      form.requestSubmit()
    } else if (onClick) {
      onClick(e)
    }
  }

  return (
    <button ref={buttonRef} {...props} onClick={handleClick}>
      {children}
    </button>
  )
}
