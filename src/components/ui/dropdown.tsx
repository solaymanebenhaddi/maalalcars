'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface DropdownItem {
  label: string
  onClick?: () => void
  icon?: React.ReactNode
  disabled?: boolean
  danger?: boolean
  separator?: boolean
}

export interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  align?: 'left' | 'right'
  className?: string
  menuClassName?: string
}

export function Dropdown({ trigger, items, align = 'left', className, menuClassName }: DropdownProps) {
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Close on outside click
  React.useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Close on Escape
  React.useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <div onClick={() => setOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      {open && (
        <div
          className={cn(
            'absolute z-50 mt-1.5 min-w-[160px] rounded-lg overflow-hidden',
            'bg-[var(--surface-elevated)] border border-[var(--border)] shadow-xl',
            align === 'right' ? 'right-0' : 'left-0',
            'animate-in fade-in zoom-in-95 duration-150 origin-top',
            menuClassName
          )}
          role="menu"
        >
          {items.map((item, index) => {
            if (item.separator) {
              return (
                <div
                  key={index}
                  className="my-1 h-px bg-[var(--border)]"
                  role="separator"
                />
              )
            }

            return (
              <button
                key={index}
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick?.()
                    setOpen(false)
                  }
                }}
                className={cn(
                  'flex items-center gap-2.5 w-full px-3 py-2 text-sm text-left',
                  'transition-colors duration-100',
                  item.danger
                    ? 'text-[var(--danger)] hover:bg-red-950/40'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]',
                  item.disabled && 'opacity-40 cursor-not-allowed pointer-events-none'
                )}
              >
                {item.icon && (
                  <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                    {item.icon}
                  </span>
                )}
                {item.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
