'use client'

import React from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts'

interface StatusItem {
  name: string
  count: number
  percentage: number
  color: string
}

const STATUS_DATA: StatusItem[] = [
  { name: 'Actifs', count: 96, percentage: 75, color: '#06b6d4' },
  { name: 'Inactifs', count: 18, percentage: 14, color: '#f97316' },
  { name: 'Suspendus', count: 8, percentage: 6, color: '#e11d48' },
  { name: 'Nouveaux', count: 6, percentage: 5, color: '#eab308' },
]

export function SellerStatusDonut() {
  return (
    <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between h-[250px] shadow-sm">
      {/* Header */}
      <div className="border-b border-[#202028] pb-2">
        <h3 className="text-xs font-bold text-white tracking-wide">
          Statut des vendeurs
        </h3>
      </div>

      {/* Donut and Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-2 flex-1">
        {/* Donut Chart with center label */}
        <div className="relative h-[150px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as StatusItem
                    return (
                      <div className="rounded-lg border border-[#2a2a34] bg-[#18181f]/95 p-2 text-[11px] shadow-2xl backdrop-blur-md">
                        <div className="font-bold text-white">{data.name}</div>
                        <div className="font-mono text-zinc-300">
                          {data.count} vendeurs ({data.percentage}%)
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Pie
                data={STATUS_DATA}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={62}
                paddingAngle={3}
                dataKey="count"
              >
                {STATUS_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#121216" strokeWidth={2} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Total */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-mono text-base font-black text-white leading-tight">
              128
            </span>
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
              Vendeurs
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2 text-[11px]">
          {STATUS_DATA.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-zinc-300 font-medium">{item.name}</span>
              </div>
              <div className="font-mono text-zinc-400">
                <span className="text-white font-semibold">{item.count}</span>{' '}
                <span className="text-zinc-500">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
