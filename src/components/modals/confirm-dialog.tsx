'use client'

import React from 'react'
import { AlertTriangle, Trash2, Check } from 'lucide-react'
import clsx from 'clsx'

export interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-[#282832] bg-[#121216] p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div
            className={clsx(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border',
              variant === 'danger' && 'border-red-500/30 bg-red-500/10 text-red-500',
              variant === 'warning' && 'border-amber-500/30 bg-amber-500/10 text-amber-500',
              variant === 'info' && 'border-cyan-500/30 bg-cyan-500/10 text-cyan-500'
            )}
          >
            {variant === 'danger' ? <Trash2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          </div>

          <div className="flex-1">
            <h3 className="text-base font-bold text-white">{title}</h3>
            <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#222228] pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg border border-[#2c2c36] bg-[#16161c] px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-[#1e1e26] hover:text-white transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={clsx(
              'flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold text-white shadow-lg transition-all',
              variant === 'danger' && 'bg-red-600 hover:bg-red-500 shadow-red-950/50',
              variant === 'warning' && 'bg-amber-600 hover:bg-amber-500 shadow-amber-950/50',
              variant === 'info' && 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-950/50',
              isLoading && 'opacity-70 cursor-not-allowed'
            )}
          >
            {isLoading ? (
              <span>Traitement...</span>
            ) : (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
