'use client'

import React from 'react'
import Link from 'next/link'
import {
  Filter,
} from 'lucide-react'
import { ReportsSalesProfitChart } from './reports-sales-profit-chart'
import { ReportsProfitDonut } from './reports-profit-donut'
import { ReportsComparisonBars } from './reports-comparison-bars'
import { ReportsStockStatusDonut } from './reports-stock-status-donut'
import { ReportsCategorySalesDonut } from './reports-category-sales-donut'

const EXPENSE_CATEGORIES = [
  { name: 'Achat de véhicules', amount: '12 450 €' },
  { name: 'Frais de personnel', amount: '4 900 €' },
  { name: 'Marketing', amount: '2 850 €' },
  { name: 'Loyer', amount: '2 200 €' },
  { name: 'Autres', amount: '1 000 €' },
]

const BRAND_SALES = [
  { name: 'Toyota', percentage: 28 },
  { name: 'BMW', percentage: 21 },
  { name: 'Mercedes-Benz', percentage: 18 },
  { name: 'Audi', percentage: 15 },
  { name: 'Autres', percentage: 18 },
]

export function ReportsDashboardClient() {
  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Top Header matching Reference #27 Screen 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Tableau de bord — Rapports &amp; Analytics
          </h1>
          <p className="text-xs text-zinc-400">
            Vue d&apos;ensemble de votre activité, rentabilité et performance commerciale
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            defaultValue="01/05/2025 - 31/05/2025"
            className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs font-mono text-zinc-300 focus:outline-none"
          />

          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <Filter className="h-3.5 w-3.5" />
            <span>Filtres</span>
          </button>
        </div>
      </div>

      {/* Subpage Navigation Bar */}
      <div className="flex items-center gap-4 border-b border-[#222228] pb-2 text-xs overflow-x-auto">
        <Link href="/reports" className="font-bold text-white relative pb-1 shrink-0">
          <span>Vue d&apos;ensemble</span>
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
        </Link>
        <Link href="/reports/analytics" className="text-zinc-400 hover:text-white font-semibold shrink-0">
          Analytics détaillées
        </Link>
        <Link href="/reports/sales" className="text-zinc-400 hover:text-white font-semibold shrink-0">
          Ventes
        </Link>
        <Link href="/reports/stock" className="text-zinc-400 hover:text-white font-semibold shrink-0">
          Stock &amp; Rotation
        </Link>
        <Link href="/reports/exports" className="text-zinc-400 hover:text-white font-semibold shrink-0">
          Exports &amp; Comparaisons
        </Link>
      </div>

      {/* 7 KPI Cards matching Reference #27 Screen 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {/* Ventes totales */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="text-[10px] text-zinc-400">Ventes totales</div>
          <div className="mt-1 font-mono font-black text-white text-sm sm:text-base">
            218 450 €
          </div>
          <div className="mt-0.5 text-[9px] text-cyan-400 font-semibold">
            ↑ 18,7% vs avril
          </div>
        </div>

        {/* Bénéfice net */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="text-[10px] text-zinc-400">Bénéfice net</div>
          <div className="mt-1 font-mono font-black text-emerald-400 text-sm sm:text-base">
            36 950 €
          </div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold">
            ↑ 14,6% vs avril
          </div>
        </div>

        {/* Dépenses totales */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="text-[10px] text-zinc-400">Dépenses totales</div>
          <div className="mt-1 font-mono font-black text-white text-sm sm:text-base">
            24 700 €
          </div>
          <div className="mt-0.5 text-[9px] text-red-400 font-semibold">
            ↓ 5,1% vs avril
          </div>
        </div>

        {/* Valeur du stock */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="text-[10px] text-zinc-400">Valeur du stock</div>
          <div className="mt-1 font-mono font-black text-white text-sm sm:text-base">
            1 248 500 €
          </div>
          <div className="mt-0.5 text-[9px] text-cyan-400 font-semibold">
            ↑ 5,4% vs avril
          </div>
        </div>

        {/* Marge bénéficiaire */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="text-[10px] text-zinc-400">Marge bénéficiaire</div>
          <div className="mt-1 font-mono font-black text-emerald-400 text-sm sm:text-base">
            16,9 %
          </div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold">
            ↑ 2,1 pts vs avril
          </div>
        </div>

        {/* Transactions */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="text-[10px] text-zinc-400">Transactions</div>
          <div className="mt-1 font-mono font-black text-white text-sm sm:text-base">
            86
          </div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold">
            ↑ 33,3% vs avril
          </div>
        </div>

        {/* Panier moyen */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm col-span-2 sm:col-span-1">
          <div className="text-[10px] text-zinc-400">Panier moyen</div>
          <div className="mt-1 font-mono font-black text-white text-sm sm:text-base">
            2 540 €
          </div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold">
            ↑ 4,7% vs avril
          </div>
        </div>
      </div>

      {/* 4 Charts Grid (Row 1) matching Reference #27 Screen 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <ReportsSalesProfitChart />
        <ReportsProfitDonut />

        {/* Top catégories de dépenses */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between h-[270px] shadow-sm">
          <div className="border-b border-[#202028] pb-2">
            <h3 className="text-xs font-bold text-white tracking-wide">
              Top catégories de dépenses
            </h3>
          </div>

          <div className="space-y-2 py-1 flex-1 flex flex-col justify-center text-[11px]">
            {EXPENSE_CATEGORIES.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between p-1.5 rounded-lg bg-[#16161c] border border-[#202028]">
                <span className="text-zinc-300 truncate pr-2">{cat.name}</span>
                <span className="font-mono font-bold text-red-400 shrink-0">{cat.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <ReportsComparisonBars />
      </div>

      {/* 5 Widgets Grid (Row 2) matching Reference #27 Screen 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <ReportsStockStatusDonut />

        {/* Rotation des stocks */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between h-[270px] shadow-sm text-center">
          <div className="border-b border-[#202028] pb-2 text-left">
            <h3 className="text-xs font-bold text-white tracking-wide">
              Rotation des stocks
            </h3>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 space-y-1">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-amber-500/30 bg-amber-500/10 shadow-inner">
              <span className="font-mono font-black text-amber-400 text-xl">45 <span className="text-xs font-normal">jours</span></span>
            </div>
            <div className="text-[10px] text-zinc-400 font-semibold">Durée moyenne</div>
            <div className="text-[9px] text-emerald-400 font-bold">↓ 8 jours vs avril</div>
          </div>
        </div>

        {/* Alertes stock */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between h-[270px] shadow-sm">
          <div className="border-b border-[#202028] pb-2">
            <h3 className="text-xs font-bold text-white tracking-wide">
              Alertes stock
            </h3>
          </div>

          <div className="space-y-2 py-2 flex-1 flex flex-col justify-center text-[11px]">
            <div className="flex items-start gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/30">
              <span className="h-2 w-2 rounded-full bg-red-500 mt-1 shrink-0" />
              <div className="text-[10px] text-zinc-200">
                <strong className="text-white">5 véhicules</strong> en dessous du stock minimum
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <span className="h-2 w-2 rounded-full bg-amber-500 mt-1 shrink-0" />
              <div className="text-[10px] text-zinc-200">
                <strong className="text-white">2 véhicules</strong> sans mouvement depuis 90 jours
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#202028]">
            <span className="text-[10px] text-red-400 hover:text-red-300 font-semibold cursor-pointer">
              Voir le rapport complet &rarr;
            </span>
          </div>
        </div>

        <ReportsCategorySalesDonut />

        {/* Ventes par marque */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between h-[270px] shadow-sm">
          <div className="border-b border-[#202028] pb-2">
            <h3 className="text-xs font-bold text-white tracking-wide">
              Ventes par marque
            </h3>
          </div>

          <div className="space-y-2 py-1 flex-1 flex flex-col justify-center">
            {BRAND_SALES.map((brand) => (
              <div key={brand.name} className="space-y-0.5 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-zinc-300">{brand.name}</span>
                  <span className="font-mono text-zinc-400 font-bold">{brand.percentage}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#1e1e24] overflow-hidden">
                  <div
                    className="h-full bg-red-600 rounded-full"
                    style={{ width: `${brand.percentage * 3}%` }}
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
