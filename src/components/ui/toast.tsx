'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  message: string
  title?: string
  variant?: ToastVariant
  duration?: number
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  toast: {
    default: (message: string, title?: string) => void
    success: (message: string, title?: string) => void
    error: (message: string, title?: string) => void
    warning: (message: string, title?: string) => void
    info: (message: string, title?: string) => void
  }
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

const emptySubscribe = () => () => {}
function useMounted() {
  return React.useSyncExternalStore(emptySubscribe, () => true, () => false)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])
  const mounted = useMounted()

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    const duration = toast.duration ?? 5000
    setToasts((prev) => [...prev, { ...toast, id }])
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = React.useMemo(
    () => ({
      default: (message: string, title?: string) =>
        addToast({ message, title, variant: 'default' }),
      success: (message: string, title?: string) =>
        addToast({ message, title, variant: 'success' }),
      error: (message: string, title?: string) =>
        addToast({ message, title, variant: 'error' }),
      warning: (message: string, title?: string) =>
        addToast({ message, title, variant: 'warning' }),
      info: (message: string, title?: string) =>
        addToast({ message, title, variant: 'info' }),
    }),
    [addToast]
  )

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, toast }}>
      {children}
      {mounted &&
        typeof document !== 'undefined' &&
        createPortal(
          <ToastContainer toasts={toasts} onRemove={removeToast} />,
          document.body
        )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}

const variantConfig: Record<
  ToastVariant,
  { icon: React.ReactNode; borderColor: string; iconColor: string }
> = {
  default: {
    icon: null,
    borderColor: 'border-[var(--border-light)]',
    iconColor: '',
  },
  success: {
    icon: <CheckCircle className="w-4 h-4 shrink-0" />,
    borderColor: 'border-green-700/60',
    iconColor: 'text-[var(--success)]',
  },
  error: {
    icon: <AlertCircle className="w-4 h-4 shrink-0" />,
    borderColor: 'border-red-700/60',
    iconColor: 'text-[var(--danger)]',
  },
  warning: {
    icon: <AlertTriangle className="w-4 h-4 shrink-0" />,
    borderColor: 'border-amber-700/60',
    iconColor: 'text-[var(--warning)]',
  },
  info: {
    icon: <Info className="w-4 h-4 shrink-0" />,
    borderColor: 'border-cyan-700/60',
    iconColor: 'text-[var(--info)]',
  },
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const variant = toast.variant ?? 'default'
  const config = variantConfig[variant]

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 w-80 rounded-lg border p-4',
        'bg-[var(--surface-elevated)] shadow-xl',
        'animate-in slide-in-from-right-full duration-300',
        config.borderColor
      )}
    >
      {config.icon && (
        <span className={cn('mt-0.5', config.iconColor)}>{config.icon}</span>
      )}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-semibold text-[var(--text-primary)] mb-0.5">
            {toast.title}
          </p>
        )}
        <p className="text-sm text-[var(--text-secondary)] break-words">{toast.message}</p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className={cn(
          'shrink-0 rounded p-0.5 text-[var(--text-muted)]',
          'hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]',
          'transition-colors duration-150'
        )}
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[]
  onRemove: (id: string) => void
}) {
  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  )
}
