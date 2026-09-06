'use client'

import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'

interface InterventionSegment {
  name: string
  percentage: string
  count: number
  color: string
}

const SEGMENTS: InterventionSegment[] = [
  { name: 'Entretien', percentage: '39%', count: 50, color: '#ef4444' },
  { name: 'Mécanique', percentage: '28%', count: 36, color: '#06b6d4' },
  { name: 'Électronique', percentage: '15%', count: 19, color: '#f59e0b' },
  { name: 'Carrosserie', percentage: '10%', count: 13, color: '#a855f7' },
  { name: 'Autres', percentage: '8%', count: 10, color: '#ec4899' },
]

export function WorkshopInterventionDonut({ total = 128 }: { total?: number }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full h-full">
      {/* Donut Container */}
      <div className="relative h-44 w-44 shrink-0 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload as InterventionSegment
                  return (
                    <div className="rounded-lg border border-[#282834] bg-[#121216] px-3 py-2 text-xs shadow-2xl">
                      <span className="font-bold text-white block">{d.name}</span>
                      <span className="text-zinc-400 text-[11px]">
                        {d.count} O.T. ({d.percentage})
                      </span>
                    </div>
                  )
                }
                return null
              }}
            />
            <Pie
              data={SEGMENTS}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={74}
              paddingAngle={2}
              dataKey="count"
              stroke="#121216"
              strokeWidth={2}
            >
              {SEGMENTS.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-black text-white font-mono">{total}</span>
          <span className="text-[10px] font-semibold text-zinc-400">O.T. ouverts</span>
        </div>
      </div>

      {/* Legend matching Reference #10 Screen 1 */}
      <div className="w-full flex-1 space-y-1.5 min-w-0">
        {SEGMENTS.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs gap-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="h-2 w-2 rounded-full shrink-0 shadow-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-zinc-300 font-medium text-[11px] truncate">
                {item.name} <span className="text-zinc-400">({item.percentage})</span>
              </span>
            </div>
            <span className="font-mono font-bold text-white text-[11px] shrink-0">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
