'use client'

import React from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

const EVOLUTION_DATA = [
  { date: '20 Avr', leads: 170, qualified: 100 },
  { date: '25 Avr', leads: 190, qualified: 120 },
  { date: '30 Avr', leads: 260, qualified: 160 },
  { date: '5 Mai', leads: 370, qualified: 170 },
  { date: '10 Mai', leads: 500, qualified: 240 },
  { date: '15 Mai', leads: 430, qualified: 220 },
  { date: '20 Mai', leads: 490, qualified: 310 },
]

export function LeadsEvolutionChart({ data = EVOLUTION_DATA }: { data?: typeof EVOLUTION_DATA }) {
  return (
    <div className="space-y-3 w-full">
      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              domain={[0, 500]}
              ticks={[0, 100, 200, 300, 400, 500]}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl border border-[#282834] bg-[#121216] p-3 text-xs shadow-2xl space-y-1.5">
                      <span className="font-bold text-white block border-b border-[#222228] pb-1">
                        {label}
                      </span>
                      <div className="flex items-center justify-between gap-4 text-red-400 font-mono">
                        <span>Leads :</span>
                        <span className="font-bold">{payload[0]?.value}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-cyan-400 font-mono">
                        <span>Leads qualifiés :</span>
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
              dataKey="leads"
              name="Leads"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#0f0f13', stroke: '#ef4444', strokeWidth: 2, r: 3.5 }}
              activeDot={{ r: 5, fill: '#ef4444', stroke: '#ffffff', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="qualified"
              name="Leads qualifiés"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={{ fill: '#0f0f13', stroke: '#06b6d4', strokeWidth: 2, r: 3.5 }}
              activeDot={{ r: 5, fill: '#06b6d4', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom-left Legend matching Reference Screen 5 */}
      <div className="flex items-center gap-6 text-[11px] font-semibold pt-1">
        <div className="flex items-center gap-2 text-red-400">
          <span className="h-2 w-4 bg-red-500 rounded-full inline-block" />
          <span>Leads</span>
        </div>
        <div className="flex items-center gap-2 text-cyan-400">
          <span className="h-2 w-4 bg-cyan-400 rounded-full inline-block" />
          <span>Leads qualifiés</span>
        </div>
      </div>
    </div>
  )
}
