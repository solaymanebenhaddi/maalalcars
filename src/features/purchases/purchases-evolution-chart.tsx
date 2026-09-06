'use client'

import React from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

interface EvolutionData {
  month: string
  depenses: number
  budget: number
}

const EVOLUTION_DATA: EvolutionData[] = [
  { month: 'Janv', depenses: 145000, budget: 160000 },
  { month: 'Fév', depenses: 168000, budget: 170000 },
  { month: 'Mars', depenses: 195000, budget: 180000 },
  { month: 'Avr', depenses: 210000, budget: 190000 },
  { month: 'Mai', depenses: 248750, budget: 200000 },
  { month: 'Juin', depenses: 235000, budget: 210000 },
  { month: 'Juil', depenses: 260000, budget: 220000 },
  { month: 'Août', depenses: 280000, budget: 230000 },
  { month: 'Sept', depenses: 295000, budget: 240000 },
  { month: 'Oct', depenses: 310000, budget: 250000 },
  { month: 'Nov', depenses: 325000, budget: 260000 },
  { month: 'Déc', depenses: 340000, budget: 270000 },
]

export function PurchasesEvolutionChart() {
  return (
    <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between h-[280px] shadow-sm">
      <div className="flex items-center justify-between border-b border-[#202028] pb-2">
        <h3 className="text-xs font-bold text-white tracking-wide">
          Évolution des dépenses (HT)
        </h3>
        <div className="flex items-center gap-3 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-zinc-300">Dépenses (HT)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="text-zinc-300">Budget (HT)</span>
          </div>
        </div>
      </div>

      <div className="h-[200px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={EVOLUTION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDepenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#22222a" vertical={false} />
            <XAxis dataKey="month" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#6b7280"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v / 1000}k`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-[#2a2a34] bg-[#18181f]/95 p-2 text-[11px] shadow-2xl">
                      <div className="font-bold text-white mb-1">{label}</div>
                      <div className="text-red-400 font-mono">
                        Dépenses: {Number(payload[0]?.value).toLocaleString('fr-FR')} €
                      </div>
                      <div className="text-cyan-400 font-mono">
                        Budget: {Number(payload[1]?.value).toLocaleString('fr-FR')} €
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="depenses"
              stroke="#ef4444"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorDepenses)"
            />
            <Area
              type="monotone"
              dataKey="budget"
              stroke="#06b6d4"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#colorBudget)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
