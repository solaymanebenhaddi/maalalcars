'use client'

import React from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts'

interface CategoryItem {
  name: string
  amount: number
  percentage: number
  color: string
}

const CATEGORIES: CategoryItem[] = [
  { name: 'Pièces & composants', amount: 94525, percentage: 38, color: '#06b6d4' },
  { name: 'Consommables atelier', amount: 54725, percentage: 22, color: '#f59e0b' },
  { name: 'Équipements', amount: 39800, percentage: 16, color: '#ef4444' },
  { name: 'Services externes', amount: 29850, percentage: 12, color: '#3b82f6' },
  { name: 'Autres', amount: 29850, percentage: 12, color: '#a855f7' },
]

export function PurchasesCategoryDonut() {
  return (
    <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between h-[280px] shadow-sm">
      <div className="border-b border-[#202028] pb-2">
        <h3 className="text-xs font-bold text-white tracking-wide">
          Dépenses par catégorie
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-2 flex-1">
        <div className="relative h-[150px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as CategoryItem
                    return (
                      <div className="rounded-lg border border-[#2a2a34] bg-[#18181f]/95 p-2 text-[11px] shadow-2xl">
                        <div className="font-bold text-white">{data.name}</div>
                        <div className="font-mono text-zinc-300">
                          {data.amount.toLocaleString('fr-FR')} € ({data.percentage}%)
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Pie
                data={CATEGORIES}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={65}
                paddingAngle={2}
                dataKey="amount"
              >
                {CATEGORIES.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#121216" strokeWidth={2} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-mono text-xs font-black text-white">248 750 €</span>
            <span className="text-[8px] font-bold text-zinc-400 uppercase">Total (HT)</span>
          </div>
        </div>

        <div className="space-y-1 text-[10px]">
          {CATEGORIES.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 truncate pr-1">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-zinc-300 truncate">{item.name}</span>
              </div>
              <span className="font-mono text-zinc-400 shrink-0 font-semibold">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
