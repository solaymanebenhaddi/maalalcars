'use client'

import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'

interface SimulationStatusData {
  name: string
  count: number
  percentage: string
  color: string
}

const DATA: SimulationStatusData[] = [
  { name: 'Acceptées', count: 86, percentage: '44,3%', color: '#22c55e' },
  { name: 'En attente', count: 62, percentage: '32,0%', color: '#f59e0b' },
  { name: 'Refusées', count: 28, percentage: '14,4%', color: '#ef4444' },
  { name: 'Abandonnées', count: 18, percentage: '9,3%', color: '#64748b' },
]

export function FinancingSimulationsDonut({ total = 194, conversionRate = '44,3%' }: { total?: number; conversionRate?: string }) {
  return (
    <div className="flex flex-col items-center justify-between gap-4 h-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
        {/* Donut Container */}
        <div className="relative h-44 w-44 shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload as SimulationStatusData
                    return (
                      <div className="rounded-lg border border-[#282834] bg-[#121216] px-3 py-2 text-xs shadow-2xl">
                        <span className="font-bold text-white block">{d.name}</span>
                        <span className="text-zinc-400 text-[11px]">
                          {d.count} ({d.percentage})
                        </span>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Pie
                data={DATA}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={76}
                paddingAngle={2}
                dataKey="count"
                stroke="#121216"
                strokeWidth={2}
              >
                {DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-black text-white font-mono">{total}</span>
            <span className="text-[10px] font-semibold text-zinc-400">Simulations</span>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full flex-1 space-y-2">
          {DATA.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-zinc-300 font-medium text-xs">{item.name}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <span className="font-bold text-white text-xs">{item.count}</span>
                <span className="text-[10px] text-zinc-400">({item.percentage})</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Conversion Badge matching Reference #09 Screen 0 */}
      <div className="w-full rounded-xl bg-emerald-500/10 border border-emerald-500/20 py-2 px-3 text-center">
        <span className="text-xs font-semibold text-emerald-400">
          Taux de conversion : <strong className="font-black font-mono">{conversionRate}</strong>
        </span>
      </div>
    </div>
  )
}
