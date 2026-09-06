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

const SALES_PROFIT_DATA = [
  { month: 'Mai 24', sales: 120000, profit: 24000 },
  { month: 'Juin 24', sales: 135000, profit: 28000 },
  { month: 'Juil. 24', sales: 155000, profit: 32000 },
  { month: 'Août 24', sales: 140000, profit: 26000 },
  { month: 'Sept. 24', sales: 168000, profit: 35000 },
  { month: 'Oct. 24', sales: 180000, profit: 38000 },
  { month: 'Nov. 24', sales: 175000, profit: 34000 },
  { month: 'Déc. 24', sales: 195000, profit: 42000 },
  { month: 'Janv. 25', sales: 170000, profit: 31000 },
  { month: 'Févr. 25', sales: 188000, profit: 36000 },
  { month: 'Mars 25', sales: 205000, profit: 40000 },
  { month: 'Avr. 25', sales: 190000, profit: 33000 },
  { month: 'Mai 25', sales: 218450, profit: 36950 },
]

export function ReportsSalesProfitChart() {
  return (
    <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between h-[270px] shadow-sm">
      <div className="flex items-center justify-between border-b border-[#202028] pb-2">
        <h3 className="text-xs font-bold text-white tracking-wide">
          Évolution des ventes
        </h3>

        <div className="flex items-center gap-3 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-zinc-300">Ventes (€)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="text-zinc-300">Bénéfice (€)</span>
          </div>
        </div>
      </div>

      <div className="h-[180px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={SALES_PROFIT_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#22222a" vertical={false} />
            <XAxis dataKey="month" stroke="#6b7280" fontSize={8} tickLine={false} axisLine={false} />
            <YAxis stroke="#6b7280" fontSize={8} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-[#2a2a34] bg-[#18181f]/95 p-2 text-[10px] shadow-2xl">
                      <div className="font-bold text-white mb-1">{label}</div>
                      <div className="text-red-400 font-mono">
                        Ventes: {Number(payload[0]?.value).toLocaleString('fr-FR')} €
                      </div>
                      <div className="text-cyan-400 font-mono">
                        Bénéfice: {Number(payload[1]?.value).toLocaleString('fr-FR')} €
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ r: 2.5, fill: '#ef4444' }}
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={{ r: 2.5, fill: '#06b6d4' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
