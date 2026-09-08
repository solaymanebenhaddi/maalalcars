'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, Trash2, Check, X, Info } from 'lucide-react'
import clsx from 'clsx'

export interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

const emptySubscribe = () => () => {}
function useMounted() {
  return React.useSyncExternalStore(emptySubscribe, () => true, () => false)
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
  const mounted = useMounted()

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isLoading, onClose])

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen])

  if (!isOpen || !mounted) return null

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose()
        }
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl border border-[#282832] bg-[#121216] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          aria-label="Fermer"
          className="absolute top-4 right-4 rounded-lg p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4 pr-6">
          <div
            className={clsx(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border',
              variant === 'danger' && 'border-red-500/30 bg-red-500/10 text-red-500',
              variant === 'warning' && 'border-amber-500/30 bg-amber-500/10 text-amber-500',
              variant === 'info' && 'border-cyan-500/30 bg-cyan-500/10 text-cyan-500'
            )}
          >
            {variant === 'danger' ? (
              <Trash2 className="h-5 w-5" />
            ) : variant === 'warning' ? (
              <AlertTriangle className="h-5 w-5" />
            ) : (
              <Info className="h-5 w-5" />
            )}
          </div>

          <div className="flex-1">
            <h3 id="confirm-dialog-title" className="text-base font-bold text-white">
              {title}
            </h3>
            <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#222228] pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg border border-[#2c2c36] bg-[#16161c] px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-[#1e1e26] hover:text-white transition-colors disabled:opacity-50"
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

  return createPortal(modalContent, document.body)
}

// ----------------------------------------------------
// Imperative Hook & Context for useConfirm()
// ----------------------------------------------------

export interface ConfirmOptions {
  title?: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions | string) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null)

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean
    options: ConfirmOptions
    resolve?: (value: boolean) => void
  }>({
    isOpen: false,
    options: { title: 'Confirmation requise', description: '' },
  })

  // Global safety override: prevent native window.confirm and window.alert from ever appearing
  useEffect(() => {
    if (typeof window === 'undefined') return

    const originalAlert = window.alert
    const originalConfirm = window.confirm

    window.alert = (message?: unknown) => {
      console.warn('Native alert was intercepted:', message)
    }

    window.confirm = (message?: string) => {
      console.warn('Native window.confirm is disabled. Please use useConfirm() instead:', message)
      return false
    }

    return () => {
      window.alert = originalAlert
      window.confirm = originalConfirm
    }
  }, [])

  const confirm = useCallback((options: ConfirmOptions | string) => {
    return new Promise<boolean>((resolve) => {
      const opts: ConfirmOptions =
        typeof options === 'string'
          ? {
              title: 'Confirmation requise',
              description: options,
              confirmText: 'Confirmer',
              cancelText: 'Annuler',
              variant: 'danger',
            }
          : {
              title: options.title || 'Confirmation requise',
              description: options.description,
              confirmText: options.confirmText || 'Confirmer',
              cancelText: options.cancelText || 'Annuler',
              variant: options.variant || 'danger',
            }

      setDialogState({
        isOpen: true,
        options: opts,
        resolve,
      })
    })
  }, [])

  const handleClose = () => {
    if (dialogState.resolve) {
      dialogState.resolve(false)
    }
    setDialogState((prev) => ({ ...prev, isOpen: false }))
  }

  const handleConfirm = () => {
    if (dialogState.resolve) {
      dialogState.resolve(true)
    }
    setDialogState((prev) => ({ ...prev, isOpen: false }))
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <ConfirmDialog
        isOpen={dialogState.isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={dialogState.options.title || 'Confirmation requise'}
        description={dialogState.options.description}
        confirmText={dialogState.options.confirmText}
        cancelText={dialogState.options.cancelText}
        variant={dialogState.options.variant}
      />
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) {
    throw new Error('useConfirm must be used within a ConfirmProvider')
  }
  return ctx
}
