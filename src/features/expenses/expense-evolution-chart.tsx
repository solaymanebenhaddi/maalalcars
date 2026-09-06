'use client'

import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

const DATA = [
  { month: 'Juin', value: 10200 },
  { month: 'Juil.', value: 14800 },
  { month: 'Août', value: 18200 },
  { month: 'Sept.', value: 13900 },
  { month: 'Oct.', value: 16400 },
  { month: 'Nov.', value: 14500 },
  { month: 'Déc.', value: 17200 },
  { month: 'Janv.', value: 20100 },
  { month: 'Févr.', value: 16800 },
  { month: 'Mars', value: 18900 },
  { month: 'Avr.', value: 22800 },
  { month: 'Mai', value: 24700 },
]

export function ExpenseEvolutionChart() {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="expenseGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#222228" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="#71717a"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#71717a"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => (v === 0 ? '0 DH' : `${v / 1000}K`)}
            domain={[0, 30000]}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const val = payload[0].value as number
                const label = payload[0].payload.month
                return (
                  <div className="rounded-lg border border-red-500/30 bg-[#18181f] p-2 text-xs shadow-xl">
                    <div className="font-bold text-white mb-0.5">{label} 2025</div>
                    <div className="font-mono text-red-400 font-bold">
                      Dépenses : {val.toLocaleString('fr-MA')} DH
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#ef4444"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#expenseGlow)"
            dot={{ r: 3, fill: '#ef4444', stroke: '#121216', strokeWidth: 1.5 }}
            activeDot={{ r: 5, fill: '#ffffff', stroke: '#ef4444', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
