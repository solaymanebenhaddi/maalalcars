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

interface CashFlowItem {
  date: string
  encaissements: number
  decaissements: number
  fluxNet: number
}

const CASHFLOW_DATA: CashFlowItem[] = [
  { date: '24 Avr.', encaissements: 65000, decaissements: 35000, fluxNet: 30000 },
  { date: '28 Avr.', encaissements: 45000, decaissements: 80000, fluxNet: -35000 },
  { date: '2 Mai', encaissements: 95000, decaissements: 40000, fluxNet: 55000 },
  { date: '6 Mai', encaissements: 40000, decaissements: 30000, fluxNet: 10000 },
  { date: '10 Mai', encaissements: 80000, decaissements: 55000, fluxNet: 25000 },
  { date: '14 Mai', encaissements: 50000, decaissements: 45000, fluxNet: 5000 },
  { date: '18 Mai', encaissements: 110000, decaissements: 60000, fluxNet: 50000 },
  { date: '22 Mai', encaissements: 125000, decaissements: 75000, fluxNet: 50000 },
]

export function FinanceCashflowChart() {
  return (
    <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between h-[280px] shadow-sm">
      <div className="flex items-center justify-between border-b border-[#202028] pb-2">
        <h3 className="text-xs font-bold text-white tracking-wide">
          Flux financiers <span className="text-[10px] text-zinc-500 font-normal">(30 derniers jours)</span>
        </h3>

        <div className="flex items-center gap-3 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-zinc-300">Encaissements</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="text-zinc-300">Décaissements</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-zinc-300">Flux net</span>
          </div>
        </div>
      </div>

      <div className="h-[200px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={CASHFLOW_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#22222a" vertical={false} />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
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
                        Encaissements: {Number(payload[0]?.value).toLocaleString('fr-FR')} DH
                      </div>
                      <div className="text-cyan-400 font-mono">
                        Décaissements: {Number(payload[1]?.value).toLocaleString('fr-FR')} DH
                      </div>
                      <div className="text-emerald-400 font-mono">
                        Flux net: {Number(payload[2]?.value).toLocaleString('fr-FR')} DH
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line
              type="monotone"
              dataKey="encaissements"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ r: 3, fill: '#ef4444' }}
            />
            <Line
              type="monotone"
              dataKey="decaissements"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={{ r: 3, fill: '#06b6d4' }}
            />
            <Line
              type="monotone"
              dataKey="fluxNet"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="3 3"
              dot={{ r: 3, fill: '#10b981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
