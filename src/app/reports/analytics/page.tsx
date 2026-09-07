'use client'

import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

const REVENUE_AREA = [
  { month: 'Mai 24', revenue: 120000 },
  { month: 'Juil. 24', revenue: 155000 },
  { month: 'Sept. 24', revenue: 168000 },
  { month: 'Nov. 24', revenue: 175000 },
  { month: 'Janv. 25', revenue: 170000 },
  { month: 'Mars 25', revenue: 205000 },
  { month: 'Mai 25', revenue: 218450 },
]

const CHANNELS = [
  { name: 'Site web', percentage: 40 },
  { name: 'Walk-in (Showroom)', percentage: 30 },
  { name: 'Réseaux sociaux', percentage: 20 },
  { name: 'Partenaires & Semsars', percentage: 10 },
]

const VEHICLE_TYPES = [
  { name: 'SUV', percentage: 40, color: '#06b6d4' },
  { name: 'Berlines', percentage: 30, color: '#f59e0b' },
  { name: '4x4', percentage: 20, color: '#ef4444' },
  { name: 'Utilitaires', percentage: 10, color: '#10b981' },
]

const TOP_SOLD = [
  { id: 1, name: 'Toyota Land Cruiser', count: 12 },
  { id: 2, name: 'BMW X5', count: 9 },
  { id: 3, name: 'Mercedes-Benz GLC', count: 7 },
  { id: 4, name: 'Audi Q7', count: 6 },
  { id: 5, name: 'Toyota Hilux', count: 5 },
]

const PROFIT_MONTHLY = [
  { month: 'Déc.', nMinus1: 28000, n: 35000 },
  { month: 'Janv.', nMinus1: 25000, n: 31000 },
  { month: 'Févr.', nMinus1: 29000, n: 36000 },
  { month: 'Mars', nMinus1: 32000, n: 40000 },
  { month: 'Avr.', nMinus1: 27000, n: 33000 },
  { month: 'Mai', nMinus1: 30000, n: 36950 },
]

export default function ReportsAnalyticsPage() {
  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/reports"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour au tableau de bord</span>
        </Link>

        <div className="flex items-center gap-2">
          <input
            type="text"
            defaultValue="01/05/2025 - 31/05/2025"
            className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs font-mono text-zinc-300 focus:outline-none"
          />

          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <Download className="h-3.5 w-3.5 text-zinc-400" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Main Container matching Reference #27 Screen 2 (Analytics Détaillées) */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white">
            Analytics Détaillées
          </h1>
          <p className="text-xs text-zinc-400">
            Performance commerciale, canaux d&apos;acquisition et rentabilité par segment
          </p>
        </div>

        {/* 5 KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Chiffre d&apos;affaires</div>
            <div className="font-mono font-black text-white text-base mt-1">218 450 €</div>
            <div className="text-[9px] text-cyan-400 font-semibold">↑ 18,7%</div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Bénéfice net</div>
            <div className="font-mono font-black text-emerald-400 text-base mt-1">36 950 €</div>
            <div className="text-[9px] text-emerald-400 font-semibold">↑ 14,6%</div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Marge bénéficiaire</div>
            <div className="font-mono font-black text-white text-base mt-1">16,9%</div>
            <div className="text-[9px] text-emerald-400 font-semibold">↑ 2,1 pts</div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Transactions</div>
            <div className="font-mono font-black text-white text-base mt-1">86</div>
            <div className="text-[9px] text-emerald-400 font-semibold">↑ 33,3%</div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center col-span-2 sm:col-span-1">
            <div className="text-[10px] text-zinc-400">Panier moyen</div>
            <div className="font-mono font-black text-white text-base mt-1">2 540 €</div>
            <div className="text-[9px] text-emerald-400 font-semibold">↑ 4,7%</div>
          </div>
        </div>

        {/* Row 1: Évolution CA + Performances par canal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col justify-between h-[230px]">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Évolution du chiffre d&apos;affaires
            </h3>

            <div className="h-[160px] w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_AREA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#22222a" vertical={false} />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={8} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" fontSize={8} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-[#2a2a34] bg-[#18181f]/95 p-1.5 text-[10px] shadow-2xl">
                            <span className="font-bold text-white">{label}: </span>
                            <span className="font-mono text-red-400 font-bold">
                              {Number(payload[0]?.value).toLocaleString('fr-FR')} €
                            </span>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performances par canal */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col justify-between h-[230px]">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Performances par canal
            </h3>

            <div className="space-y-2 py-1 flex-1 flex flex-col justify-center">
              {CHANNELS.map((ch) => (
                <div key={ch.name} className="space-y-0.5 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-zinc-300">{ch.name}</span>
                    <span className="font-mono text-zinc-400 font-bold">{ch.percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#1e1e24] overflow-hidden">
                    <div className="h-full bg-red-600 rounded-full" style={{ width: `${ch.percentage * 2.5}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Type véhicule + Top 5 + Profit Mensuel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Répartition par type de véhicule */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col justify-between h-[230px]">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Répartition par type de véhicule
            </h3>

            <div className="grid grid-cols-2 items-center gap-2 flex-1">
              <div className="relative h-[120px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={VEHICLE_TYPES}
                      cx="50%"
                      cy="50%"
                      innerRadius={32}
                      outerRadius={50}
                      paddingAngle={2}
                      dataKey="percentage"
                    >
                      {VEHICLE_TYPES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#16161c" strokeWidth={2} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-mono text-xs font-black text-white">86</span>
                  <span className="text-[7px] text-zinc-400 uppercase font-bold">Ventes</span>
                </div>
              </div>

              <div className="space-y-1 text-[9px]">
                {VEHICLE_TYPES.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1 truncate pr-1">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-zinc-300 truncate">{item.name}</span>
                    </div>
                    <span className="font-mono text-zinc-400 font-semibold">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top 5 véhicules vendus */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col justify-between h-[230px]">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Top 5 véhicules vendus
            </h3>

            <div className="space-y-1.5 text-[11px] py-1">
              {TOP_SOLD.map((v) => (
                <div key={v.id} className="flex items-center justify-between p-1.5 rounded-lg bg-[#121216]">
                  <div className="flex items-center gap-2 truncate pr-1">
                    <span className="font-mono text-zinc-500 font-bold text-[10px] w-3">{v.id}</span>
                    <span className="text-zinc-200 truncate">{v.name}</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 shrink-0 text-xs">{v.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Analyse mensuelle profit */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col justify-between h-[230px]">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Analyse mensuelle (profit)
            </h3>

            <div className="h-[150px] w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PROFIT_MONTHLY} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#22222a" vertical={false} />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={8} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" fontSize={8} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                  <Bar dataKey="nMinus1" fill="#4b5563" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="n" fill="#ef4444" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
