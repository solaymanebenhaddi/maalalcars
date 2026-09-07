import React from 'react'
import { financialService } from '@/services/financial.service'
import clsx from 'clsx'

export interface CurrencyProps {
  amount: number | null | undefined
  className?: string
  colored?: boolean
  prefix?: string
}

export function Currency({ amount, className, colored = false, prefix }: CurrencyProps) {
  const formatted = financialService.formatMAD(amount)

  let colorClass = 'text-white'
  if (colored && amount !== null && amount !== undefined) {
    if (amount > 0) colorClass = 'text-emerald-400'
    else if (amount < 0) colorClass = 'text-red-400'
    else colorClass = 'text-zinc-400'
  }

  return (
    <span className={clsx('font-mono font-bold tracking-tight', colorClass, className)}>
      {prefix && `${prefix} `}
      {formatted}
    </span>
  )
}
