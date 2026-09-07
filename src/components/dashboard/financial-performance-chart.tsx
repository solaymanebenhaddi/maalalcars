'use client'

import React, { useState, useMemo } from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { TrendingUp, ChevronDown } from 'lucide-react'

export interface FinancialDataPoint {
  month: string
  revenue: number
  cost: number
  profit: number
  marginPct?: number
  barValue?: number
  year?: number
  monthIndex?: number
}

interface FinancialPerformanceChartProps {
  data: FinancialDataPoint[]
}

export function FinancialPerformanceChart({
  data,
}: FinancialPerformanceChartProps) {
  const [period, setPeriod] = useState<'6M' | '12M' | 'YTD' | 'Tout'>('6M')
  const [granularity, setGranularity] = useState<'Mensuelle' | 'Hebdomadaire'>('Mensuelle')
  const [isGranularityOpen, setIsGranularityOpen] = useState(false)

  const filteredData = useMemo(() => {
    const now = new Date()
    switch (period) {
      case '6M':
        return data.slice(-6)
      case '12M':
        return data.slice(-12)
      case 'YTD': {
        const currentYear = now.getFullYear()
        return data.filter((d) => d.year === currentYear)
      }
      case 'Tout':
        return data
    }
  }, [data, period])

  // Compute strip metrics from filtered data
  const totalRevenue = filteredData.reduce((sum, d) => sum + d.revenue, 0)
  const totalProfit = filteredData.reduce((sum, d) => sum + d.profit, 0)
  const averageMargin =
    totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 1000) / 10 : 0

  // Ensure barValue is mapped for the background column bars
  const chartData = filteredData.map((d) => ({
    ...d,
    barValue: d.barValue ?? Math.max(d.profit, d.revenue * 0.28),
    marginPct: d.marginPct ?? (d.revenue > 0 ? Math.round((d.profit / d.revenue) * 1000) / 10 : 0),
  }))

  const hasData = filteredData.some((d) => d.revenue > 0)

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#1e2029] bg-[#121318] p-5 shadow-lg shadow-black/40 min-h-[420px]">
      {/* 1. Header: Icon, Title & Period Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1c1e28] pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 shadow-[0_0_12px_rgba(239,68,68,0.25)]">
            <TrendingUp className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold tracking-wider text-white uppercase font-sans">
              Performance &amp; Rentabilité Commerciale
            </h3>
            <p className="text-[10px] sm:text-[11px] text-zinc-400">
              Évolution comparée du Chiffre d&apos;Affaires, des Coûts et du Bénéfice Net (DH)
            </p>
          </div>
        </div>

        {/* Period Selector Pills */}
        <div className="flex items-center rounded-lg border border-[#262838] bg-[#161822] p-1 self-start sm:self-auto">
          {(['6M', '12M', 'YTD', 'Tout'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition-all ${
                period === p
                  ? 'bg-red-600 text-white shadow-[0_0_8px_rgba(220,38,38,0.5)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Strip Metrics & Granularity Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 items-center gap-3 border-b border-[#1c1e28] py-3 text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
            CA CUMULÉ PÉRIODE
          </span>
          <span className="text-sm sm:text-base font-black text-cyan-400 font-mono">
            {totalRevenue.toLocaleString('fr-MA')} DH
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
            BÉNÉFICE NET PÉRIODE
          </span>
          <span className="text-sm sm:text-base font-black text-purple-400 font-mono">
            {totalProfit.toLocaleString('fr-MA')} DH
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
            MARGE NETTE MOYENNE
          </span>
          <span className="text-sm sm:text-base font-black text-emerald-400 font-mono">
            +{averageMargin}%
          </span>
        </div>

        <div className="relative flex sm:justify-end">
          <button
            type="button"
            onClick={() => setIsGranularityOpen(!isGranularityOpen)}
            className="flex items-center gap-1.5 rounded-lg border border-[#242636] bg-[#151722] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors"
          >
            <span>{granularity}</span>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
          </button>

          {isGranularityOpen && (
            <div className="absolute right-0 top-10 w-36 rounded-xl border border-[#2a2d3d] bg-[#141620] p-1 shadow-2xl z-30 text-xs">
              <button
                type="button"
                onClick={() => {
                  setGranularity('Mensuelle')
                  setIsGranularityOpen(false)
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-md text-zinc-200 hover:bg-[#1f2233]"
              >
                Mensuelle
              </button>
              <button
                type="button"
                onClick={() => {
                  setGranularity('Hebdomadaire')
                  setIsGranularityOpen(false)
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-md text-zinc-200 hover:bg-[#1f2233]"
              >
                Hebdomadaire
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. High-Tech Recharts Canvas */}
      <div className="h-[250px] w-full pt-2">
        {!hasData ? (
          <div className="flex items-center justify-center h-64 text-xs text-zinc-500">
            Aucune donnée financière disponible pour le moment.
          </div>
        ) : null}
        {hasData && <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 15, right: 10, left: -15, bottom: 5 }}
            barGap={8}
          >
            <defs>
              {/* Neon Purple Bar Gradient */}
              <linearGradient id="purpleBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9" />
                <stop offset="25%" stopColor="#a855f7" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#6b21a8" stopOpacity="0.1" />
              </linearGradient>

              {/* Cyan Glow Filter */}
              <filter id="neonCyan" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#06b6d4" floodOpacity="0.8" />
              </filter>

              {/* Red Glow Filter */}
              <filter id="neonRed" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ef4444" floodOpacity="0.8" />
              </filter>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1c1e28" vertical={false} />

            <XAxis
              dataKey="month"
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={6}
            />

            <YAxis
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (v === 0 ? '0' : `${Math.round(v / 1000)}k`)}
              domain={[0, (dataMax: number) => Math.max(600000, Math.ceil(dataMax * 1.15))]}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const pData = payload[0].payload as FinancialDataPoint
                  return (
                    <div className="rounded-xl border border-cyan-500/50 bg-[#0d0e14]/95 p-3.5 text-xs shadow-2xl backdrop-blur-md space-y-2 min-w-[170px] drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                      <div className="font-bold text-white border-b border-[#242636] pb-1.5 flex items-center justify-between">
                        <span>{label}</span>
                        <span className="text-[10px] text-cyan-400 font-mono">Clôture</span>
                      </div>

                      <div className="flex items-center justify-between gap-4 font-mono text-[11px]">
                        <span className="flex items-center gap-1.5 text-cyan-400">
                          <span className="h-2 w-2 rounded-full bg-cyan-400" />
                          <span>CA</span>
                        </span>
                        <span className="font-bold text-white">
                          {Number(pData.revenue).toLocaleString('fr-MA')} DH
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4 font-mono text-[11px]">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          <span>Bénéfice</span>
                        </span>
                        <span className="font-bold text-emerald-400">
                          {Number(pData.profit).toLocaleString('fr-MA')} DH
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4 font-mono text-[11px]">
                        <span className="flex items-center gap-1.5 text-red-400">
                          <span className="h-2 w-2 rotate-45 bg-red-400 inline-block" />
                          <span>Coûts</span>
                        </span>
                        <span className="font-bold text-red-300">
                          {Number(pData.cost).toLocaleString('fr-MA')} DH
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4 font-mono text-[11px] border-t border-[#242636] pt-1.5">
                        <span className="flex items-center gap-1.5 text-purple-400">
                          <span className="h-2 w-2 rotate-45 bg-purple-400 inline-block" />
                          <span>Marge</span>
                        </span>
                        <span className="font-bold text-purple-300">
                          {pData.marginPct ?? 0}%
                        </span>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />

            {/* Neon Bar Pillars */}
            <Bar
              dataKey="barValue"
              name="Volume"
              fill="url(#purpleBarGrad)"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />

            {/* Cyan Curve for Chiffre d'Affaires */}
            <Line
              type="monotone"
              dataKey="revenue"
              name="Chiffre d'Affaires (CA)"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={{ r: 4, fill: '#06b6d4', stroke: '#121318', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#22d3ee', stroke: '#ffffff', strokeWidth: 2 }}
              filter="url(#neonCyan)"
            />

            {/* Red Curve for Coûts & Frais */}
            <Line
              type="monotone"
              dataKey="cost"
              name="Coûts & Frais"
              stroke="#ef4444"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#ef4444', stroke: '#121318', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#f87171', stroke: '#ffffff', strokeWidth: 2 }}
              filter="url(#neonRed)"
            />

            {/* Purple Curve for Bénéfice Net */}
            <Line
              type="monotone"
              dataKey="profit"
              name="Bénéfice Net"
              stroke="#c084fc"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#c084fc', stroke: '#121318', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#e879f9', stroke: '#ffffff', strokeWidth: 2 }}
            />

            {/* Dashed Line for Marge Nette % */}
            <Line
              type="monotone"
              dataKey="marginPct"
              name="Marge Nette (%)"
              stroke="#94a3b8"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>}
      </div>

      {/* 4. Legend Matching Reference Design */}
      <div className="flex flex-wrap items-center justify-center gap-5 pt-3 border-t border-[#1c1e28] text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#06b6d4]" />
          <span className="text-zinc-300 font-medium">Chiffre d&apos;Affaires (CA)</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" />
          <span className="text-zinc-300 font-medium">Coûts &amp; Frais</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-purple-400 shadow-[0_0_6px_#c084fc]" />
          <span className="text-zinc-300 font-medium">Bénéfice Net</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-4 border-t-2 border-dashed border-zinc-400 inline-block" />
          <span className="text-zinc-400 font-medium">Marge Nette (%)</span>
        </div>
      </div>
    </div>
  )
}
