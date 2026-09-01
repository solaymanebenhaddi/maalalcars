'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, checked, ...props }, ref) => {
    const checkboxId = id ?? label?.toLowerCase().replace(/\s+/g, '-') ?? Math.random().toString(36).slice(2)

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          'flex items-start gap-3 cursor-pointer group',
          props.disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            checked={checked}
            className="sr-only peer"
            {...props}
          />
          {/* Custom checkbox visual */}
          <div
            className={cn(
              'w-4 h-4 rounded border shrink-0 transition-colors duration-150',
              'border-[var(--border-light)] bg-[var(--surface)]',
              'peer-checked:bg-[var(--brand-red)] peer-checked:border-[var(--brand-red)]',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--brand-red)] peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-[var(--background)]',
              'group-hover:border-[var(--brand-red-hover)]'
            )}
          >
            {checked && (
              <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5" strokeWidth={3} />
            )}
          </div>
        </div>
        {(label || description) && (
          <div className="flex flex-col gap-0.5">
            {label && (
              <span className="text-sm font-medium text-[var(--text-primary)] leading-none">
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs text-[var(--text-muted)]">{description}</span>
            )}
          </div>
        )}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'
