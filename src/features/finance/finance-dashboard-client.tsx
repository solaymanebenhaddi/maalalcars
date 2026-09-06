'use client'

import React from 'react'
import Link from 'next/link'
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Car,
  Coins,
  Receipt,
  ShoppingBag,
  AlertTriangle,
  Filter,
} from 'lucide-react'
import { FinanceCashflowChart } from './finance-cashflow-chart'
import { FinanceCashInOutDonut } from './finance-cashin-out-donut'
import { FinanceStockCapitalDonut } from './finance-stock-capital-donut'

export function FinanceDashboardClient() {
  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Top Header matching Reference #23 Screen 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Vue financière — Tableau de bord
          </h1>
          <p className="text-xs text-zinc-400">
            Accueil &gt; Finance &gt; Tableau de bord
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none">
            <option>Ce mois</option>
            <option>Ce trimestre</option>
            <option>Cette année</option>
          </select>

          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <Filter className="h-3.5 w-3.5" />
            <span>Filtrer</span>
          </button>
        </div>
      </div>

      {/* Subpage Navigation Bar */}
      <div className="flex items-center gap-4 border-b border-[#222228] pb-2 text-xs overflow-x-auto">
        <Link href="/finance" className="font-bold text-white relative pb-1 shrink-0">
          <span>Vue financière</span>
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
        </Link>
        <Link href="/finance/cash-in" className="text-zinc-400 hover:text-white font-semibold shrink-0">
          Encaissements
        </Link>
        <Link href="/finance/cash-out" className="text-zinc-400 hover:text-white font-semibold shrink-0">
          Décaissements
        </Link>
        <Link href="/finance/pnl" className="text-zinc-400 hover:text-white font-semibold shrink-0">
          P&amp;L (Résultat)
        </Link>
        <Link href="/finance/stock-capital" className="text-zinc-400 hover:text-white font-semibold shrink-0">
          Capital du stock
        </Link>
        <Link href="/finance/transactions" className="text-zinc-400 hover:text-white font-semibold shrink-0">
          Transactions
        </Link>
      </div>

      {/* 8 KPI Cards (4 Top + 4 Bottom) matching Reference #23 Screen 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Trésorerie disponible */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Trésorerie disponible</span>
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400">
              <Wallet className="h-3 w-3" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-base sm:text-lg">
            182 450 DH
          </div>
          <div className="mt-0.5 text-[9px] text-cyan-400 font-semibold">
            ↑ 12,4% ce mois
          </div>
        </div>

        {/* Cash In */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Cash In (Encaissements)</span>
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400">
              <ArrowDownLeft className="h-3 w-3" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-base sm:text-lg">
            458 760 DH
          </div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold">
            ↑ 18,2% ce mois
          </div>
        </div>

        {/* Cash Out */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Cash Out (Décaissements)</span>
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-red-500/10 text-red-400">
              <ArrowUpRight className="h-3 w-3" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-red-400 text-base sm:text-lg">
            276 310 DH
          </div>
          <div className="mt-0.5 text-[9px] text-red-400 font-semibold">
            ↑ 9,6% ce mois
          </div>
        </div>

        {/* Bénéfice net */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Bénéfice net</span>
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="h-3 w-3" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-emerald-400 text-base sm:text-lg">
            126 280 DH
          </div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold">
            ↑ 15,7% ce mois
          </div>
        </div>

        {/* Capital immobilisé en stock */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Capital immobilisé en stock</span>
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-500/10 text-amber-400">
              <Car className="h-3 w-3" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-base sm:text-lg">
            1 248 500 DH
          </div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold">
            ↑ 5,4% ce mois
          </div>
        </div>

        {/* Créances à récupérer */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Créances à récupérer</span>
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-500/10 text-amber-400">
              <Coins className="h-3 w-3" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-amber-400 text-base sm:text-lg">
            96 450 DH
          </div>
          <div className="mt-0.5 text-[9px] text-red-400 font-semibold">
            ↓ 3,1% ce mois
          </div>
        </div>

        {/* Dépenses du mois */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Dépenses du mois</span>
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-red-500/10 text-red-400">
              <Receipt className="h-3 w-3" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-base sm:text-lg">
            183 950 DH
          </div>
          <div className="mt-0.5 text-[9px] text-red-400 font-semibold">
            ↑ 11,2% ce mois
          </div>
        </div>

        {/* Ventes du mois */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Ventes du mois</span>
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400">
              <ShoppingBag className="h-3 w-3" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-base sm:text-lg">
            865 200 DH
          </div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold">
            ↑ 17,8% ce mois
          </div>
        </div>
      </div>

      {/* 3 Middle Charts matching Reference #23 Screen 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <FinanceCashflowChart />
        <FinanceCashInOutDonut />
        <FinanceStockCapitalDonut />
      </div>

      {/* Bottom 3 Panels matching Reference #23 Screen 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Aperçu rapide */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between shadow-sm">
          <div className="border-b border-[#202028] pb-2">
            <h3 className="text-xs font-bold text-white tracking-wide">
              Aperçu rapide
            </h3>
          </div>

          <div className="space-y-2 py-2 text-[11px]">
            <div className="flex justify-between items-center text-zinc-400 text-[10px] font-semibold border-b border-[#202028] pb-1">
              <span>Indicateur</span>
              <span className="font-mono">Ce mois</span>
              <span className="font-mono">Mois dernier</span>
              <span className="font-mono">Évolution</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-zinc-300">Trésorerie disponible</span>
              <span className="font-mono font-bold text-white">182 450 DH</span>
              <span className="font-mono text-zinc-400">162 350 DH</span>
              <span className="font-mono text-emerald-400 font-bold">↑ 12,4%</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-zinc-300">Ventes</span>
              <span className="font-mono font-bold text-white">865 200 DH</span>
              <span className="font-mono text-zinc-400">733 650 DH</span>
              <span className="font-mono text-emerald-400 font-bold">↑ 17,8%</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-zinc-300">Dépenses</span>
              <span className="font-mono font-bold text-white">183 950 DH</span>
              <span className="font-mono text-zinc-400">165 450 DH</span>
              <span className="font-mono text-red-400 font-bold">↑ 11,2%</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-zinc-300">Bénéfice net</span>
              <span className="font-mono font-bold text-emerald-400">126 280 DH</span>
              <span className="font-mono text-zinc-400">109 800 DH</span>
              <span className="font-mono text-emerald-400 font-bold">↑ 15,7%</span>
            </div>
          </div>

          <div className="text-[10px] pt-1">
            <span className="text-red-400 hover:text-red-300 font-semibold cursor-pointer">
              Voir le rapport complet &rarr;
            </span>
          </div>
        </div>

        {/* Alertes financières */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between shadow-sm">
          <div className="border-b border-[#202028] pb-2">
            <h3 className="text-xs font-bold text-white tracking-wide">
              Alertes financières
            </h3>
          </div>

          <div className="space-y-2 py-1">
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#16161c] border border-[#22222c]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                <div>
                  <div className="font-bold text-white text-[11px]">3 factures en retard de paiement</div>
                  <div className="text-[9px] text-zinc-400">Montant total: 34 600 DH</div>
                </div>
              </div>
              <button className="rounded px-2 py-0.5 bg-[#202028] text-[10px] font-semibold text-zinc-300 hover:text-white">
                Voir
              </button>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-[#16161c] border border-[#22222c]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <div>
                  <div className="font-bold text-white text-[11px]">Stock élevé: Capital immobilisé important</div>
                  <div className="text-[9px] text-zinc-400">1 248 500 DH en stock</div>
                </div>
              </div>
              <button className="rounded px-2 py-0.5 bg-[#202028] text-[10px] font-semibold text-zinc-300 hover:text-white">
                Voir
              </button>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-[#16161c] border border-[#22222c]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <div>
                  <div className="font-bold text-white text-[11px]">5 dépenses inhabituelles détectées</div>
                  <div className="text-[9px] text-zinc-400">À vérifier dans les décaissements</div>
                </div>
              </div>
              <button className="rounded px-2 py-0.5 bg-[#202028] text-[10px] font-semibold text-zinc-300 hover:text-white">
                Voir
              </button>
            </div>
          </div>

          <div className="text-[10px] pt-1">
            <span className="text-red-400 hover:text-red-300 font-semibold cursor-pointer">
              Voir toutes les alertes &rarr;
            </span>
          </div>
        </div>

        {/* Objectifs financières */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between shadow-sm">
          <div className="border-b border-[#202028] pb-2">
            <h3 className="text-xs font-bold text-white tracking-wide">
              Objectifs financières
            </h3>
          </div>

          <div className="space-y-4 py-2 text-[11px]">
            {/* Objectif de bénéfice */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-300">Objectif de bénéfice mensuel</span>
                <span className="font-mono font-bold text-white">150 000 DH</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#202028] overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '84%' }} />
              </div>
              <div className="flex justify-between text-[9px] text-zinc-400">
                <span>126 280 DH / 150 000 DH</span>
                <span className="text-emerald-400 font-bold">84%</span>
              </div>
            </div>

            {/* Objectif de trésorerie */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-300">Objectif de trésorerie</span>
                <span className="font-mono font-bold text-white">200 000 DH</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#202028] overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: '91%' }} />
              </div>
              <div className="flex justify-between text-[9px] text-zinc-400">
                <span>182 450 DH / 200 000 DH</span>
                <span className="text-cyan-400 font-bold">91%</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] pt-1">
            <span className="text-red-400 hover:text-red-300 font-semibold cursor-pointer">
              Voir tous objectifs &rarr;
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
