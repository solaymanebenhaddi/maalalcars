'use client'

import React from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

const DATA = [
  { month: 'Juin', volume: 210000, volumeDisplay: '210 000 DH', buyers: 65 },
  { month: 'Juil.', volume: 290000, volumeDisplay: '290 000 DH', buyers: 80 },
  { month: 'Août', volume: 380000, volumeDisplay: '380 000 DH', buyers: 95 },
  { month: 'Sept.', volume: 430000, volumeDisplay: '430 000 DH', buyers: 110 },
  { month: 'Oct.', volume: 510000, volumeDisplay: '510 000 DH', buyers: 135 },
  { month: 'Nov.', volume: 470000, volumeDisplay: '470 000 DH', buyers: 120 },
  { month: 'Déc.', volume: 500000, volumeDisplay: '500 000 DH', buyers: 130 },
  { month: 'Janv.', volume: 490000, volumeDisplay: '490 000 DH', buyers: 125 },
  { month: 'Févr.', volume: 640000, volumeDisplay: '640 000 DH', buyers: 155 },
  { month: 'Mars', volume: 780000, volumeDisplay: '520 450 DH', buyers: 178 },
  { month: 'Avr.', volume: 790000, volumeDisplay: '790 000 DH', buyers: 175 },
  { month: 'Mai', volume: 890000, volumeDisplay: '890 000 DH', buyers: 205 },
]

export function BuyerPurchasesChart() {
  return (
    <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3 shadow-md flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#222228] pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white tracking-wide">
            Évolution des achats
          </span>
          <span className="text-[10px] text-zinc-500 font-medium">(12 derniers mois)</span>
        </div>

        <div className="flex items-center gap-4 text-[10px]">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
            <span>Volume d&apos;achats (DH)</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
            <span>Nombre d&apos;acheteurs</span>
          </div>
        </div>
      </div>

      {/* Recharts Dual Area Line Chart */}
      <div className="h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="buyerVolumeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="buyerCountGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#22222a" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#71717a"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#272732' }}
            />
            <YAxis
              stroke="#71717a"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => {
                if (val >= 1000000) return `${val / 1000000}M`
                if (val >= 1000) return `${val / 1000}K`
                return `${val}`
              }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-[#2e2e3a] bg-[#16161e] p-2.5 shadow-xl text-[11px] space-y-1">
                      <div className="font-bold text-white border-b border-[#282834] pb-1">
                        {label} 2025
                      </div>
                      <div className="flex items-center gap-1.5 text-red-400 font-mono">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                        <span>
                          Volume :{' '}
                          <strong>
                            {Number(payload[0]?.value).toLocaleString('fr-MA')} DH
                          </strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-cyan-400 font-mono">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                        <span>
                          Acheteurs : <strong>{payload[1]?.value}</strong>
                        </span>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="volume"
              stroke="#ef4444"
              strokeWidth={2.5}
              fill="url(#buyerVolumeGrad)"
              dot={{ r: 3, fill: '#ef4444', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="buyers"
              stroke="#06b6d4"
              strokeWidth={2}
              fill="url(#buyerCountGrad)"
              dot={{ r: 2.5, fill: '#06b6d4', strokeWidth: 0 }}
              activeDot={{ r: 4.5, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
