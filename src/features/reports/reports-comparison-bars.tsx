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

const COMPARISON_DATA = [
  { month: 'Janv.', nMinus1: 110000, n: 135000 },
  { month: 'Févr.', nMinus1: 125000, n: 165000 },
  { month: 'Mars', nMinus1: 140000, n: 185000 },
  { month: 'Avr.', nMinus1: 130000, n: 175000 },
  { month: 'Mai', nMinus1: 145000, n: 218450 },
]

export function ReportsComparisonBars() {
  return (
    <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between h-[270px] shadow-sm">
      <div className="flex items-center justify-between border-b border-[#202028] pb-2">
        <h3 className="text-xs font-bold text-white tracking-wide">
          Comparaison N vs N-1
        </h3>

        <div className="flex items-center gap-3 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-zinc-600" />
            <span className="text-zinc-400">2024</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-zinc-300">2025</span>
          </div>
        </div>
      </div>

      <div className="h-[180px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={COMPARISON_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#22222a" vertical={false} />
            <XAxis dataKey="month" stroke="#6b7280" fontSize={8} tickLine={false} axisLine={false} />
            <YAxis stroke="#6b7280" fontSize={8} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-[#2a2a34] bg-[#18181f]/95 p-2 text-[10px] shadow-2xl">
                      <div className="font-bold text-white mb-1">{label}</div>
                      <div className="text-zinc-400 font-mono">
                        2024: {Number(payload[0]?.value).toLocaleString('fr-FR')} €
                      </div>
                      <div className="text-red-400 font-mono">
                        2025: {Number(payload[1]?.value).toLocaleString('fr-FR')} €
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="nMinus1" fill="#4b5563" radius={[2, 2, 0, 0]} />
            <Bar dataKey="n" fill="#ef4444" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
