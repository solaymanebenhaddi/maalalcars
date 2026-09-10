'use client'

import * as React from 'react'
import { Globe, FileCheck2, Calendar, ShieldCheck, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export type VehicleCustomsStatus = 'MAROC' | 'DEDOUANEE'

export interface VehicleCustomsSelectorProps {
  initialStatus?: VehicleCustomsStatus
  initialYear?: number | null
  nameStatus?: string
  nameYear?: string
  vehicleYear?: number
  className?: string
  onChange?: (data: { customsStatus: VehicleCustomsStatus; customsYear: number | null }) => void
}

export function VehicleCustomsSelector({
  initialStatus = 'MAROC',
  initialYear = null,
  nameStatus = 'customsStatus',
  nameYear = 'customsYear',
  vehicleYear = new Date().getFullYear(),
  className,
  onChange,
}: VehicleCustomsSelectorProps) {
  const currentYear = new Date().getFullYear()

  const [status, setStatus] = React.useState<VehicleCustomsStatus>(initialStatus)
  const [customsYear, setCustomsYear] = React.useState<number | ''>(
    initialYear ?? (initialStatus === 'DEDOUANEE' ? currentYear : '')
  )

  const handleStatusChange = (newStatus: VehicleCustomsStatus) => {
    setStatus(newStatus)
    const yearVal = newStatus === 'DEDOUANEE' ? (customsYear || currentYear) : null
    if (newStatus === 'DEDOUANEE' && !customsYear) {
      setCustomsYear(currentYear)
    }
    onChange?.({
      customsStatus: newStatus,
      customsYear: yearVal,
    })
  }

  const handleYearChange = (yearNum: number) => {
    setCustomsYear(yearNum)
    onChange?.({
      customsStatus: status,
      customsYear: yearNum,
    })
  }

  // Quick years suggestions for customs clearance (from currentYear down to vehicleYear - 2 or max 10 years)
  const suggestedYears = React.useMemo(() => {
    const list: number[] = []
    const startYear = currentYear
    const minYear = Math.max(1995, Math.min(vehicleYear, currentYear - 6))
    for (let y = startYear; y >= minYear; y--) {
      list.push(y)
    }
    return list.slice(0, 7) // Top 7 recent years
  }, [currentYear, vehicleYear])

  return (
    <div className={cn('space-y-3 rounded-xl border border-[#262634] bg-[#14141c] p-4 shadow-sm', className)}>
      {/* Hidden inputs for native form submits */}
      <input type="hidden" name={nameStatus} value={status} />
      <input
        type="hidden"
        name={nameYear}
        value={status === 'DEDOUANEE' ? (customsYear || currentYear) : ''}
      />

      {/* Header with Title and Selected Origin Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-red-500" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Origine du Véhicule & Statut Douanier <span className="text-red-500">*</span>
          </span>
        </div>

        <div>
          {status === 'MAROC' ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
              <span>🇲🇦</span>
              <span>WW Maroc</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
              <Globe className="h-3 w-3 text-amber-400" />
              <span>Dédouanée {customsYear ? `(${customsYear})` : ''}</span>
            </span>
          )}
        </div>
      </div>

      {/* Segmented Selection: Maroc vs Dédouanée */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Option 1: WW Maroc */}
        <button
          type="button"
          onClick={() => handleStatusChange('MAROC')}
          className={cn(
            'group relative flex items-center justify-between rounded-xl p-3 text-left transition-all border',
            status === 'MAROC'
              ? 'border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500/30 shadow-md'
              : 'border-[#282836] bg-[#181822] hover:bg-[#1f1f2c] hover:border-zinc-600 text-zinc-300'
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg font-black transition-colors',
                status === 'MAROC'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-[#20202e] text-zinc-400 border border-[#2a2a3c]'
              )}
            >
              🇲🇦
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'text-xs font-bold',
                    status === 'MAROC' ? 'text-white' : 'text-zinc-200'
                  )}
                >
                  Maroc (WW Maroc)
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Acheté neuf au Maroc auprès du concessionnaire
              </p>
            </div>
          </div>

          <div
            className={cn(
              'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all',
              status === 'MAROC'
                ? 'border-emerald-500 bg-emerald-500 text-black'
                : 'border-zinc-700 bg-zinc-900'
            )}
          >
            {status === 'MAROC' && <Check className="h-3 w-3 stroke-[3]" />}
          </div>
        </button>

        {/* Option 2: Dédouanée */}
        <button
          type="button"
          onClick={() => handleStatusChange('DEDOUANEE')}
          className={cn(
            'group relative flex items-center justify-between rounded-xl p-3 text-left transition-all border',
            status === 'DEDOUANEE'
              ? 'border-amber-500 bg-amber-950/20 ring-1 ring-amber-500/30 shadow-md'
              : 'border-[#282836] bg-[#181822] hover:bg-[#1f1f2c] hover:border-zinc-600 text-zinc-300'
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg font-black transition-colors',
                status === 'DEDOUANEE'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-[#20202e] text-zinc-400 border border-[#2a2a3c]'
              )}
            >
              🌍
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'text-xs font-bold',
                    status === 'DEDOUANEE' ? 'text-white' : 'text-zinc-200'
                  )}
                >
                  Dédouanée (Importé)
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Importé de l&apos;étranger et dédouané au Maroc (D16 ter)
              </p>
            </div>
          </div>

          <div
            className={cn(
              'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all',
              status === 'DEDOUANEE'
                ? 'border-amber-500 bg-amber-500 text-black'
                : 'border-zinc-700 bg-zinc-900'
            )}
          >
            {status === 'DEDOUANEE' && <Check className="h-3 w-3 stroke-[3]" />}
          </div>
        </button>
      </div>

      {/* Conditional Section: Année de dédouanement (only when DEDOUANEE) */}
      {status === 'DEDOUANEE' && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5 space-y-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="block text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-amber-400" />
                <span>Année de Dédouanement au Maroc <span className="text-red-400">*</span></span>
              </label>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Année d&apos;obtention du quitus douanier ou certificat de dédouanement D16 ter.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="number"
                  min={1970}
                  max={currentYear + 1}
                  required
                  value={customsYear}
                  onChange={(e) => {
                    const val = e.target.value ? parseInt(e.target.value, 10) : ''
                    if (typeof val === 'number') {
                      handleYearChange(val)
                    } else {
                      setCustomsYear('')
                    }
                  }}
                  placeholder="Ex: 2023"
                  className="h-9 w-28 rounded-lg border border-amber-500/50 bg-[#16161f] px-3 font-mono text-sm font-bold text-amber-300 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Quick Year Suggestion Pills */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-amber-500/20">
            <span className="text-[10px] uppercase font-semibold text-zinc-400 mr-1 flex items-center gap-1">
              <FileCheck2 className="h-3 w-3 text-amber-400" />
              Sélection rapide :
            </span>
            {suggestedYears.map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => handleYearChange(yr)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-all',
                  customsYear === yr
                    ? 'bg-amber-500 text-black shadow-sm font-extrabold'
                    : 'bg-[#1e1e2c] border border-zinc-800 text-zinc-300 hover:text-white hover:border-amber-500/40'
                )}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
