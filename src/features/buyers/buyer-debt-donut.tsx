'use client'

import React from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts'

const DATA = [
  { name: '0 - 30 jours', value: 512400, percent: '45%', color: '#06b6d4' },
  { name: '31 - 60 jours', value: 287300, percent: '26%', color: '#f59e0b' },
  { name: '61 - 90 jours', value: 198750, percent: '18%', color: '#f97316' },
  { name: '+ 90 jours', value: 127300, percent: '11%', color: '#ef4444' },
]

export function BuyerDebtDonut() {
  return (
    <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3 shadow-md flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#222228] pb-2.5">
        <span className="text-xs font-bold text-white tracking-wide">
          Répartition des encours
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-3">
        {/* Donut with Center Text */}
        <div className="relative h-44 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload
                    return (
                      <div className="rounded-lg border border-[#2e2e3a] bg-[#16161e] p-2 shadow-xl text-[11px] space-y-0.5">
                        <div className="font-bold text-white">{item.name}</div>
                        <div className="font-mono text-zinc-300">
                          {Number(item.value).toLocaleString('fr-MA')} DH ({item.percent})
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Pie
                data={DATA}
                innerRadius={48}
                outerRadius={68}
                paddingAngle={3}
                dataKey="value"
                stroke="#121216"
                strokeWidth={2}
              >
                {DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Total */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-xs font-mono font-black text-white">1 125 750 DH</span>
            <span className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">
              Encours total
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2 text-[11px]">
          {DATA.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-zinc-400">{item.name}</span>
              </div>
              <div className="font-mono font-bold text-white text-right">
                {item.value.toLocaleString('fr-MA')} DH{' '}
                <span className="text-zinc-500 text-[10px]">({item.percent})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
