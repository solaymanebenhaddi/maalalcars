'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DialogProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

const emptySubscribe = () => () => {}
function useMounted() {
  return React.useSyncExternalStore(emptySubscribe, () => true, () => false)
}

export function Dialog({ open, onClose, children, className }: DialogProps) {
  const mounted = useMounted()

  // Close on Escape key
  React.useEffect(() => {
    if (!open || !mounted) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, mounted, onClose])

  // Prevent body scroll when open
  React.useEffect(() => {
    if (open && mounted && typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden'
    } else if (typeof document !== 'undefined') {
      document.body.style.overflow = ''
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = ''
      }
    }
  }, [open, mounted])

  if (!mounted || !open || typeof document === 'undefined') return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Content panel */}
      <div
        className={cn(
          'relative z-10 w-full max-w-lg rounded-xl border border-[var(--border)]',
          'bg-[var(--surface-elevated)] shadow-2xl',
          'animate-in fade-in zoom-in-95 duration-150',
          className
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void
}

export function DialogHeader({ className, children, onClose, ...props }: DialogHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 p-6 pb-4',
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className={cn(
            'shrink-0 rounded-md p-1 text-[var(--text-muted)]',
            'hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]',
            'transition-colors duration-150'
          )}
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export function DialogTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn('text-lg font-semibold text-[var(--text-primary)]', className)}
      {...props}
    >
      {children}
    </h2>
  )
}

export function DialogDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-sm text-[var(--text-muted)]', className)}
      {...props}
    >
      {children}
    </p>
  )
}

export function DialogFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 p-6 pt-4 border-t border-[var(--border)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function DialogContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('px-6 py-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}
