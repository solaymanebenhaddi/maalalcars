import * as React from 'react'
import { cn } from '@/lib/utils'

export type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'purple'
  | 'orange'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    'bg-[var(--surface-elevated)] text-[var(--text-secondary)] border border-[var(--border)]',
  success:
    'bg-green-950/60 text-[var(--success)] border border-green-800/50',
  warning:
    'bg-amber-950/60 text-[var(--warning)] border border-amber-800/50',
  danger:
    'bg-red-950/60 text-[var(--danger)] border border-red-800/50',
  info:
    'bg-cyan-950/60 text-[var(--info)] border border-cyan-800/50',
  purple:
    'bg-purple-950/60 text-[var(--purple)] border border-purple-800/50',
  orange:
    'bg-orange-950/60 text-[var(--orange)] border border-orange-800/50',
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
