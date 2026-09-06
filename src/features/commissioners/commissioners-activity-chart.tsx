'use client'

import React from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

interface ActivityPoint {
  date: string
  transactions: number
  volume: number
}

const DATA: ActivityPoint[] = [
  { date: '01 Mai', transactions: 24, volume: 220000 },
  { date: '06 Mai', transactions: 32, volume: 380000 },
  { date: '11 Mai', transactions: 28, volume: 310000 },
  { date: '16 Mai', transactions: 35, volume: 460000 },
  { date: '21 Mai', transactions: 30, volume: 420000 },
  { date: '26 Mai', transactions: 44, volume: 680000 },
  { date: '31 Mai', transactions: 38, volume: 540000 },
]

export function CommissionersActivityChart() {
  return (
    <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between h-[280px] shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#202028] pb-2">
        <h3 className="text-xs font-bold text-white tracking-wide">
          Transactions générées
        </h3>

        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-cyan-400" />
            <span className="text-zinc-300 font-medium">Transactions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-red-500" />
            <span className="text-zinc-300 font-medium">Valeur (DH)</span>
          </div>
          <span className="text-zinc-500 text-[10px]">Ce mois ⌄</span>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full flex-1 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#202028" vertical={false} />

            <XAxis
              dataKey="date"
              stroke="#52525b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="left"
              stroke="#52525b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
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
                        <span>Transactions : {payload[0]?.value}</span>
                      </div>
                      <div className="flex items-center gap-2 pt-0.5 text-red-400 font-mono">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        <span>Valeur : {payload[1]?.value?.toLocaleString('fr-FR')} DH</span>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="transactions"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={{ r: 3, fill: '#06b6d4' }}
              activeDot={{ r: 5, fill: '#06b6d4' }}
            />

            <Line
              yAxisId="right"
              type="monotone"
              dataKey="volume"
              stroke="#ef4444"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#ef4444' }}
              activeDot={{ r: 5, fill: '#ef4444' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
