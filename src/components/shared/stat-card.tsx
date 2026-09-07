import React from 'react'
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react'
import clsx from 'clsx'

export interface StatCardProps {
  title: string
  value: React.ReactNode
  subtitle?: string
  trend?: {
    value: React.ReactNode
    direction: 'up' | 'down' | 'neutral'
    label?: string
  }
  icon?: LucideIcon | React.ComponentType<{ className?: string }>
  iconColor?: 'red' | 'cyan' | 'green' | 'amber' | 'purple' | 'orange' | 'blue'
  className?: string
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  iconColor = 'red',
  className,
}: StatCardProps) {
  const getIconColors = () => {
    switch (iconColor) {
      case 'cyan':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
      case 'green':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      case 'amber':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
      case 'purple':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20'
      case 'orange':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/20'
      case 'blue':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
      default:
        return 'text-red-400 bg-red-500/10 border-red-500/20'
    }
  }

  return (
    <div
      className={clsx(
        'relative rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-sm transition-all hover:border-[#2e2e38] hover:bg-[#15151a]',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <span className="text-xs font-semibold text-zinc-400 tracking-wide">{title}</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-white tracking-tight font-mono">
              {value}
            </span>
          </div>
        </div>

        {Icon && (
          <div className={clsx('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border', getIconColors())}>
            <Icon className="h-4.5 w-4.5" />
          </div>
        )}
      </div>

      {(trend || subtitle) && (
        <div className="mt-3 flex items-center gap-2 pt-2 border-t border-[#1e1e24] text-[11px]">
          {trend && (
            <div
              className={clsx(
                'flex items-center gap-1 font-semibold',
                trend.direction === 'up' && 'text-emerald-400',
                trend.direction === 'down' && 'text-red-400',
                trend.direction === 'neutral' && 'text-zinc-400'
              )}
            >
              {trend.direction === 'up' && <TrendingUp className="h-3 w-3" />}
              {trend.direction === 'down' && <TrendingDown className="h-3 w-3" />}
              {trend.direction === 'neutral' && <Minus className="h-3 w-3" />}
              <span>{trend.value}</span>
            </div>
          )}

          {trend?.label && <span className="text-zinc-400">{trend.label}</span>}
          {subtitle && !trend && <span className="text-zinc-400">{subtitle}</span>}
        </div>
      )}
    </div>
  )
}
