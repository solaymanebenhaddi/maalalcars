'use client'

import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { PieChart as PieIcon } from 'lucide-react'

interface CapitalDistributionProps {
  totalCapital: number
  stockLibreAmount: number
  reservedAmount: number
  workshopAmount: number
  stockLibrePct: number
  reservedPct: number
  workshopPct: number
  estimatedSaleValue: number
  advancesHeld: number
  receivables: number
}

function formatMAD(val: number): string {
  return `${val.toLocaleString('fr-MA')} DH`
}

export function CapitalDistributionDonut({
  totalCapital,
  stockLibreAmount,
  reservedAmount,
  workshopAmount,
  stockLibrePct,
  reservedPct,
  workshopPct,
  estimatedSaleValue,
  advancesHeld,
  receivables,
}: CapitalDistributionProps) {
  const hasData = totalCapital > 0
  const data = [
    { name: 'Stock libre disponible', value: stockLibreAmount, color: '#06b6d4', pct: stockLibrePct },
    { name: 'Sous réservation client', value: reservedAmount, color: '#f59e0b', pct: reservedPct },
    { name: 'En atelier / réparation', value: workshopAmount, color: '#a855f7', pct: workshopPct },
  ].filter((d) => d.value > 0)

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#1e2029] bg-[#121318] p-5 shadow-lg shadow-black/40 min-h-[420px]">
      {/* 1. Header */}
      <div className="flex items-center gap-2.5 border-b border-[#1c1e28] pb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.25)]">
          <PieIcon className="h-4 w-4" />
        </div>
        <h3 className="text-xs sm:text-sm font-bold tracking-wider text-white uppercase font-sans">
          Répartition du Capital Stock
        </h3>
      </div>

      {/* 2. Donut Canvas + Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 flex-1">
        {/* Donut Chart with Center Text */}
        <div className="relative h-[190px] w-[190px] flex-shrink-0 flex items-center justify-center">
          {!hasData ? (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="h-[140px] w-[140px] rounded-full border-2 border-dashed border-[#242636] flex items-center justify-center">
                <div>
                  <span className="text-sm font-bold text-zinc-500 block">0 DH</span>
                  <span className="text-[9px] uppercase font-bold text-zinc-600 tracking-wider">Aucun véhicule</span>
                </div>
              </div>
            </div>
          ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const seg = payload[0]
                      return (
                        <div className="rounded-lg border border-[#2a2d3d] bg-[#0d0e14]/95 p-2 text-xs shadow-xl backdrop-blur-md">
                          <div className="font-semibold text-white">{seg.name}</div>
                          <div className="font-mono text-cyan-400 font-bold">
                            {formatMAD(Number(seg.value))} ({seg.payload.pct}%)
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={84}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="#121318"
                  strokeWidth={3}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Central Donut Overlay */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-base sm:text-lg font-black text-white font-mono leading-tight">
                {formatMAD(totalCapital)}
              </span>
              <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider">
                TOTAL STOCK
              </span>
            </div>
          </>
          )}
        </div>

        {/* Legend Right Side */}
        <div className="space-y-3 text-xs flex-1 w-full pl-0 sm:pl-2">
          {/* Stock Libre */}
          <div className="flex items-start gap-2">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#06b6d4] flex-shrink-0" />
            <div>
              <span className="text-zinc-300 font-medium block leading-tight">
                Stock libre disponible
              </span>
              <span className="text-[11px] text-zinc-400 font-mono font-bold">
                ({stockLibrePct}%)
              </span>
            </div>
          </div>

          {/* Sous réservation */}
          <div className="flex items-start gap-2">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b] flex-shrink-0" />
            <div>
              <span className="text-zinc-300 font-medium block leading-tight">
                Sous réservation client
              </span>
              <span className="text-[11px] text-amber-400 font-mono font-bold">
                ({reservedPct}%)
              </span>
            </div>
          </div>

          {/* En atelier */}
          <div className="flex items-start gap-2">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-purple-400 shadow-[0_0_6px_#a855f7] flex-shrink-0" />
            <div>
              <span className="text-zinc-300 font-medium block leading-tight">
                En atelier / réparation
              </span>
              <span className="text-[11px] text-purple-400 font-mono font-bold">
                ({workshopPct}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom 3 Financial Metrics */}
      <div className="grid grid-cols-3 gap-2 border-t border-[#1c1e28] pt-3 text-[11px]">
        <div>
          <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider block">
            VALEUR VENTE ESTIMÉE
          </span>
          <span className="text-xs sm:text-sm font-black text-white font-mono mt-0.5 block">
            {formatMAD(estimatedSaleValue)}
          </span>
        </div>

        <div>
          <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider block">
            ACOMPTES EN CAISSE
          </span>
          <span className="text-xs sm:text-sm font-black text-emerald-400 font-mono mt-0.5 block">
            +{formatMAD(advancesHeld)}
          </span>
        </div>

        <div>
          <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider block">
            CRÉANCES SUR VENTES
          </span>
          <span className="text-xs sm:text-sm font-black text-amber-400 font-mono mt-0.5 block">
            {formatMAD(receivables)}
          </span>
        </div>
      </div>
    </div>
  )
}
