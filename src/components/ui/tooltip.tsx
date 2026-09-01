'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  position?: TooltipPosition
  className?: string
  contentClassName?: string
  delay?: number
}

const positionClasses: Record<TooltipPosition, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
}

const arrowClasses: Record<TooltipPosition, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-[var(--surface-elevated)] border-x-transparent border-b-transparent border-4',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[var(--surface-elevated)] border-x-transparent border-t-transparent border-4',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-[var(--surface-elevated)] border-y-transparent border-r-transparent border-4',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-[var(--surface-elevated)] border-y-transparent border-l-transparent border-4',
}

export function Tooltip({
  content,
  children,
  position = 'top',
  className,
  contentClassName,
}: TooltipProps) {
  const [visible, setVisible] = React.useState(false)

  return (
    <span
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && content && (
        <span
          role="tooltip"
          className={cn(
            'absolute z-50 pointer-events-none whitespace-nowrap',
            'px-2.5 py-1.5 rounded-md text-xs font-medium',
            'bg-[var(--surface-elevated)] text-[var(--text-primary)]',
            'border border-[var(--border)] shadow-lg',
            positionClasses[position],
            contentClassName
          )}
        >
          {content}
          <span
            className={cn('absolute border', arrowClasses[position])}
            aria-hidden="true"
          />
        </span>
      )}
    </span>
  )
}
