'use client'

import React from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts'

interface ProfitItem {
  name: string
  percentage: number
  color: string
}

const PROFIT_SOURCES: ProfitItem[] = [
  { name: 'Ventes de véhicules', percentage: 72, color: '#06b6d4' },
  { name: 'Frais d’immatriculation', percentage: 9, color: '#f59e0b' },
  { name: 'Services atelier', percentage: 9, color: '#ef4444' },
  { name: 'Autres', percentage: 7, color: '#10b981' },
]

export function ReportsProfitDonut() {
  return (
    <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between h-[270px] shadow-sm">
      <div className="border-b border-[#202028] pb-2">
        <h3 className="text-xs font-bold text-white tracking-wide">
          Répartition des profits
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-2 flex-1">
        <div className="relative h-[140px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as ProfitItem
                    return (
                      <div className="rounded-lg border border-[#2a2a34] bg-[#18181f]/95 p-1.5 text-[10px] shadow-2xl">
                        <span className="font-bold text-white">{data.name}: </span>
                        <span className="font-mono text-cyan-400 font-bold">{data.percentage}%</span>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Pie
                data={PROFIT_SOURCES}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={2}
                dataKey="percentage"
              >
                {PROFIT_SOURCES.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#121216" strokeWidth={2} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-mono text-xs font-black text-white">36 950 €</span>
            <span className="text-[7px] text-zinc-400 uppercase font-bold">Bénéfice net</span>
          </div>
        </div>

        <div className="space-y-1.5 text-[10px]">
          {PROFIT_SOURCES.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 truncate pr-1">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-zinc-300 truncate">{item.name}</span>
              </div>
              <span className="font-mono text-zinc-400 shrink-0 font-semibold">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
