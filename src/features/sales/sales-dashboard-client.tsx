'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Download,
  Search,
  Eye,
  Edit2,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Columns,
  RotateCcw,
} from 'lucide-react'

interface SaleRow {
  id: number
  reference: string
  date: string
  client: string
  vehicle: string
  status: 'Confirmée' | 'En négociation' | 'En attente paiement' | 'Livrée' | 'Annulée' | 'Nouvelles'
  amountTTC: string
  paymentStatus: string
  salesperson: string
  deliveryDate: string
}

export function SalesDashboardClient() {
  const [search, setSearch] = useState('')

  const sales: SaleRow[] = []

  const filteredSales = sales.filter(
    (s) =>
      s.reference.toLowerCase().includes(search.toLowerCase()) ||
      s.client.toLowerCase().includes(search.toLowerCase()) ||
      s.vehicle.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Top Header matching Reference #22 Screen 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Ventes — Tableau de bord
          </h1>
          <p className="text-xs text-zinc-400">
            Suivez, gérez et optimisez vos ventes en temps réel avec précision et efficacité.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/sales/new"
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Nouvelle vente</span>
          </Link>
        </div>
      </div>

      {/* Top 6 Stats Ribbon matching Reference #22 Screen 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] text-zinc-400">Chiffre d&apos;affaires (mois)</span>
          <div className="mt-1 font-mono font-black text-white text-base">218 450 €</div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold flex items-center gap-0.5">
            <ArrowUpRight className="h-2.5 w-2.5" />
            <span>10,7% vs mois dernier</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] text-zinc-400">Commandes (mois)</span>
          <div className="mt-1 font-mono font-black text-white text-base">62</div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold flex items-center gap-0.5">
            <ArrowUpRight className="h-2.5 w-2.5" />
            <span>12,4% vs mois dernier</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] text-zinc-400">Panier moyen</span>
          <div className="mt-1 font-mono font-black text-white text-base">3 523 €</div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold flex items-center gap-0.5">
            <ArrowUpRight className="h-2.5 w-2.5" />
            <span>9,8% vs mois dernier</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] text-zinc-400">Marge brute (mois)</span>
          <div className="mt-1 font-mono font-black text-white text-base">42 780 €</div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold flex items-center gap-0.5">
            <ArrowUpRight className="h-2.5 w-2.5" />
            <span>14,2% vs mois dernier</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] text-zinc-400">Taux de conversion</span>
          <div className="mt-1 font-mono font-black text-white text-base">28,6 %</div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold flex items-center gap-0.5">
            <ArrowUpRight className="h-2.5 w-2.5" />
            <span>5,2% vs mois dernier</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <span className="text-[10px] text-zinc-400">Ventes en attente</span>
          <div className="mt-1 font-mono font-black text-amber-400 text-base">15</div>
          <div className="mt-0.5 text-[9px] text-red-400 font-semibold flex items-center gap-0.5">
            <ArrowDownRight className="h-2.5 w-2.5" />
            <span>5 vs mois dernier</span>
          </div>
        </div>
      </div>

      {/* Aperçu des ventes (6 status boxes) matching Reference #22 Screen 1 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#202028] pb-2">
          <h3 className="text-xs font-bold text-white">Aperçu des ventes</h3>
          <select className="h-7 rounded border border-[#282834] bg-[#18181f] px-2 text-[10px] text-zinc-300 focus:outline-none">
            <option>Ce mois</option>
            <option>Ce trimestre</option>
            <option>Cette année</option>
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Nouvelles */}
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-zinc-400">Nouvelles</div>
              <div className="font-mono font-black text-white text-lg">12</div>
            </div>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              12
            </div>
          </div>

          {/* En négociation */}
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-zinc-400">En négociation</div>
              <div className="font-mono font-black text-amber-400 text-lg">18</div>
            </div>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              18
            </div>
          </div>

          {/* En attente paiement */}
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-zinc-400">En attente paiement</div>
              <div className="font-mono font-black text-amber-400 text-lg">8</div>
            </div>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              8
            </div>
          </div>

          {/* Confirmées */}
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-zinc-400">Confirmées</div>
              <div className="font-mono font-black text-emerald-400 text-lg">46</div>
            </div>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              46
            </div>
          </div>

          {/* Livrées */}
          <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-zinc-400">Livrées</div>
              <div className="font-mono font-black text-cyan-400 text-lg">32</div>
            </div>
            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
              32
            </div>
          </div>

          {/* Annulées */}
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-zinc-400">Annulées</div>
              <div className="font-mono font-black text-red-400 text-lg">6</div>
            </div>
            <div className="h-8 w-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center font-bold">
              6
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-white">Filtres avancés</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <input
            type="text"
            defaultValue="01/05/2025 → 31/05/2025"
            className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs font-mono text-zinc-300 focus:outline-none"
          />

          <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none">
            <option>Tous les statuts</option>
            <option>Confirmée</option>
            <option>En négociation</option>
            <option>En attente paiement</option>
            <option>Livrée</option>
          </select>

          <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none">
            <option>Tous les commerciaux</option>
            <option>Y. Benali</option>
            <option>A. Maalal</option>
          </select>

          <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none">
            <option>Toutes les sources</option>
            <option>Site web</option>
            <option>Showroom</option>
          </select>

          <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none">
            <option>Tous les paiements</option>
            <option>Payé</option>
            <option>Acompte</option>
            <option>En attente</option>
          </select>

          <div className="flex items-center gap-1">
            <button className="h-8 flex-1 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 hover:text-white flex items-center justify-center gap-1">
              <RotateCcw className="h-3 w-3" />
              <span>Réinitialiser</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Container matching Reference #22 Screen 1 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-sm space-y-3">
        {/* Table Top Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-bold text-white">Liste des ventes (62)</h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une vente, client, véhicule..."
                className="h-8 w-56 rounded-lg border border-[#282834] bg-[#18181f] pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <button className="flex items-center gap-1 h-8 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-semibold text-zinc-300 hover:text-white">
              <Download className="h-3.5 w-3.5 text-zinc-400" />
              <span>Exporter</span>
            </button>

            <button className="flex items-center gap-1 h-8 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-semibold text-zinc-300 hover:text-white">
              <Columns className="h-3.5 w-3.5 text-zinc-400" />
              <span>Colonnes</span>
            </button>
          </div>
        </div>

        {/* 5-row Sales Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Référence</th>
                <th className="py-2.5 px-3 font-mono">Date</th>
                <th className="py-2.5 px-3">Client</th>
                <th className="py-2.5 px-3">Véhicule</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3 text-right font-mono">Montant TTC</th>
                <th className="py-2.5 px-3">Paiement</th>
                <th className="py-2.5 px-3">Commercial</th>
                <th className="py-2.5 px-3 font-mono">Livraison</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-zinc-500">Aucune donnée disponible</td>
                </tr>
              )}
              {filteredSales.map((s) => (
                <tr key={s.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3 font-mono text-zinc-500 text-[11px]">{s.id}</td>
                  <td className="py-3 px-3">
                    <Link
                      href={`/sales/${s.reference}`}
                      className="font-mono font-bold text-white hover:text-red-400 transition-colors"
                    >
                      {s.reference}
                    </Link>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">{s.date}</td>
                  <td className="py-3 px-3 font-medium text-white">{s.client}</td>
                  <td className="py-3 px-3 text-zinc-300">{s.vehicle}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold ${
                        s.status === 'Confirmée'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : s.status === 'Livrée'
                          ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-white">{s.amountTTC}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold ${
                        s.paymentStatus === 'Payé'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {s.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-zinc-300">{s.salesperson}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">{s.deliveryDate}</td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/sales/${s.reference}`}
                        className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Voir"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <button className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800" title="Modifier">
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800" title="Plus">
                        <MoreHorizontal className="h-3.5 w-3.5" />
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
          <span>Affichage 1 à 10 sur 62 ventes</span>
          <div className="flex items-center gap-1">
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              ‹
            </button>
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
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              6
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              7
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
