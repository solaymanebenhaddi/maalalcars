'use client'

import React from 'react'
import {
  Car,
  Bookmark,
  Wrench,
  DollarSign,
  Layers,
  BarChart3,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import clsx from 'clsx'

export type SparklineVariant = 'line' | 'bar' | 'area'
export type SparklineColor = 'cyan' | 'amber' | 'purple' | 'teal' | 'blue' | 'green'

export type KpiIconType =
  | 'dollar'
  | 'bookmark'
  | 'wrench'
  | 'car'
  | 'layers'
  | 'chart'
  | 'trending'
  | 'wallet'

interface DashboardKpiCardProps {
  title: string
  value: string | number
  trend: {
    prefix?: string
    value: string
    label: string
    color?: 'emerald' | 'cyan' | 'red' | 'amber' | 'blue' | 'zinc'
  }
  topLeftBadge?: {
    iconType: KpiIconType
    color?: 'emerald' | 'amber' | 'purple' | 'cyan' | 'blue'
  }
  topRightBadge?: {
    iconType: KpiIconType
    color?: 'emerald' | 'amber' | 'purple' | 'cyan' | 'blue'
    isCircle?: boolean
  }
  sparklineData: number[]
  sparklineVariant: SparklineVariant
  sparklineColor: SparklineColor
}

const SPARK_COLORS: Record<SparklineColor, { main: string; bright: string; dark: string; glow: string }> = {
  cyan: { main: '#06b6d4', bright: '#22d3ee', dark: '#0891b2', glow: 'rgba(6,182,212,0.7)' },
  amber: { main: '#f59e0b', bright: '#fbbf24', dark: '#d97706', glow: 'rgba(245,158,11,0.7)' },
  purple: { main: '#a855f7', bright: '#c084fc', dark: '#7c3aed', glow: 'rgba(168,85,247,0.7)' },
  teal: { main: '#14b8a6', bright: '#2dd4bf', dark: '#0d9488', glow: 'rgba(20,184,166,0.7)' },
  blue: { main: '#3b82f6', bright: '#60a5fa', dark: '#2563eb', glow: 'rgba(59,130,246,0.5)' },
  green: { main: '#10b981', bright: '#34d399', dark: '#059669', glow: 'rgba(16,185,129,0.7)' },
}

function normalizeData(data: number[]): number[] {
  if (!data.length) return []
  const max = Math.max(...data)
  if (max === 0) return data.map(() => 0.05) // tiny baseline when all zeros
  return data.map((d) => d / max)
}

function buildSmoothPath(points: Array<{ x: number; y: number }>): string {
  if (points.length < 2) return ''
  let path = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const cpx1 = prev.x + (curr.x - prev.x) * 0.4
    const cpx2 = curr.x - (curr.x - prev.x) * 0.4
    path += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`
  }
  return path
}

function renderSparklineContent(
  data: number[],
  variant: SparklineVariant,
  color: SparklineColor,
) {
  const c = SPARK_COLORS[color]
  const normalized = normalizeData(data)
  const uid = `${color}-${variant}`

  if (variant === 'line') {
    const padX = 10
    const padY = 10
    const viewW = 160
    const viewH = 60
    const w = viewW - 2 * padX
    const h = viewH - 2 * padY

    const points = normalized.map((d, i) => ({
      x: padX + (i / Math.max(normalized.length - 1, 1)) * w,
      y: padY + h - d * h,
    }))

    const pathD = buildSmoothPath(points)

    return (
      <svg className="w-full h-full" viewBox={`0 0 ${viewW} ${viewH}`} fill="none">
        <defs>
          <linearGradient id={`lg-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={c.main} stopOpacity="0.3" />
            <stop offset="50%" stopColor={c.bright} stopOpacity="0.8" />
            <stop offset="100%" stopColor={c.main} stopOpacity="1" />
          </linearGradient>
          <filter id={`gl-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={c.main} floodOpacity="0.7" />
          </filter>
        </defs>
        <path
          d={pathD}
          stroke={`url(#lg-${uid})`}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          filter={`url(#gl-${uid})`}
        />
      </svg>
    )
  }

  if (variant === 'bar') {
    const viewW = 140
    const viewH = 50
    const barW = 6
    const count = normalized.length
    const gap = (viewW - count * barW) / (count + 1)

    const bars = normalized.map((d, i) => {
      const h = Math.max(3, d * 42)
      return { x: gap + i * (barW + gap), y: viewH - h, h }
    })

    return (
      <svg className="w-full h-full" viewBox={`0 0 ${viewW} ${viewH}`} fill="none">
        <defs>
          <linearGradient id={`eq-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.bright} />
            <stop offset="100%" stopColor={c.dark} stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {bars.map((bar, i) => (
          <rect
            key={i}
            x={bar.x}
            y={bar.y}
            width={barW}
            height={bar.h}
            rx="2"
            fill={`url(#eq-${uid})`}
            className={`drop-shadow-[0_0_4px_${c.glow}]`}
          />
        ))}
      </svg>
    )
  }

  // area variant
  const padX = 5
  const viewW = 160
  const viewH = 55

  const w = viewW - 2 * padX
  const h = viewH - 10

  const points = normalized.map((d, i) => ({
    x: padX + (i / Math.max(normalized.length - 1, 1)) * w,
    y: 5 + h - d * h,
  }))

  const lineD = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ')
  const areaD = `${lineD} L ${points[points.length - 1].x} ${viewH} L ${points[0].x} ${viewH} Z`

  return (
    <svg className="w-full h-full" viewBox={`0 0 ${viewW} ${viewH}`} fill="none">
      <defs>
        <linearGradient id={`ag-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.bright} stopOpacity="0.45" />
          <stop offset="100%" stopColor={c.dark} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#ag-${uid})`} />
      <path
        d={lineD}
        stroke={c.bright}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        className={`drop-shadow-[0_0_5px_${c.glow}]`}
      />
    </svg>
  )
}

