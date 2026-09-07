'use client'

import React, { useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { TrendingUp, BarChart3, LineChart as LineIcon } from 'lucide-react'

export interface MonthlyFinancialPoint {
  month: string
  revenue: number
  cost: number
  profit: number
}

interface FinancialOverviewChartProps {
  data: MonthlyFinancialPoint[]
  totalRevenue: number
  totalProfit: number
  averageMargin: number
}

export function FinancialOverviewChart({
  data,
  totalRevenue,
  totalProfit,
  averageMargin,
}: FinancialOverviewChartProps) {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar')

  return (
    <div className="rounded-2xl border border-[#222228] bg-[#121216] p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#202028] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Performance & Rentabilité Commerciale
            </h3>
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Évolution comparée du Chiffre d&apos;Affaires, des Coûts et du Bénéfice Net (DH)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Chart Type Toggle */}
          <div className="flex items-center rounded-lg border border-[#2e2e38] bg-[#16161c] p-0.5">
            <button
              type="button"
              onClick={() => setChartType('bar')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                chartType === 'bar'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <BarChart3 className="h-3 w-3" />
              <span>Barres</span>
            </button>
            <button
              type="button"
              onClick={() => setChartType('line')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                chartType === 'line'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LineIcon className="h-3 w-3" />
              <span>Courbes</span>
            </button>
          </div>

          {/* Legend */}
          <div className="hidden md:flex items-center gap-3 text-[11px] pl-2 border-l border-[#24242e]">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded bg-cyan-400" />
              <span className="text-zinc-300">Revenus (CA)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded bg-purple-400" />
              <span className="text-zinc-300">Coût d&apos;achat & Frais</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded bg-emerald-400" />
              <span className="text-zinc-300">Bénéfice Net</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPI Strip inside chart */}
      <div className="grid grid-cols-3 gap-3 rounded-xl border border-[#1e1e24] bg-[#16161c] p-3 text-xs">
        <div>
          <span className="text-[10px] uppercase font-semibold text-zinc-400 block">CA Cumulé Période</span>
          <span className="text-sm sm:text-base font-bold text-cyan-400 font-mono">
            {totalRevenue.toLocaleString('fr-MA')} DH
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-zinc-400 block">Bénéfice Net Période</span>
          <span className="text-sm sm:text-base font-bold text-emerald-400 font-mono">
            {totalProfit.toLocaleString('fr-MA')} DH
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-zinc-400 block">Marge Nette Moyenne</span>
          <span className="text-sm sm:text-base font-bold text-emerald-400 font-mono">
            +{averageMargin}%
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[240px] w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#22222a" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#71717a"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#71717a"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl border border-[#2a2a34] bg-[#141419]/95 p-3 text-xs shadow-2xl backdrop-blur-md space-y-1.5">
                        <div className="font-bold text-white border-b border-[#282834] pb-1">
                          {label}
                        </div>
                        <div className="flex items-center justify-between gap-4 text-cyan-400 font-mono">
                          <span>Revenus:</span>
                          <span className="font-bold">
                            {Number(payload[0]?.value).toLocaleString('fr-MA')} DH
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-purple-400 font-mono">
                          <span>Coûts:</span>
                          <span className="font-bold">
                            {Number(payload[1]?.value).toLocaleString('fr-MA')} DH
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-emerald-400 font-mono border-t border-[#282834] pt-1">
                          <span>Bénéfice:</span>
                          <span className="font-bold">
                            +{Number(payload[2]?.value).toLocaleString('fr-MA')} DH
                          </span>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="revenue" name="Revenus" fill="#22d3ee" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cost" name="Coûts" fill="#c084fc" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" name="Bénéfice" fill="#34d399" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#22222a" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#71717a"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#71717a"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl border border-[#2a2a34] bg-[#141419]/95 p-3 text-xs shadow-2xl backdrop-blur-md space-y-1.5">
                        <div className="font-bold text-white border-b border-[#282834] pb-1">
                          {label}
                        </div>
                        <div className="flex items-center justify-between gap-4 text-cyan-400 font-mono">
                          <span>Revenus:</span>
                          <span className="font-bold">
                            {Number(payload[0]?.value).toLocaleString('fr-MA')} DH
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-purple-400 font-mono">
                          <span>Coûts:</span>
                          <span className="font-bold">
                            {Number(payload[1]?.value).toLocaleString('fr-MA')} DH
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-emerald-400 font-mono border-t border-[#282834] pt-1">
                          <span>Bénéfice:</span>
                          <span className="font-bold">
                            +{Number(payload[2]?.value).toLocaleString('fr-MA')} DH
                          </span>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenus"
                stroke="#22d3ee"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#22d3ee' }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="cost"
                name="Coûts"
                stroke="#c084fc"
                strokeWidth={2}
                dot={{ r: 3, fill: '#c084fc' }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="profit"
                name="Bénéfice"
                stroke="#34d399"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#34d399' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
