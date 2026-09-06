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

interface SpendPoint {
  month: string
  amount: number
}

const DATA: SpendPoint[] = [
  { month: 'Janv.', amount: 185000 },
  { month: 'Févr.', amount: 210000 },
  { month: 'Mars', amount: 195000 },
  { month: 'Avr.', amount: 245000 },
  { month: 'Mai', amount: 220000 },
  { month: 'Juin', amount: 193500 },
]

export function SuppliersSpendChart() {
  return (
    <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between h-[280px] shadow-sm">
      <div className="flex items-center justify-between border-b border-[#202028] pb-2">
        <h3 className="text-xs font-bold text-white tracking-wide">
          Achats par mois (2025)
        </h3>
        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="h-2 w-2 rounded-sm bg-red-500" />
          <span className="text-zinc-400">Montant des achats (€)</span>
        </div>
      </div>

      <div className="w-full flex-1 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#202028" vertical={false} />
            <XAxis dataKey="month" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}K`} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-[#2a2a34] bg-[#18181f]/95 p-2 text-[11px] shadow-2xl">
                      <div className="font-bold text-white">{label}</div>
                      <div className="text-red-400 font-mono">Achats : {payload[0]?.value?.toLocaleString('fr-FR')} €</div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line type="monotone" dataKey="amount" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3, fill: '#ef4444' }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
