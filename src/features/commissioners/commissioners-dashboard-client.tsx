'use client'

import React from 'react'
import Link from 'next/link'
import {
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  Percent,
  ShoppingCart,
  List,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { CommissionersActivityChart } from './commissioners-activity-chart'
import { CommissionersStatusDonut } from './commissioners-status-donut'
import { CommissionersCommissionsBarChart } from './commissioners-commissions-bar-chart'

interface TopBroker {
  id: number
  name: string
  transactions: number
  amount: string
  avatarText: string
}

interface ChannelConversion {
  name: string
  rate: string
  percentage: number
}

export function CommissionersDashboardClient() {
  const topBrokers: TopBroker[] = []
  const channels: ChannelConversion[] = []
  return (
    <div className="space-y-4">
      {/* Top Header matching Reference #16 Screen 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Commissionnaires — Tableau de bord
          </h1>
          <p className="text-xs text-zinc-400">
            Vue d&apos;ensemble des performances de votre réseau de commissionnaires
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs text-zinc-300">
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            <span>01/05/2025 - 31/05/2025</span>
          </div>

          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <Filter className="h-3.5 w-3.5 text-zinc-400" />
            <span>Filtres</span>
          </button>

          <Link
            href="/commissioners/list"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <List className="h-3.5 w-3.5" />
            <span>Liste des commissionnaires</span>
          </Link>
        </div>
      </div>

      {/* 6 KPI Cards matching Reference #16 Screen 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Commissionnaires actifs */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Commissionnaires actifs</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <Users className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-lg sm:text-xl">
            48
          </div>
          <div className="mt-1 text-[10px] text-cyan-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="h-3 w-3" />
            <span>12,5% ce mois</span>
          </div>
        </div>

        {/* Transactions générées */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Transactions générées</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <Briefcase className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-lg sm:text-xl">
            215
          </div>
          <div className="mt-1 text-[10px] text-cyan-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="h-3 w-3" />
            <span>18,7% ce mois</span>
          </div>
        </div>

        {/* Commissions payées */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Commissions payées</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-base sm:text-lg">
            248 750 DH
          </div>
          <div className="mt-1 text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="h-3 w-3" />
            <span>15,9% ce mois</span>
          </div>
        </div>

        {/* Commissions en attente */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Commissions en attente</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-base sm:text-lg">
            62 540 DH
          </div>
          <div className="mt-1 text-[10px] text-red-400 flex items-center gap-1 font-semibold">
            <ArrowDownRight className="h-3 w-3" />
            <span>8,3% ce mois</span>
          </div>
        </div>

        {/* Taux de conversion moyen */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Taux de conversion moy.</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-700/40 text-zinc-300">
              <Percent className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-lg sm:text-xl">
            23,6%
          </div>
          <div className="mt-1 text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="h-3 w-3" />
            <span>3,6 pts ce mois</span>
          </div>
        </div>

        {/* Panier moyen généré */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Panier moyen généré</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShoppingCart className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-base sm:text-lg">
            246 800 DH
          </div>
          <div className="mt-1 text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="h-3 w-3" />
            <span>11,2% ce mois</span>
          </div>
        </div>
      </div>

      {/* Middle Row (3 Visualizations) matching Reference #16 Screen 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <CommissionersActivityChart />
        <CommissionersStatusDonut />

        {/* Top 5 commissionnaires ranking card */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between h-[280px] shadow-sm">
          <div className="flex items-center justify-between border-b border-[#202028] pb-2">
            <h3 className="text-xs font-bold text-white tracking-wide">
              Top 5 commissionnaires
            </h3>
            <span className="text-zinc-500 text-[10px]">Ce mois ⌄</span>
          </div>

          <div className="space-y-2 py-1">
            {topBrokers.length === 0 && (
              <div className="py-4 text-center text-zinc-500 text-[10px]">Aucune donnée disponible</div>
            )}
            {topBrokers.map((broker) => (
              <div
                key={broker.id}
                className="flex items-center justify-between rounded-lg bg-[#16161c] px-3 py-1.5 border border-[#202028] hover:border-[#2e2e3a] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-zinc-500 text-[11px] font-bold w-3">
                    {broker.id}
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#20202a] border border-[#2a2a38] text-[10px] font-bold text-white">
                    {broker.avatarText}
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">{broker.name}</div>
                    <div className="text-[10px] text-zinc-500">{broker.transactions} transactions</div>
                  </div>
                </div>

                <div className="font-mono font-bold text-white text-xs">
                  {broker.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row (3 Visualizations) matching Reference #16 Screen 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left: Commissions Bar Chart */}
        <CommissionersCommissionsBarChart />

        {/* Center: Taux de conversion par canal */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between h-[280px] shadow-sm">
          <div className="border-b border-[#202028] pb-2">
            <h3 className="text-xs font-bold text-white tracking-wide">
              Taux de conversion par canal
            </h3>
          </div>

          <div className="space-y-3.5 py-1">
            {channels.length === 0 && (
              <div className="py-4 text-center text-zinc-500 text-[10px]">Aucune donnée disponible</div>
            )}
            {channels.map((ch) => (
              <div key={ch.name} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-zinc-300 font-medium">{ch.name}</span>
                  <span className="font-mono font-bold text-white">{ch.rate}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#1c1c24]">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${ch.percentage * 2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-zinc-500 text-center">
            Moyenne générale réseau : <strong className="text-white">23,6%</strong>
          </div>
        </div>

        {/* Right: Aperçu financier (DH) */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between h-[280px] shadow-sm">
          <div className="flex items-center justify-between border-b border-[#202028] pb-2">
            <h3 className="text-xs font-bold text-white tracking-wide">
              Aperçu financier (DH)
            </h3>
            <span className="text-zinc-500 text-[10px]">Ce mois ⌄</span>
          </div>

          <div className="space-y-3 text-[11px] py-1">
            <div className="flex justify-between py-1.5 border-b border-[#202028]">
              <span className="text-zinc-400">Valeur totale des ventes</span>
              <span className="font-mono font-bold text-white">52 962 000 DH</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#202028]">
              <span className="text-zinc-400">Commissions payées</span>
              <span className="font-mono font-bold text-cyan-400">248 750 DH</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#202028]">
              <span className="text-zinc-400">Commissions en attente</span>
              <span className="font-mono font-bold text-red-400">62 540 DH</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-zinc-400">Taux de commission moyen</span>
              <span className="font-mono font-bold text-emerald-400">4,68%</span>
            </div>
          </div>

          <div className="rounded-lg bg-[#16161c] border border-[#24242e] p-2 text-[10px] text-zinc-400 text-center">
            Prochain cycle de paiement : <strong className="text-white">15/06/2025</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
