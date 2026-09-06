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

const WORKLOAD_DATA = [
  { day: 'Lun', prevu: 38, realise: 28 },
  { day: 'Mar', prevu: 42, realise: 32 },
  { day: 'Mer', prevu: 52, realise: 46 },
  { day: 'Jeu', prevu: 35, realise: 30 },
  { day: 'Ven', prevu: 52, realise: 44 },
  { day: 'Sam', prevu: 35, realise: 26 },
]

export function WorkshopWorkloadChart() {
  return (
    <div className="space-y-2.5 w-full h-full flex flex-col justify-between">
      {/* Legend on Top matching Reference #10 Screen 1 */}
      <div className="flex items-center gap-4 text-[11px] font-semibold">
        <div className="flex items-center gap-1.5 text-zinc-300">
          <span className="h-2 w-3 rounded-sm bg-[#ef4444] inline-block" />
          <span>Prévu</span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-300">
          <span className="h-2 w-3 rounded-sm bg-[#64748b] inline-block" />
          <span>Réalisé</span>
        </div>
      </div>

      {/* Dual Bar Chart */}
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={WORKLOAD_DATA} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="#1f1f28" vertical={false} />
            <XAxis
              dataKey="day"
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
              ticks={[0, 20, 30, 40, 50, 60]}
              domain={[0, 60]}
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
                        <span>Prévu :</span>
                        <span className="font-bold">{payload[0]?.value} h</span>
                      </div>
                      <div className="flex justify-between gap-4 text-slate-400 font-mono">
                        <span>Réalisé :</span>
                        <span className="font-bold">{payload[1]?.value} h</span>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="prevu" fill="#ef4444" radius={[2, 2, 0, 0]} barSize={8} />
            <Bar dataKey="realise" fill="#64748b" radius={[2, 2, 0, 0]} barSize={8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
