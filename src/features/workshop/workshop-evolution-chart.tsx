'use client'

import React from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

const EVOLUTION_DATA = [
  { date: '22 Avr', crees: 28, termines: 12 },
  { date: '27 Avr', crees: 38, termines: 19 },
  { date: '2 Mai', crees: 45, termines: 25 },
  { date: '7 Mai', crees: 68, termines: 38 },
  { date: '12 Mai', crees: 75, termines: 42 },
  { date: '17 Mai', crees: 92, termines: 64 },
  { date: '22 Mai', crees: 85, termines: 58 },
]

export function WorkshopEvolutionChart() {
  return (
    <div className="space-y-2.5 w-full h-full flex flex-col justify-between">
      {/* Legend on Top matching Reference #10 Screen 1 */}
      <div className="flex items-center gap-4 text-[11px] font-semibold">
        <div className="flex items-center gap-1.5 text-zinc-300">
          <span className="h-2 w-3 rounded-sm bg-[#ef4444] inline-block" />
          <span>Créés</span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-300">
          <span className="h-2 w-3 rounded-sm bg-[#06b6d4] inline-block" />
          <span>Terminés</span>
        </div>
      </div>

      {/* Dual Line & Area Chart */}
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={EVOLUTION_DATA} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTermines" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 2" stroke="#1f1f28" vertical={false} />
            <XAxis
              dataKey="date"
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
              ticks={[0, 20, 40, 60, 80, 100]}
              domain={[0, 100]}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl border border-[#282834] bg-[#121216] p-2.5 text-xs shadow-2xl space-y-1">
                      <span className="font-bold text-white block border-b border-[#222228] pb-1">
                        {label}
                      </span>
                      <div className="flex justify-between gap-4 text-red-400 font-mono">
                        <span>Créés :</span>
                        <span className="font-bold">{payload[0]?.value}</span>
                      </div>
                      <div className="flex justify-between gap-4 text-cyan-400 font-mono">
                        <span>Terminés :</span>
                        <span className="font-bold">{payload[1]?.value}</span>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line
              type="monotone"
              dataKey="crees"
              stroke="#ef4444"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#ef4444', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Area
              type="monotone"
              dataKey="termines"
              stroke="#06b6d4"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorTermines)"
              dot={{ r: 3, fill: '#06b6d4', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
