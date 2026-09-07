'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  ArrowUpRight,
  Car,
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const PERF_EVOLUTION = [
  { date: '01 Mai', transactions: 2, volume: 420000 },
  { date: '08 Mai', transactions: 6, volume: 1180000 },
  { date: '15 Mai', transactions: 8, volume: 1650000 },
  { date: '22 Mai', transactions: 5, volume: 1120000 },
  { date: '31 Mai', transactions: 5, volume: 1475000 },
]

const CATEGORY_DATA = [
  { name: 'SUV', percentage: 58, color: '#06b6d4' },
  { name: 'Berline', percentage: 24, color: '#f59e0b' },
  { name: 'Pick-up', percentage: 10, color: '#10b981' },
  { name: 'Autres', percentage: 8, color: '#6b7280' },
]

const TOP_VEHICLES = [
  { rank: 1, name: 'Toyota Land Cruiser', count: 6 },
  { rank: 2, name: 'BMW X5', count: 4 },
  { rank: 3, name: 'Mercedes GLC', count: 3 },
  { rank: 4, name: 'Audi Q7', count: 2 },
  { rank: 5, name: 'Autres', count: 11 },
]

export default function CommissionerPerformancesPage() {
  const params = useParams()
  const code = (params?.id as string) || 'COM-00048'

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={`/commissioners/${code}`}
          className="flex items-center gap-1 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour Yassine Benali</span>
        </Link>
      </div>

      {/* Main Container matching Reference #16 Screen 6 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
            Performance du commissionnaire
          </h1>
          <p className="text-xs text-zinc-400">
            Analytique détaillée et comparaison des performances pour Yassine Benali
          </p>
        </div>

        {/* 6 Metric Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3">
            <div className="text-[10px] text-zinc-400">Transactions</div>
            <div className="font-mono font-black text-white text-base">26</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-semibold">
              <ArrowUpRight className="h-2.5 w-2.5" />
              <span>18,2%</span>
            </div>
          </div>

          <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3">
            <div className="text-[10px] text-zinc-400">Ventes générées</div>
            <div className="font-mono font-black text-white text-base">5 845 000 DH</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-semibold">
              <ArrowUpRight className="h-2.5 w-2.5" />
              <span>21,4%</span>
            </div>
          </div>

          <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3">
            <div className="text-[10px] text-zinc-400">Taux de conversion</div>
            <div className="font-mono font-black text-white text-base">28,4%</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-semibold">
              <ArrowUpRight className="h-2.5 w-2.5" />
              <span>3,6 pts</span>
            </div>
          </div>

          <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3">
            <div className="text-[10px] text-zinc-400">Panier moyen</div>
            <div className="font-mono font-black text-white text-base">224 808 DH</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-semibold">
              <ArrowUpRight className="h-2.5 w-2.5" />
              <span>2,1%</span>
            </div>
          </div>

          <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3">
            <div className="text-[10px] text-zinc-400">Commissions</div>
            <div className="font-mono font-black text-cyan-400 text-base">58 450 DH</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-semibold">
              <ArrowUpRight className="h-2.5 w-2.5" />
              <span>19,7%</span>
            </div>
          </div>

          <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3">
            <div className="text-[10px] text-zinc-400">Taux commission</div>
            <div className="font-mono font-black text-emerald-400 text-base">4,85%</div>
            <div className="text-[10px] text-zinc-500 font-semibold">Fixe réseau</div>
          </div>
        </div>

        {/* Middle Section: Evolution + Category Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-1">
          {/* Evolution Chart (2 cols wide) */}
          <div className="lg:col-span-2 rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col justify-between h-[260px]">
            <div className="flex items-center justify-between border-b border-[#202028] pb-2">
              <h3 className="text-xs font-bold text-white">Évolution des performances</h3>
              <div className="flex items-center gap-3 text-[10px]">
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  <span className="text-zinc-400">Transactions</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span className="text-zinc-400">Ventes (DH)</span>
                </div>
              </div>
            </div>

            <div className="w-full flex-1 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={PERF_EVOLUTION} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#202028" vertical={false} />
                  <XAxis dataKey="date" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}K`} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-[#2a2a34] bg-[#18181f]/95 p-2 text-[11px] shadow-2xl">
                            <div className="font-bold text-white">{label}</div>
                            <div className="text-cyan-400 font-mono">Transactions : {payload[0]?.value}</div>
                            <div className="text-red-400 font-mono">Ventes : {payload[1]?.value?.toLocaleString('fr-FR')} DH</div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="transactions" stroke="#06b6d4" strokeWidth={2} dot={{ r: 2.5 }} />
                  <Line yAxisId="right" type="monotone" dataKey="volume" stroke="#ef4444" strokeWidth={2} dot={{ r: 2.5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Donut (1 col wide) */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col justify-between h-[260px]">
            <div className="border-b border-[#202028] pb-2">
              <h3 className="text-xs font-bold text-white">Ventes par catégorie</h3>
            </div>

            <div className="flex items-center gap-2 flex-1">
              <div className="relative h-[130px] w-1/2 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={35} outerRadius={52} paddingAngle={2} dataKey="percentage">
                      {CATEGORY_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#121216" strokeWidth={2} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-mono text-xs font-black text-white">26</span>
                  <span className="text-[8px] font-bold text-zinc-400 uppercase">Transactions</span>
                </div>
              </div>

              <div className="space-y-1.5 text-[10px] w-1/2">
                {CATEGORY_DATA.map((c) => (
                  <div key={c.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-zinc-300">{c.name}</span>
                    </div>
                    <span className="font-mono font-bold text-white">{c.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Comparaison avec la moyenne + Top véhicules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-1">
          {/* Comparaison avec la moyenne (2 cols wide) */}
          <div className="lg:col-span-2 rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col justify-between">
            <div className="border-b border-[#202028] pb-2">
              <h3 className="text-xs font-bold text-white">Comparaison avec la moyenne du réseau</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3">
              <div className="flex flex-col items-center justify-center rounded-xl bg-[#121216] border border-[#222228] p-3 text-center space-y-1.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-red-500/40 bg-red-500/10 text-red-400 font-mono font-black text-xs">
                  -18,2%
                </div>
                <div className="text-[10px] text-zinc-400 font-medium">Transactions</div>
              </div>

              <div className="flex flex-col items-center justify-center rounded-xl bg-[#121216] border border-[#222228] p-3 text-center space-y-1.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-mono font-black text-xs">
                  +3,6 pts
                </div>
                <div className="text-[10px] text-zinc-400 font-medium">Taux de conversion</div>
              </div>

              <div className="flex flex-col items-center justify-center rounded-xl bg-[#121216] border border-[#222228] p-3 text-center space-y-1.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-cyan-500/40 bg-cyan-500/10 text-cyan-400 font-mono font-black text-xs">
                  +2,1%
                </div>
                <div className="text-[10px] text-zinc-400 font-medium">Panier moyen</div>
              </div>

              <div className="flex flex-col items-center justify-center rounded-xl bg-[#121216] border border-[#222228] p-3 text-center space-y-1.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-mono font-black text-xs">
                  +19,7%
                </div>
                <div className="text-[10px] text-zinc-400 font-medium">Commissions</div>
              </div>
            </div>
          </div>

          {/* Top véhicules vendus (1 col wide) */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col justify-between">
            <div className="border-b border-[#202028] pb-2">
              <h3 className="text-xs font-bold text-white">Top véhicules vendus</h3>
            </div>

            <div className="space-y-2 py-2">
              {TOP_VEHICLES.map((v) => (
                <div key={v.rank} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="font-mono text-zinc-500 font-bold w-3">{v.rank}</span>
                    <Car className="h-3 w-3 text-zinc-400 shrink-0" />
                    <span className="text-zinc-300 truncate">{v.name}</span>
                  </div>
                  <span className="font-mono font-bold text-white shrink-0">{v.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
