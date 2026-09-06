'use client'

import React from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts'

interface EvaluationStatusItem {
  name: string
  count: number
  percentage: number
  color: string
}

const EVALUATION_STATUS_DATA: EvaluationStatusItem[] = [
  { name: 'Validées', count: 712, percentage: 57, color: '#10b981' },
  { name: 'À revoir', count: 241, percentage: 19, color: '#f59e0b' },
  { name: 'Non conformes', count: 147, percentage: 12, color: '#ef4444' },
  { name: 'En attente', count: 148, percentage: 12, color: '#06b6d4' },
]

export function EvaluationsStatusDonut() {
  return (
    <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between h-[270px] shadow-sm">
      <div className="border-b border-[#202028] pb-2">
        <h3 className="text-xs font-bold text-white tracking-wide">
          Répartition par statut
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-2 flex-1">
        <div className="relative h-[150px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as EvaluationStatusItem
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
                data={EVALUATION_STATUS_DATA}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={65}
                paddingAngle={2}
                dataKey="count"
              >
                {EVALUATION_STATUS_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#121216" strokeWidth={2} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-1.5 text-[10px]">
          {EVALUATION_STATUS_DATA.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 truncate pr-1">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-zinc-300 truncate">{item.name} ({item.count})</span>
              </div>
              <span className="font-mono text-zinc-400 shrink-0 font-semibold">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
