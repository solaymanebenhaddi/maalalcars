'use client'

import React from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

interface PurchasesDataPoint {
  period: string
  currentMonth: number
  previousMonth: number
}

const DATA: PurchasesDataPoint[] = [
  { period: 'Mai 1-5', currentMonth: 210000, previousMonth: 180000 },
  { period: 'Mai 6-12', currentMonth: 340000, previousMonth: 240000 },
  { period: 'Mai 13-19', currentMonth: 485000, previousMonth: 310000 },
  { period: 'Mai 20-26', currentMonth: 612400, previousMonth: 482250 },
  { period: 'Mai 27-31', currentMonth: 780000, previousMonth: 590000 },
]

export function SellerPurchasesChart() {
  return (
    <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between h-[300px] shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#202028] pb-2.5">
        <div>
          <h3 className="text-xs font-bold text-white tracking-wide">
            Volume d&apos;achats auprès des vendeurs (DH)
          </h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-red-500" />
            <span className="text-zinc-300 font-medium">Ce mois</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-cyan-400" />
            <span className="text-zinc-300 font-medium">Mois précédent</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full flex-1 pt-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="sellerRedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="sellerCyanGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#202028" vertical={false} />

            <XAxis
              dataKey="period"
              stroke="#52525b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#52525b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => {
                if (v === 0) return '0'
                if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`
                return `${Math.round(v / 1000)}K`
              }}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-[#2a2a34] bg-[#18181f]/95 p-2.5 text-[11px] shadow-2xl backdrop-blur-md">
                      <div className="font-bold text-white pb-1 border-b border-[#282834]">{label}</div>
                      <div className="flex items-center gap-2 pt-1 text-red-400 font-mono">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        <span>Ce mois : {payload[0]?.value?.toLocaleString('fr-FR')} DH</span>
                      </div>
                      <div className="flex items-center gap-2 pt-0.5 text-cyan-400 font-mono">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                        <span>Mois préc : {payload[1]?.value?.toLocaleString('fr-FR')} DH</span>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />

            <Area
              type="monotone"
              dataKey="currentMonth"
              stroke="#ef4444"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#sellerRedGradient)"
              dot={{ r: 3, fill: '#ef4444', strokeWidth: 1, stroke: '#ffffff' }}
              activeDot={{ r: 5, fill: '#ef4444' }}
            />

            <Area
              type="monotone"
              dataKey="previousMonth"
              stroke="#06b6d4"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#sellerCyanGradient)"
              dot={{ r: 2.5, fill: '#06b6d4', strokeWidth: 1, stroke: '#ffffff' }}
              activeDot={{ r: 4, fill: '#06b6d4' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
