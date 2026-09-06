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

interface EcheancierItem {
  period: string
  capital: number
  interets: number
}

const DEFAULT_SCHEDULE: EcheancierItem[] = [
  { period: 'Mois 1', capital: 280, interets: 58 },
  { period: '12', capital: 290, interets: 48 },
  { period: '24', capital: 300, interets: 38 },
  { period: '36', capital: 310, interets: 28 },
  { period: '48', capital: 325, interets: 18 },
  { period: '60', capital: 335, interets: 8 },
]

export function FinancingEcheancierChart({ data = DEFAULT_SCHEDULE }: { data?: EcheancierItem[] }) {
  return (
    <div className="space-y-3 w-full">
      {/* Legend on Top matching Reference Screen 1 */}
      <div className="flex items-center justify-end gap-5 text-[11px] font-semibold">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <span className="h-2.5 w-2.5 rounded-sm bg-cyan-400 inline-block" />
          <span>Capital</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-400">
          <span className="h-2.5 w-2.5 rounded-sm bg-amber-400 inline-block" />
          <span>Intérêts</span>
        </div>
      </div>

      {/* Stacked Bar Chart */}
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="#1f1f28" vertical={false} />
            <XAxis
              dataKey="period"
              stroke="#6b7280"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#222228' }}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl border border-[#282834] bg-[#121216] p-2.5 text-xs shadow-2xl space-y-1">
                      <span className="font-bold text-white block border-b border-[#222228] pb-1">
                        {label}
                      </span>
                      <div className="flex justify-between gap-4 text-cyan-400 font-mono">
                        <span>Capital :</span>
                        <span className="font-bold">{payload[0]?.value} DH</span>
                      </div>
                      <div className="flex justify-between gap-4 text-amber-400 font-mono">
                        <span>Intérêts :</span>
                        <span className="font-bold">{payload[1]?.value} DH</span>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="capital" stackId="a" fill="#00b4d8" radius={[0, 0, 2, 2]} />
            <Bar dataKey="interets" stackId="a" fill="#f59e0b" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
