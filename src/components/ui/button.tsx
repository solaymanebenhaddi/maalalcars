'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { WheelSpinner } from '@/components/ui/wheel-spinner'

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  default:
    'bg-[var(--brand-red)] text-white hover:bg-[var(--brand-red-hover)] active:bg-[var(--brand-red-dark)] border border-[var(--brand-red)]',
  secondary:
    'bg-[var(--surface-elevated)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] border border-[var(--border)]',
  outline:
    'bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface-hover)] border border-[var(--border-light)]',
  ghost:
    'bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface-hover)] border border-transparent',
  destructive:
    'bg-[var(--danger)] text-white hover:bg-red-500 active:bg-red-700 border border-[var(--danger)]',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading && (
          <WheelSpinner
            size="sm"
            speed="normal"
            glow={false}
            className="shrink-0 -ml-0.5 mr-1"
          />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
