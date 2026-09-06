'use client'

import React from 'react'
import Link from 'next/link'
import {
  Users,
  UserCheck,
  Award,
  DollarSign,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  CreditCard,
  FileText,
  AlertCircle,
  List,
} from 'lucide-react'
import { BuyerPurchasesChart } from './buyer-purchases-chart'
import { BuyerDebtDonut } from './buyer-debt-donut'

const TOP_BUYERS = [
  { rank: 1, name: 'Imane Zahiri', volume: 1248500, percent: '21,2%', orders: 28, code: 'CLT-001' },
  { rank: 2, name: 'Youssef El Idrissi', volume: 980400, percent: '16,6%', orders: 22, code: 'CLT-002' },
  { rank: 3, name: 'Karim Bennani', volume: 856200, percent: '14,5%', orders: 19, code: 'CLT-003' },
  { rank: 4, name: 'Omar Bennis', volume: 745600, percent: '12,6%', orders: 18, code: 'CLT-004' },
  { rank: 5, name: 'Nadia K.', volume: 653300, percent: '11,1%', orders: 16, code: 'CLT-005' },
]

const ACTIVITIES = [
  {
    id: '1',
    user: 'Imane Zahiri',
    action: 'a passé une nouvelle commande',
    details: 'Toyota Land Cruiser 2023 • 86 500 DH',
    time: 'Il y a 15 min',
    icon: ShoppingCart,
    color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  },
  {
    id: '2',
    user: 'Youssef El Idrissi',
    action: 'a effectué un paiement',
    details: 'Paiement partiel • 25 000 DH',
    time: 'Il y a 1 heure',
    icon: CreditCard,
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  {
    id: '3',
    user: 'Karim Bennani',
    action: 'a reçu une facture',
    details: 'FAC-2025-0487 • 48 900 DH',
    time: 'Il y a 2 heures',
    icon: FileText,
    color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  {
    id: '4',
    user: 'Nadia K.',
    action: 'a un encours dépassé 60 jours',
    details: 'Encours : 38 200 DH',
    time: 'Il y a 3 heures',
    icon: AlertCircle,
    color: 'bg-red-500/10 text-red-400 border-red-500/20',
  },
  {
    id: '5',
    user: 'Omar Bennis',
    action: 'a passé une commande',
    details: 'BMW X5 2021 • 62 900 DH',
    time: 'Il y a 4 heures',
    icon: ShoppingCart,
    color: 'bg-red-500/10 text-red-400 border-red-500/20',
  },
]

const DEBT_STATUS = [
  { label: 'À jour', amount: '748 300 DH', percent: '66%', width: '66%', color: 'bg-emerald-500' },
  { label: '30 jours et moins', amount: '224 150 DH', percent: '20%', width: '20%', color: 'bg-cyan-500' },
  { label: '31 à 60 jours', amount: '123 600 DH', percent: '9%', width: '9%', color: 'bg-amber-500' },
  { label: '61 à 90 jours', amount: '36 650 DH', percent: '3%', width: '3%', color: 'bg-orange-500' },
  { label: '+ 90 jours', amount: '19 000 DH', percent: '2%', width: '2%', color: 'bg-red-500' },
]

export function BuyersDashboardClient() {
  return (
    <div className="space-y-4 text-xs text-white">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Acheteurs — Tableau de bord
          </h1>
          <p className="text-zinc-400 text-xs mt-0.5">
            Gérez vos acheteurs et leurs transactions en toute simplicité.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/buyers/list"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <List className="h-3.5 w-3.5" />
            <span>Liste des acheteurs</span>
          </Link>
        </div>
      </div>

      {/* 5 Top KPI Cards matching Reference #14 Screen 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* KPI 1: Total acheteurs */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-medium leading-tight">Total acheteurs</span>
            <div className="flex h-6 w-6 items-center justify-center rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
              <Users className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-lg font-black font-mono text-white">248</div>
          <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-semibold">
            <ArrowUpRight className="h-2.5 w-2.5" />
            <span>14 ce mois</span>
          </div>
        </div>

        {/* KPI 2: Acheteurs actifs */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-medium leading-tight">Acheteurs actifs</span>
            <div className="flex h-6 w-6 items-center justify-center rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <UserCheck className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-lg font-black font-mono text-white">186</div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
            <ArrowUpRight className="h-2.5 w-2.5" />
            <span>9 ce mois</span>
          </div>
        </div>

        {/* KPI 3: Top 5 acheteurs */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-medium leading-tight">Top 5 acheteurs</span>
            <div className="flex h-6 w-6 items-center justify-center rounded border border-blue-500/30 bg-blue-500/10 text-blue-400">
              <Award className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-lg font-black font-mono text-white">1 248 500 DH</div>
          <div className="flex items-center gap-1 text-[10px] text-blue-400 font-semibold">
            <span>38% du volume</span>
          </div>
        </div>

        {/* KPI 4: Volume d'achats */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-medium leading-tight">Volume d&apos;achats</span>
            <div className="flex h-6 w-6 items-center justify-center rounded border border-amber-500/30 bg-amber-500/10 text-amber-400">
              <DollarSign className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-lg font-black font-mono text-white">5 890 200 DH</div>
          <div className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold">
            <ArrowUpRight className="h-2.5 w-2.5" />
            <span>12,6% ce mois</span>
          </div>
        </div>

        {/* KPI 5: Encours clients */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-medium leading-tight">Encours clients</span>
            <div className="flex h-6 w-6 items-center justify-center rounded border border-red-500/30 bg-red-500/10 text-red-400">
              <Wallet className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-lg font-black font-mono text-white">1 125 750 DH</div>
          <div className="flex items-center gap-1 text-[10px] text-red-400 font-semibold">
            <ArrowDownRight className="h-2.5 w-2.5" />
            <span>4,3% ce mois</span>
          </div>
        </div>
      </div>

      {/* Middle Charts Grid (2 columns) matching Reference #14 Screen 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BuyerPurchasesChart />
        <BuyerDebtDonut />
      </div>

      {/* Bottom 3 Columns matching Reference #14 Screen 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column: Top 5 acheteurs par volume */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3 shadow-md flex flex-col justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
            Top 5 acheteurs par volume
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#222228] text-[10px] text-zinc-500">
                  <th className="pb-2 px-1">#</th>
                  <th className="pb-2 px-2">Acheteur</th>
                  <th className="pb-2 px-2 text-right">Achats (DH)</th>
                  <th className="pb-2 px-2 text-right">% du vol.</th>
                  <th className="pb-2 px-1 text-center">Cmds</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                {TOP_BUYERS.map((b) => (
                  <tr key={b.rank} className="hover:bg-[#18181f]">
                    <td className="py-2 px-1 font-mono text-zinc-500 text-[10px]">{b.rank}</td>
                    <td className="py-2 px-2 font-medium text-white">
                      <Link href={`/buyers/${b.code}`} className="hover:text-red-400">
                        {b.name}
                      </Link>
                    </td>
                    <td className="py-2 px-2 text-right font-mono font-bold text-white">
                      {b.volume.toLocaleString('fr-MA')} DH
                    </td>
                    <td className="py-2 px-2 text-right font-mono text-zinc-400">{b.percent}</td>
                    <td className="py-2 px-1 text-center font-mono text-zinc-300">{b.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Middle Column: Activité récente des acheteurs */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3 shadow-md">
          <div className="flex items-center justify-between border-b border-[#222228] pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Activité récente des acheteurs
            </h3>
            <Link href="/buyers/list" className="text-[10px] text-zinc-400 hover:text-white">
              Voir tout
            </Link>
          </div>

          <div className="space-y-2.5">
            {ACTIVITIES.map((act) => {
              const Icon = act.icon
              return (
                <div key={act.id} className="flex items-start gap-2.5 text-[11px]">
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded border ${act.color} mt-0.5`}
                  >
                    <Icon className="h-3 w-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white">
                      <strong className="text-white">{act.user}</strong>{' '}
                      <span className="text-zinc-400">{act.action}</span>
                    </div>
                    <div className="text-zinc-500 text-[10px] truncate">{act.details}</div>
                  </div>
                  <span className="text-[10px] text-zinc-500 shrink-0 font-mono">{act.time}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Statut des encours */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3 shadow-md flex flex-col justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
            Statut des encours
          </h3>

          <div className="space-y-2.5 text-[11px]">
            {DEBT_STATUS.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">{item.label}</span>
                  <span className="font-mono font-bold text-white">
                    {item.amount}{' '}
                    <span className="text-zinc-500 text-[10px]">({item.percent})</span>
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#1e1e26] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: item.width }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
