'use client'

import { Printer } from 'lucide-react'
import clsx from 'clsx'

export interface PrintButtonProps {
  label?: string
  className?: string
}

export function PrintButton({
  label = 'Imprimer / Exporter en PDF',
  className,
}: PrintButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={clsx(
        'flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500',
        className
      )}
    >
      <Printer className="h-4 w-4" />
      <span>{label}</span>
    </button>
  )
}
