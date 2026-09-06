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

const DAILY_DATA = [
  { day: '01 Mai', count: 32 },
  { day: '04 Mai', count: 28 },
  { day: '07 Mai', count: 42 },
  { day: '10 Mai', count: 36 },
  { day: '13 Mai', count: 48 },
  { day: '16 Mai', count: 38 },
  { day: '19 Mai', count: 52 },
  { day: '22 Mai', count: 44 },
  { day: '25 Mai', count: 58 },
  { day: '28 Mai', count: 62 },
  { day: '31 Mai', count: 54 },
]

export function EvaluationsDailyChart() {
  return (
    <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between h-[270px] shadow-sm">
      <div className="flex items-center justify-between border-b border-[#202028] pb-2">
        <h3 className="text-xs font-bold text-white tracking-wide">
          Évaluations par jour
        </h3>
        <select className="h-6 rounded border border-[#282834] bg-[#18181f] px-2 text-[10px] text-zinc-300 focus:outline-none">
          <option>30 derniers jours</option>
          <option>7 derniers jours</option>
        </select>
      </div>

      <div className="h-[180px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={DAILY_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#22222a" vertical={false} />
            <XAxis dataKey="day" stroke="#6b7280" fontSize={9} tickLine={false} axisLine={false} />
            <YAxis stroke="#6b7280" fontSize={8} tickLine={false} axisLine={false} domain={[0, 80]} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-[#2a2a34] bg-[#18181f]/95 p-1.5 text-[10px] shadow-2xl">
                      <span className="font-bold text-white">{label} : </span>
                      <span className="font-mono text-red-400 font-bold">{payload[0]?.value} évaluations</span>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ r: 3, fill: '#ef4444' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
