'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Hash,
  Share2,
  Edit2,
  ChevronDown,
  ArrowUpRight,
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

const PERF_DATA = [
  { date: '01 Mai', transactions: 3, volume: 450000 },
  { date: '08 Mai', transactions: 5, volume: 920000 },
  { date: '15 Mai', transactions: 7, volume: 1450000 },
  { date: '22 Mai', transactions: 6, volume: 1250000 },
  { date: '31 Mai', transactions: 5, volume: 1775000 },
]

const STATUS_DATA = [
  { name: 'Confirmées', count: 18, percentage: 69.2, color: '#06b6d4' },
  { name: 'En attente', count: 5, percentage: 19.2, color: '#f59e0b' },
  { name: 'Annulées', count: 2, percentage: 7.7, color: '#ef4444' },
  { name: 'Perdues', count: 1, percentage: 3.8, color: '#4b5563' },
]

export default function CommissionerDetailPage() {
  const params = useParams()
  const code = (params?.id as string) || 'COM-00048'

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/commissioners/list"
            className="flex items-center gap-1 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour</span>
          </Link>
          <h1 className="text-sm sm:text-base font-black text-white">
            Détail commissionnaire
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <Edit2 className="h-3.5 w-3.5 text-zinc-400" />
            <span>Modifier</span>
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <span>Actions</span>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Main Container matching Reference #16 Screen 3 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        {/* Profile Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#222228] pb-4">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-[#2e2e3a] bg-[#1a1a24]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/avatars/yassine-benali.jpg"
                alt="Youssef El Idrissi"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Yassine Benali
                </h2>
                <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  Actif
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Commissionnaire</p>
            </div>
          </div>

          {/* Details metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-[11px] text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Phone className="h-3 w-3 text-zinc-500" />
              <span className="font-mono text-zinc-300">+212 6 61 23 45 67</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="h-3 w-3 text-zinc-500" />
              <span className="text-zinc-300">yassine.benali@gmail.com</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-zinc-500" />
              <span className="text-zinc-300">Casablanca</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3 text-zinc-500" />
              <span>Inscrit le : <strong className="text-zinc-300 font-mono">15/02/2023</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Hash className="h-3 w-3 text-zinc-500" />
              <span>Code : <strong className="text-zinc-300 font-mono">COM-00048</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Share2 className="h-3 w-3 text-zinc-500" />
              <span>Réseau : <strong className="text-zinc-300">Réseau personnel</strong></span>
            </div>
          </div>
        </div>

        {/* 6 Top KPIs + Statut du compte Card */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Transactions */}
            <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3">
              <div className="text-[10px] text-zinc-400">Transactions</div>
              <div className="font-mono font-black text-white text-base">26</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-semibold">
                <ArrowUpRight className="h-2.5 w-2.5" />
                <span>18,2%</span>
              </div>
            </div>

            {/* Ventes générées */}
            <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3">
              <div className="text-[10px] text-zinc-400">Ventes générées</div>
              <div className="font-mono font-black text-white text-base">5 845 000 DH</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-semibold">
                <ArrowUpRight className="h-2.5 w-2.5" />
                <span>21,4%</span>
              </div>
            </div>

            {/* Commissions gagnées */}
            <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3">
              <div className="text-[10px] text-zinc-400">Commissions gagnées</div>
              <div className="font-mono font-black text-cyan-400 text-base">58 450 DH</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-semibold">
                <ArrowUpRight className="h-2.5 w-2.5" />
                <span>19,7%</span>
              </div>
            </div>

            {/* Taux de conversion */}
            <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3">
              <div className="text-[10px] text-zinc-400">Taux de conversion</div>
              <div className="font-mono font-black text-white text-base">28,4%</div>
            </div>

            {/* Panier moyen */}
            <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3">
              <div className="text-[10px] text-zinc-400">Panier moyen</div>
              <div className="font-mono font-black text-white text-base">224 808 DH</div>
            </div>

            {/* Taux de commission */}
            <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3">
              <div className="text-[10px] text-zinc-400">Taux de commission</div>
              <div className="font-mono font-black text-emerald-400 text-base">4,85%</div>
            </div>
          </div>

          {/* Statut du compte */}
          <div className="rounded-lg border border-[#24242e] bg-[#16161c] p-3 flex flex-col justify-between text-[11px]">
            <div className="flex items-center justify-between border-b border-[#202028] pb-1.5">
              <span className="font-bold text-white">Statut du compte</span>
              <span className="font-bold text-emerald-400">Actif</span>
            </div>
            <div className="space-y-1.5 py-1">
              <div className="flex justify-between">
                <span className="text-zinc-400">Solde en attente</span>
                <span className="font-mono font-bold text-red-400">12 450 DH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Total payé</span>
                <span className="font-mono font-bold text-white">46 000 DH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Dernier paiement</span>
                <span className="font-mono text-zinc-300">28/05/2025</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs matching Reference #16 */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs">
          <button className="font-bold text-white relative pb-1">
            <span>Aperçu</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <Link
            href={`/commissioners/${code}/transactions`}
            className="text-zinc-400 hover:text-white font-semibold"
          >
            Transactions
          </Link>
          <Link
            href={`/commissioners/${code}/commissions`}
            className="text-zinc-400 hover:text-white font-semibold"
          >
            Commissions
          </Link>
          <Link
            href={`/commissioners/${code}/performances`}
            className="text-zinc-400 hover:text-white font-semibold"
          >
            Performances
          </Link>
        </div>

        {/* 2 Panels in Aperçu */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-1">
          {/* Left: Évolution des performances (2 cols wide) */}
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
                <LineChart data={PERF_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

          {/* Right: Répartition par statut (1 col wide) */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col justify-between h-[260px]">
            <div className="border-b border-[#202028] pb-2">
              <h3 className="text-xs font-bold text-white">Répartition par statut</h3>
            </div>

            <div className="flex items-center gap-2 flex-1">
              <div className="relative h-[130px] w-1/2 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={STATUS_DATA} cx="50%" cy="50%" innerRadius={35} outerRadius={52} paddingAngle={2} dataKey="count">
                      {STATUS_DATA.map((entry, index) => (
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
                {STATUS_DATA.map((s) => (
                  <div key={s.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1 truncate pr-1">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-zinc-300 truncate">{s.name}</span>
                    </div>
                    <span className="font-mono text-zinc-400 shrink-0">{s.count} ({s.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
