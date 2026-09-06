'use client'

import React from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts'

interface SegmentItem {
  name: string
  count: number
  percentage: number
  color: string
}

const SEGMENTS_DATA: SegmentItem[] = [
  { name: 'VIP', count: 224, percentage: 18, color: '#a855f7' },
  { name: 'Fidèles', count: 274, percentage: 22, color: '#06b6d4' },
  { name: 'Prospects chauds', count: 349, percentage: 28, color: '#f59e0b' },
  { name: 'Prospects froids', count: 224, percentage: 18, color: '#3b82f6' },
  { name: 'Fournisseurs', count: 87, percentage: 7, color: '#10b981' },
  { name: 'Autres', count: 90, percentage: 7, color: '#6b7280' },
]

export function ContactsSegmentsDonut() {
  return (
    <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col justify-between h-[300px]">
      <div className="border-b border-[#202028] pb-2">
        <h3 className="text-xs font-bold text-white">Segments</h3>
      </div>

      <div className="flex items-center gap-2 flex-1">
        <div className="relative h-[160px] w-1/2 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as SegmentItem
                    return (
                      <div className="rounded-lg border border-[#2a2a34] bg-[#18181f]/95 p-2 text-[11px] shadow-2xl">
                        <div className="font-bold text-white">{data.name}</div>
                        <div className="font-mono text-zinc-300">
                          {data.count} ({data.percentage}%)
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Pie
                data={SEGMENTS_DATA}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={68}
                paddingAngle={2}
                dataKey="count"
              >
                {SEGMENTS_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#121216" strokeWidth={2} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-mono text-sm font-black text-white">1 248</span>
            <span className="text-[8px] font-bold text-zinc-400 uppercase">Contacts</span>
          </div>
        </div>

        <div className="space-y-1.5 text-[10px] w-1/2">
          {SEGMENTS_DATA.map((s) => (
            <div key={s.name} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 truncate pr-1">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-zinc-300 truncate">{s.name}</span>
              </div>
              <span className="font-mono text-zinc-400 shrink-0">
                {s.percentage}% <span className="text-zinc-500">({s.count})</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
