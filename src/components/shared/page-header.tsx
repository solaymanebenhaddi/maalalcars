import React from 'react'
import Link from 'next/link'
import { Plus, Download, RefreshCw, ChevronRight, type LucideIcon } from 'lucide-react'

export interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: Array<{ label: string; href?: string }>
  actions?: React.ReactNode
  primaryAction?: {
    label: string
    href?: string
    onClick?: () => void
    icon?: LucideIcon
  }
  onExport?: () => void
  onRefresh?: () => void
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  primaryAction,
  onExport,
  onRefresh,
}: PageHeaderProps) {
  const PrimaryIcon = primaryAction?.icon || Plus

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#222228] pb-5">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-1.5 flex items-center gap-1.5 text-xs text-zinc-400">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="h-3 w-3 text-zinc-400" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-zinc-200 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-zinc-300 font-medium">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">{title}</h1>
        {subtitle && <p className="mt-1 text-xs sm:text-sm text-zinc-400">{subtitle}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#222228] bg-[#141418] text-zinc-300 hover:bg-[#1c1c24] hover:text-white"
            title="Actualiser les données"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}

        {onExport && (
          <button
            onClick={onExport}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-[#222228] bg-[#141418] px-3 text-xs font-semibold text-zinc-300 hover:bg-[#1c1c24] hover:text-white"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Exporter</span>
          </button>
        )}

        {actions}

        {primaryAction && (
          primaryAction.href ? (
            <Link
              href={primaryAction.href}
              className="flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:from-red-500 hover:to-red-600 transition-all"
            >
              <PrimaryIcon className="h-4 w-4" />
              <span>{primaryAction.label}</span>
            </Link>
          ) : (
            <button
              onClick={primaryAction.onClick}
              className="flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:from-red-500 hover:to-red-600 transition-all"
            >
              <PrimaryIcon className="h-4 w-4" />
              <span>{primaryAction.label}</span>
            </button>
          )
        )}
      </div>
    </div>
  )
}
