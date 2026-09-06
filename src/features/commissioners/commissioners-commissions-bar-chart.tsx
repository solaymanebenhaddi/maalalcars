'use client'

import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

interface CommissionWeekPoint {
  week: string
  paid: number
  pending: number
}

const DATA: CommissionWeekPoint[] = [
  { week: 'Semaine 1', paid: 48000, pending: 12000 },
  { week: 'Semaine 2', paid: 56000, pending: 15000 },
  { week: 'Semaine 3', paid: 42000, pending: 11000 },
  { week: 'Semaine 4', paid: 64000, pending: 16500 },
  { week: 'Semaine 5', paid: 38750, pending: 8040 },
]

export function CommissionersCommissionsBarChart() {
  return (
    <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between h-[280px] shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#202028] pb-2">
        <h3 className="text-xs font-bold text-white tracking-wide">
          Évolution des commissions (DH)
        </h3>

        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-cyan-400" />
            <span className="text-zinc-300 font-medium">Payées</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-red-500" />
            <span className="text-zinc-300 font-medium">En attente</span>
          </div>
          <span className="text-zinc-500 text-[10px]">Ce mois ⌄</span>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full flex-1 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#202028" vertical={false} />

            <XAxis
              dataKey="week"
              stroke="#52525b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#52525b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${Math.round(v / 1000)}K`}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-[#2a2a34] bg-[#18181f]/95 p-2.5 text-[11px] shadow-2xl backdrop-blur-md">
                      <div className="font-bold text-white pb-1 border-b border-[#282834]">{label}</div>
                      <div className="flex items-center gap-2 pt-1 text-cyan-400 font-mono">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                        <span>Payées : {payload[0]?.value?.toLocaleString('fr-FR')} DH</span>
                      </div>
                      <div className="flex items-center gap-2 pt-0.5 text-red-400 font-mono">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        <span>En attente : {payload[1]?.value?.toLocaleString('fr-FR')} DH</span>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />

            <Bar dataKey="paid" fill="#06b6d4" radius={[3, 3, 0, 0]} maxBarSize={16} />
            <Bar dataKey="pending" fill="#ef4444" radius={[3, 3, 0, 0]} maxBarSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
