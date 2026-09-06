'use client'

import React from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts'

interface ClientSegmentItem {
  name: string
  count: number
  percentage: number
  color: string
}

const CLIENT_SEGMENTS: ClientSegmentItem[] = [
  { name: 'Particuliers', count: 1540, percentage: 62.7, color: '#06b6d4' },
  { name: 'Professionnels', count: 612, percentage: 24.9, color: '#f59e0b' },
  { name: 'Flottes', count: 186, percentage: 7.6, color: '#ef4444' },
  { name: 'Inactifs', count: 120, percentage: 4.8, color: '#6b7280' },
]

export function ClientsSegmentationDonut() {
  return (
    <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between h-[280px] shadow-sm">
      <div className="border-b border-[#202028] pb-2">
        <h3 className="text-xs font-bold text-white tracking-wide">
          Segmentation des clients
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-2 flex-1">
        <div className="relative h-[150px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as ClientSegmentItem
                    return (
                      <div className="rounded-lg border border-[#2a2a34] bg-[#18181f]/95 p-2 text-[11px] shadow-2xl">
                        <div className="font-bold text-white">{data.name}</div>
                        <div className="font-mono text-zinc-300">
                          {data.count.toLocaleString('fr-FR')} ({data.percentage}%)
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Pie
                data={CLIENT_SEGMENTS}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={65}
                paddingAngle={2}
                dataKey="count"
              >
                {CLIENT_SEGMENTS.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#121216" strokeWidth={2} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-mono text-xs font-black text-white">2 458</span>
            <span className="text-[8px] font-bold text-zinc-400 uppercase">Clients</span>
          </div>
        </div>

        <div className="space-y-1 text-[10px]">
          {CLIENT_SEGMENTS.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 truncate pr-1">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-zinc-300 truncate">{item.name}</span>
              </div>
              <span className="font-mono text-zinc-400 shrink-0">
                {item.count.toLocaleString('fr-FR')} <span className="text-zinc-500">({item.percentage}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
