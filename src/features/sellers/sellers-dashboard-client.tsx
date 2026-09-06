'use client'

import React from 'react'
import Link from 'next/link'
import {
  Users,
  UserCheck,
  DollarSign,
  TrendingUp,
  Clock,
  Car,
  List,
  Calendar,
  Filter,
  ArrowUpRight,
} from 'lucide-react'
import { SellerPurchasesChart } from './seller-purchases-chart'
import { SellerTopDonut } from './seller-top-donut'
import { SellerPendingDebt } from './seller-pending-debt'
import { SellerStatusDonut } from './seller-status-donut'

interface RecentSupply {
  id: number
  vehicle: string
  seller: string
  date: string
  amount: string
}

const RECENT_SUPPLIES: RecentSupply[] = [
  { id: 1, vehicle: 'Toyota Land Cruiser 2023', seller: 'Youssef El Idrissi', date: '30/05/2025', amount: '435 000 DH' },
  { id: 2, vehicle: 'BMW X5 2021', seller: 'Omar Bennani', date: '29/05/2025', amount: '365 000 DH' },
  { id: 3, vehicle: 'Mercedes-Benz GLC 2022', seller: 'Imane Zahiri', date: '28/05/2025', amount: '295 000 DH' },
  { id: 4, vehicle: 'Audi A6 2020', seller: 'Karim Talbi', date: '27/05/2025', amount: '185 000 DH' },
  { id: 5, vehicle: 'Hyundai Tucson 2021', seller: 'Nadia Kabbaj', date: '26/05/2025', amount: '142 000 DH' },
]

export function SellersDashboardClient() {
  return (
    <div className="space-y-4">
      {/* Top Header matching Reference #15 Screen 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Vendeurs — Tableau de bord
          </h1>
          <p className="text-xs text-zinc-400">
            Vue d&apos;ensemble de votre réseau de vendeurs
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
            href="/sellers/list"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <List className="h-3.5 w-3.5" />
            <span>Liste des vendeurs</span>
          </Link>
        </div>
      </div>

      {/* 6 KPI Cards matching Reference #15 Screen 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total vendeurs */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Total vendeurs</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <Users className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-lg sm:text-xl">
            128
          </div>
          <div className="mt-1 text-[10px] text-cyan-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="h-3 w-3" />
            <span>12 ce mois</span>
          </div>
        </div>

        {/* Vendeurs actifs */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Vendeurs actifs</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <UserCheck className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-lg sm:text-xl">
            96
          </div>
          <div className="mt-1 text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="h-3 w-3" />
            <span>8 ce mois</span>
          </div>
        </div>

        {/* Volume d'achats */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Volume d&apos;achats</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <DollarSign className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-base sm:text-lg">
            2 845 600 DH
          </div>
          <div className="mt-1 text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="h-3 w-3" />
            <span>14,7% ce mois</span>
          </div>
        </div>

        {/* Valeur moyenne / affaire */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Valeur moy. / affaire</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-base sm:text-lg">
            29 642 DH
          </div>
          <div className="mt-1 text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="h-3 w-3" />
            <span>6,2% ce mois</span>
          </div>
        </div>

        {/* Paiements en attente */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Paiements en attente</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-base sm:text-lg">
            287 450 DH
          </div>
          <div className="mt-1 text-[10px] text-red-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="h-3 w-3" />
            <span>3,4% ce mois</span>
          </div>
        </div>

        {/* Approvisionnements récents */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Approvisionnements</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <Car className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-lg sm:text-xl">
            37
          </div>
          <div className="mt-1 text-[10px] text-cyan-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="h-3 w-3" />
            <span>9 ce mois</span>
          </div>
        </div>
      </div>

      {/* Middle Visualizations (3 Columns) matching Reference #15 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <SellerPurchasesChart />
        <SellerTopDonut />
        <SellerPendingDebt />
      </div>

      {/* Bottom Section (2 Columns) matching Reference #15 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left: Approvisionnements récents (2 cols wide) */}
        <div className="lg:col-span-2 rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between border-b border-[#202028] pb-2.5">
            <h3 className="text-xs font-bold text-white tracking-wide">
              Approvisionnements récents
            </h3>
            <Link
              href="/sellers/list"
              className="text-[11px] font-semibold text-red-500 hover:text-red-400"
            >
              Voir tout
            </Link>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#202028] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  <th className="py-2">#</th>
                  <th className="py-2">Véhicule</th>
                  <th className="py-2">Vendeur</th>
                  <th className="py-2 font-mono">Date</th>
                  <th className="py-2 text-right">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24]">
                {RECENT_SUPPLIES.map((s) => (
                  <tr key={s.id} className="hover:bg-[#18181f] transition-colors">
                    <td className="py-2.5 text-zinc-500 font-mono text-[11px]">{s.id}</td>
                    <td className="py-2.5 font-bold text-white flex items-center gap-2">
                      <Car className="h-3.5 w-3.5 text-zinc-400" />
                      <span>{s.vehicle}</span>
                    </td>
                    <td className="py-2.5 text-zinc-300 font-medium">{s.seller}</td>
                    <td className="py-2.5 font-mono text-[11px] text-zinc-400">{s.date}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-white">
                      {s.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Statut des vendeurs donut (1 col wide) */}
        <SellerStatusDonut />
      </div>
    </div>
  )
}
