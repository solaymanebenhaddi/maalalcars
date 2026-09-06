'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  CreditCard,
  ShoppingBag,
  FileText,
  Truck,
  Receipt,
  TrendingDown,
  Search,
  Plus,
  Eye,
  Edit2,
  Building,
  RotateCcw,
} from 'lucide-react'
import { PurchasesEvolutionChart } from './purchases-evolution-chart'
import { PurchasesCategoryDonut } from './purchases-category-donut'

interface PurchaseRow {
  id: number
  code: string
  date: string
  supplier: string
  category: string
  status: 'En cours' | 'Confirmé' | 'Réceptionné' | 'Facturé' | 'Annulé'
  statusColor: string
  receptionStatus: string
  invoiceStatus: string
  amountHT: string
  amountTTC: string
  createdBy: string
}

export function PurchasesDashboardClient() {
  const [search, setSearch] = useState('')

  const purchases: PurchaseRow[] = []
  const topSuppliers: Array<{ id: number; name: string; amount: string }> = []

  const filteredPurchases = purchases.filter(
    (p) =>
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.supplier.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Top Header matching Reference #23 Screen 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Achats — Liste / Tableau de bord
          </h1>
          <p className="text-xs text-zinc-400">
            Centralisez et maîtrisez vos achats, fournisseurs et dépenses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/purchases/new"
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Nouveau bon de commande</span>
          </Link>
        </div>
      </div>

      {/* 6 Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Dépenses totales */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Dépenses totales (HT)</span>
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-red-500/10 text-red-400">
              <CreditCard className="h-3 w-3" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-base sm:text-lg">
            248 750 €
          </div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold">
            ↑ 18,7% vs mois dernier
          </div>
        </div>

        {/* Commandes (ce mois) */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Commandes (ce mois)</span>
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400">
              <ShoppingBag className="h-3 w-3" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-base sm:text-lg">
            32
          </div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold">
            ↑ 10,3% vs mois dernier
          </div>
        </div>

        {/* Bons de commande */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Bons de commande</span>
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400">
              <FileText className="h-3 w-3" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-base sm:text-lg">
            28
          </div>
          <div className="mt-0.5 text-[9px] text-cyan-400 font-semibold">
            En cours
          </div>
        </div>

        {/* Réceptions (ce mois) */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Réceptions (ce mois)</span>
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400">
              <Truck className="h-3 w-3" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-emerald-400 text-base sm:text-lg">
            45
          </div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold">
            ↑ 12,5% vs mois dernier
          </div>
        </div>

        {/* Factures (ce mois) */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Factures (ce mois)</span>
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-purple-500/10 text-purple-400">
              <Receipt className="h-3 w-3" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-base sm:text-lg">
            38
          </div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold">
            ↑ 7,8% vs mois dernier
          </div>
        </div>

        {/* Économies (HT) */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span>Économies (HT)</span>
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400">
              <TrendingDown className="h-3 w-3" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-emerald-400 text-base sm:text-lg">
            12 840 €
          </div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold">
            ↑ 9,4% vs mois dernier
          </div>
        </div>
      </div>

      {/* 3 Middle Charts matching Reference #23 Screen 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <PurchasesEvolutionChart />
        <PurchasesCategoryDonut />

        {/* Top Fournisseurs */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between h-[280px] shadow-sm">
          <div className="flex items-center justify-between border-b border-[#202028] pb-2">
            <h3 className="text-xs font-bold text-white tracking-wide">
              Top fournisseurs (dépenses HT)
            </h3>
            <select className="h-6 rounded border border-[#282834] bg-[#18181f] px-2 text-[9px] text-zinc-400 focus:outline-none">
              <option>Mensuel</option>
              <option>Trimestriel</option>
              <option>Annuel</option>
            </select>
          </div>

          <div className="space-y-2 py-1">
            {topSuppliers.length === 0 && (
              <div className="py-4 text-center text-zinc-500 text-[10px]">Aucune donnée disponible</div>
            )}
            {topSuppliers.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-lg bg-[#16161c] px-3 py-1.5 border border-[#202028] hover:border-[#2e2e3a] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-zinc-500 text-[10px] font-bold w-3">{s.id}</span>
                  <Building className="h-3 w-3 text-zinc-400" />
                  <span className="font-bold text-white text-[11px]">{s.name}</span>
                </div>
                <span className="font-mono font-bold text-white text-xs">{s.amount}</span>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-right">
            <span className="text-red-400 hover:text-red-300 font-semibold cursor-pointer">
              Voir le rapport complet &rarr;
            </span>
          </div>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-white">Recherche avancée</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none">
            <option>Tous les fournisseurs</option>
            <option>Bosch Automotive</option>
            <option>Denso France</option>
            <option>Valeo Service</option>
          </select>

          <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none">
            <option>Tous les statuts</option>
            <option>En cours</option>
            <option>Confirmé</option>
            <option>Réceptionné</option>
            <option>Facturé</option>
          </select>

          <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none">
            <option>Toutes les catégories</option>
            <option>Pièces &amp; composants</option>
            <option>Consommables atelier</option>
            <option>Équipements</option>
          </select>

          <input
            type="text"
            defaultValue="01/05/2025"
            placeholder="Date du"
            className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs font-mono text-zinc-300 focus:outline-none"
          />

          <input
            type="text"
            defaultValue="31/05/2025"
            placeholder="Date au"
            className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs font-mono text-zinc-300 focus:outline-none"
          />

          <input
            type="text"
            placeholder="Montant min."
            className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs font-mono text-zinc-300 focus:outline-none"
          />

          <input
            type="text"
            placeholder="Montant max."
            className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs font-mono text-zinc-300 focus:outline-none"
          />

          <div className="flex items-center gap-1">
            <button className="h-8 flex-1 rounded-lg border border-[#282834] bg-[#18181f] text-xs text-zinc-300 hover:text-white flex items-center justify-center gap-1">
              <RotateCcw className="h-3 w-3" />
              <span>Réinitialiser</span>
            </button>
            <button className="h-8 flex-1 rounded-lg bg-red-600 text-xs font-bold text-white hover:bg-red-700">
              Rechercher
            </button>
          </div>
        </div>
      </div>

      {/* Main Purchases Table */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xs font-bold text-white">Liste des achats (32)</h2>

          <div className="relative">
            <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un bon de commande..."
              className="h-8 w-56 rounded-lg border border-[#282834] bg-[#18181f] pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* 5-row Purchases Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">N° Commande</th>
                <th className="py-2.5 px-3 font-mono">Date</th>
                <th className="py-2.5 px-3">Fournisseur</th>
                <th className="py-2.5 px-3">Catégorie</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3 text-center">Réception</th>
                <th className="py-2.5 px-3 text-center">Facture</th>
                <th className="py-2.5 px-3 text-right font-mono">Montant (HT)</th>
                <th className="py-2.5 px-3 text-right font-mono">Montant (TTC)</th>
                <th className="py-2.5 px-3">Créé par</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {filteredPurchases.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-zinc-500">Aucune donnée disponible</td>
                </tr>
              )}
              {filteredPurchases.map((p) => (
                <tr key={p.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3">
                    <Link
                      href={`/purchases/${p.code}`}
                      className="font-mono font-bold text-white hover:text-red-400 transition-colors"
                    >
                      {p.code}
                    </Link>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">{p.date}</td>
                  <td className="py-3 px-3 font-semibold text-white">{p.supplier}</td>
                  <td className="py-3 px-3 text-zinc-300">{p.category}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-bold ${p.statusColor}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {p.receptionStatus === '-' ? (
                      <span className="text-zinc-600">-</span>
                    ) : (
                      <Link
                        href={`/purchases/${p.code}/reception`}
                        className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold ${
                          p.receptionStatus === 'Complète'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        }`}
                      >
                        {p.receptionStatus}
                      </Link>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {p.invoiceStatus === '-' ? (
                      <span className="text-zinc-600">-</span>
                    ) : (
                      <Link
                        href={`/purchases/${p.code}/invoices`}
                        className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold ${
                          p.invoiceStatus === 'Payée'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {p.invoiceStatus}
                      </Link>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-white">{p.amountHT}</td>
                  <td className="py-3 px-3 text-right font-mono text-zinc-300">{p.amountTTC}</td>
                  <td className="py-3 px-3 text-zinc-400">{p.createdBy}</td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/purchases/${p.code}`}
                        className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Voir"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <button className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800" title="Modifier">
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 text-[11px] text-zinc-400">
          <span>Affichage 1 à 5 sur 32 résultats</span>
          <div className="flex items-center gap-1">
            <button className="flex h-6 w-6 items-center justify-center rounded bg-red-600 text-white font-bold text-xs">
              1
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              2
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              3
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              4
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              5
            </button>
            <span className="text-zinc-600 px-1">...</span>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