function renderKpiIcon(type?: KpiIconType, className?: string) {
  switch (type) {
    case 'dollar':
      return <DollarSign className={className} />
    case 'bookmark':
      return <Bookmark className={className} />
    case 'wrench':
      return <Wrench className={className} />
    case 'car':
      return <Car className={className} />
    case 'layers':
      return <Layers className={className} />
    case 'chart':
      return <BarChart3 className={className} />
    case 'trending':
      return <TrendingUp className={className} />
    case 'wallet':
      return <Wallet className={className} />
    default:
      return null
  }
}

export function DashboardKpiCard({
  title,
  value,
  trend,
  topLeftBadge,
  topRightBadge,
  sparklineData,
  sparklineVariant,
  sparklineColor,
}: DashboardKpiCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#1e2029] bg-[#121318] p-4 sm:p-5 shadow-lg shadow-black/40 transition-all duration-200 hover:border-[#2a2d3d] hover:shadow-black/60 group flex flex-col justify-between min-h-[132px]">
      {/* Background Data-Driven Sparkline */}
      <div className="pointer-events-none absolute right-2 bottom-1.5 w-36 h-16 sm:w-44 sm:h-20 opacity-90 transition-opacity group-hover:opacity-100 flex items-end justify-end">
        {renderSparklineContent(sparklineData, sparklineVariant, sparklineColor)}
      </div>

      {/* Top Row: Title + Corner Badges */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {topLeftBadge && (
            <div
              className={clsx(
                'flex h-6 w-6 items-center justify-center rounded-md border text-xs',
                topLeftBadge.color === 'emerald' && 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
                topLeftBadge.color === 'amber' && 'border-amber-500/30 bg-amber-500/10 text-amber-400',
                topLeftBadge.color === 'purple' && 'border-purple-500/30 bg-purple-500/10 text-purple-400',
                topLeftBadge.color === 'cyan' && 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
                topLeftBadge.color === 'blue' && 'border-blue-500/30 bg-blue-500/10 text-blue-400'
              )}
            >
              {renderKpiIcon(topLeftBadge.iconType, 'h-3.5 w-3.5')}
            </div>
          )}
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            {title}
          </span>
        </div>

        {topRightBadge && (
          <div
            className={clsx(
              'flex items-center justify-center',
              topRightBadge.isCircle
                ? 'h-6 w-6 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400'
                : 'h-6 w-6 text-zinc-400',
              topRightBadge.color === 'cyan' && 'text-cyan-400',
              topRightBadge.color === 'amber' && 'text-amber-400',
              topRightBadge.color === 'purple' && 'text-purple-400',
              topRightBadge.color === 'emerald' && 'text-emerald-400',
              topRightBadge.color === 'blue' && 'text-blue-400'
            )}
          >
            {renderKpiIcon(topRightBadge.iconType, 'h-4 w-4')}
          </div>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="relative z-10 mt-2 mb-2.5">
        <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
          {value}
        </div>
      </div>

      {/* Bottom Trend Strip */}
      <div className="relative z-10 flex flex-wrap items-center gap-1.5 text-xs">
        <span
          className={clsx(
            'font-semibold flex items-center gap-0.5',
            trend.color === 'emerald' && 'text-emerald-400',
            trend.color === 'cyan' && 'text-cyan-400',
            trend.color === 'amber' && 'text-amber-400',
            trend.color === 'red' && 'text-red-400',
            trend.color === 'blue' && 'text-blue-400',
            trend.color === 'zinc' && 'text-zinc-400',
            !trend.color && 'text-emerald-400'
          )}
        >
          {trend.prefix && <span>{trend.prefix}</span>}
          <span>{trend.value}</span>
        </span>
        <span className="text-zinc-400 text-[11px]">{trend.label}</span>
      </div>
    </div>
  )
}
