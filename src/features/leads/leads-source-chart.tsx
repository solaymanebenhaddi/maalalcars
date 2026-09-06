'use client'

import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'

export interface SourceDataItem {
  name: string
  value: number
  percentage: number
  color: string
}

const DEFAULT_SOURCES: SourceDataItem[] = [
  { name: 'Site web', value: 474, percentage: 38, color: '#00b4d8' },
  { name: 'Facebook Ads', value: 299, percentage: 24, color: '#22c55e' },
  { name: 'Google Ads', value: 249, percentage: 20, color: '#f97316' },
  { name: 'Instagram', value: 125, percentage: 10, color: '#ef4444' },
  { name: 'Autres', value: 101, percentage: 8, color: '#a855f7' },
]

export function LeadsSourceChart({
  data = DEFAULT_SOURCES,
  totalLeads = 1248,
  compact = false,
}: {
  data?: SourceDataItem[]
  totalLeads?: number
  compact?: boolean
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
      {/* Donut Chart with Center Text */}
      <div className="relative h-48 w-48 sm:h-52 sm:w-52 shrink-0 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload as SourceDataItem
                  return (
                    <div className="rounded-lg border border-[#282834] bg-[#121216] px-3 py-2 text-xs shadow-2xl">
                      <span className="font-bold text-white block">{d.name}</span>
                      <span className="text-zinc-400 text-[11px]">
                        {d.percentage}% ({d.value} leads)
                      </span>
                    </div>
                  )
                }
                return null
              }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={56}
              outerRadius={84}
              paddingAngle={2}
              dataKey="value"
              stroke="#0f0f13"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono">
            {totalLeads.toLocaleString('fr-MA')}
          </span>
          <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Leads</span>
        </div>
      </div>

      {/* Legend with Color Dots and Percentage */}
      <div className="w-full flex-1 space-y-2 min-w-0">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs py-0.5 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0 shadow-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-zinc-300 font-medium text-xs truncate">{item.name}</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono shrink-0">
              <span className="font-bold text-white text-xs">{item.percentage}%</span>
              {!compact && (
                <span className="text-[11px] text-zinc-400">({item.value})</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
