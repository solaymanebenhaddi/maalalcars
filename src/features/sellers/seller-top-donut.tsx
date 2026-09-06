'use client'

import React from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts'

interface TopSellerItem {
  name: string
  amount: number
  percentage: number
  color: string
}

const TOP_SELLERS: TopSellerItem[] = [
  { name: 'Youssef El Idrissi', amount: 682500, percentage: 24, color: '#ef4444' },
  { name: 'Omar Bennani', amount: 541250, percentage: 19, color: '#f97316' },
  { name: 'Imane Zahiri', amount: 438900, percentage: 15, color: '#eab308' },
  { name: 'Karim Talbi', amount: 356750, percentage: 13, color: '#06b6d4' },
  { name: 'Nadia Kabbaj', amount: 287300, percentage: 10, color: '#10b981' },
  { name: 'Autres vendeurs', amount: 538900, percentage: 19, color: '#4b5563' },
]

export function SellerTopDonut() {
  return (
    <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between h-[300px] shadow-sm">
      {/* Header */}
      <div className="border-b border-[#202028] pb-2.5">
        <h3 className="text-xs font-bold text-white tracking-wide">
          Répartition des achats par vendeur (Top 5)
        </h3>
      </div>

      {/* Donut and Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-3 flex-1 pt-2">
        {/* Donut Chart with center label */}
        <div className="relative h-[180px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as TopSellerItem
                    return (
                      <div className="rounded-lg border border-[#2a2a34] bg-[#18181f]/95 p-2 text-[11px] shadow-2xl backdrop-blur-md">
                        <div className="font-bold text-white">{data.name}</div>
                        <div className="font-mono text-zinc-300">
                          {data.amount.toLocaleString('fr-FR')} DH ({data.percentage}%)
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Pie
                data={TOP_SELLERS}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={75}
                paddingAngle={3}
                dataKey="amount"
              >
                {TOP_SELLERS.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#121216" strokeWidth={2} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Total */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-mono text-xs sm:text-sm font-black text-white leading-tight">
              2 845 600
            </span>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              DH
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-1.5 text-[10px]">
          {TOP_SELLERS.map((seller) => (
            <div key={seller.name} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 truncate pr-2">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: seller.color }}
                />
                <span className="text-zinc-300 font-medium truncate">{seller.name}</span>
              </div>
              <div className="font-mono text-zinc-400 shrink-0">
                <span className="text-white font-semibold">
                  {seller.amount.toLocaleString('fr-FR')} DH
                </span>{' '}
                <span className="text-zinc-500">({seller.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
