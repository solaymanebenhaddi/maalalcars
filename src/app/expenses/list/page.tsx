'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Filter,
  Download,
  Plus,
  Pencil,
  Eye,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'

interface ExpenseRow {
  id: string
  code: string
  date: string
  label: string
  category: string
  supplier: string
  vehicle: string
  amountTTC: number
  status: 'PAID' | 'PENDING'
}

const ALL_EXPENSES: ExpenseRow[] = [
  { id: '1', code: 'D-2025-0052', date: '30/05/2025', label: 'Plein carburant', category: 'Transport', supplier: 'TotalEnergies', vehicle: 'Toyota Land Cruiser', amountTTC: 85.0, status: 'PAID' },
  { id: '2', code: 'D-2025-0051', date: '29/05/2025', label: 'Préparation esthétique', category: 'Préparation', supplier: 'Auto Clean Pro', vehicle: 'BMW X5', amountTTC: 450.0, status: 'PAID' },
  { id: '3', code: 'D-2025-0050', date: '28/05/2025', label: 'Révision complète', category: 'Atelier', supplier: 'Garage Premium', vehicle: 'Mercedes GLC', amountTTC: 780.0, status: 'PAID' },
  { id: '4', code: 'D-2025-0049', date: '27/05/2025', label: 'Campagne Facebook', category: 'Marketing', supplier: 'Meta Ads', vehicle: '—', amountTTC: 320.0, status: 'PENDING' },
  { id: '5', code: 'D-2025-0048', date: '26/05/2025', label: 'Frais bancaires', category: 'Administratif', supplier: 'Banque MAALAL', vehicle: '—', amountTTC: 45.0, status: 'PAID' },
  { id: '6', code: 'D-2025-0047', date: '25/05/2025', label: 'Assurance', category: 'Administratif', supplier: 'AXA', vehicle: 'Audi Q7', amountTTC: 620.0, status: 'PAID' },
  { id: '7', code: 'D-2025-0046', date: '24/05/2025', label: 'Pièces de rechange', category: 'Atelier', supplier: 'Auto Parts Plus', vehicle: 'Mercedes GLC', amountTTC: 260.0, status: 'PAID' },
  { id: '8', code: 'D-2025-0045', date: '23/05/2025', label: 'Lavage pro & detailing', category: 'Préparation', supplier: 'Clean Car', vehicle: '—', amountTTC: 120.0, status: 'PAID' },
  { id: '9', code: 'D-2025-0044', date: '22/05/2025', label: 'Affiches publicitaires', category: 'Marketing', supplier: 'PrintPro', vehicle: '—', amountTTC: 210.0, status: 'PAID' },
  { id: '10', code: 'D-2025-0043', date: '21/05/2025', label: 'Abonnement logiciel', category: 'Administratif', supplier: 'Odoo', vehicle: '—', amountTTC: 25.0, status: 'PAID' },
]

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Transport: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  Préparation: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
  Atelier: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  Marketing: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  Administratif: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  Autres: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' },
}

export default function ExpensesListPage() {
  const [selectedCategory, setSelectedCategory] = useState('Toutes')
  const [selectedStatus, setSelectedStatus] = useState('Tous')
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = ALL_EXPENSES.filter((e) => {
    if (selectedCategory !== 'Toutes' && e.category !== selectedCategory) return false
    if (selectedStatus !== 'Tous') {
      if (selectedStatus === 'Payée' && e.status !== 'PAID') return false
      if (selectedStatus === 'En attente' && e.status !== 'PENDING') return false
    }
    return true
  })

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      <PageHeader
        title="Toutes les dépenses"
        subtitle="Historique complet et filtrable de l'ensemble des frais engagés."
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Dépenses', href: '/expenses' },
          { label: 'Toutes les dépenses' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/expenses"
              className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Retour tableau de bord</span>
            </Link>
            <Link
              href="/expenses/new"
              className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Nouvelle dépense</span>
            </Link>
          </div>
        }
      />

      {/* Main Container matching Reference #12 Screen 2 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-4 shadow-xl">
        {/* Multi-criteria Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#222228] pb-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs text-zinc-300 font-mono">
              01/05/2025 - 31/05/2025
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-8 rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
            >
              <option value="Toutes">Toutes les catégories ⌄</option>
              <option value="Transport">Transport</option>
              <option value="Préparation">Préparation</option>
              <option value="Atelier">Atelier</option>
              <option value="Marketing">Marketing</option>
              <option value="Administratif">Administratif</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-8 rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
            >
              <option value="Tous">Tous les statuts ⌄</option>
              <option value="Payée">Payée</option>
              <option value="En attente">En attente</option>
            </select>

            <select className="h-8 rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none">
              <option>Tous les fournisseurs ⌄</option>
              <option>TotalEnergies</option>
              <option>Auto Clean Pro</option>
              <option>Garage Premium</option>
              <option>Meta Ads</option>
              <option>AXA</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex h-8 items-center gap-1.5 rounded border border-[#282834] bg-[#18181f] px-3 text-xs font-semibold text-zinc-300 hover:text-white">
              <Filter className="h-3.5 w-3.5 text-zinc-400" />
              <span>Filtres</span>
            </button>
            <button className="flex h-8 items-center gap-1.5 rounded border border-[#282834] bg-[#18181f] px-3 text-xs font-semibold text-zinc-300 hover:text-white">
              <Download className="h-3.5 w-3.5 text-zinc-400" />
              <span>Exporter</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#222228] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Réf. Dépense</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Libellé</th>
                <th className="py-2.5 px-3">Catégorie</th>
                <th className="py-2.5 px-3">Fournisseur</th>
                <th className="py-2.5 px-3">Véhicule / Projet</th>
                <th className="py-2.5 px-3 text-right">Montant TTC</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {filtered.map((r, idx) => {
                const catStyle =
                  CATEGORY_COLORS[r.category] || CATEGORY_COLORS['Autres']
                return (
                  <tr key={r.id} className="hover:bg-[#18181f] transition-colors">
                    <td className="py-2.5 px-3 text-zinc-500 font-mono text-[11px]">{idx + 1}</td>
                    <td className="py-2.5 px-3">
                      <Link
                        href={`/expenses/${r.code}`}
                        className="font-mono font-bold text-white hover:text-red-400 transition-colors"
                      >
                        {r.code}
                      </Link>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-400">{r.date}</td>
                    <td className="py-2.5 px-3 font-medium text-white">{r.label}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                      >
                        {r.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-zinc-300">{r.supplier}</td>
                    <td className="py-2.5 px-3 text-zinc-300 font-medium">{r.vehicle}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-white">
                      {r.amountTTC.toLocaleString('fr-MA', { minimumFractionDigits: 2 })} DH
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold ${
                          r.status === 'PAID'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {r.status === 'PAID' ? 'Payée' : 'En attente'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          href={`/expenses/${r.code}`}
                          className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                          title="Voir détail"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                        <Link
                          href={`/expenses/${r.code}`}
                          className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                          title="Modifier"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination matching Reference #12 Screen 2 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-[11px] text-zinc-400">
          <div>Afficher 1 à {filtered.length} sur 52 dépenses</div>

          <div className="flex items-center gap-1">
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              ‹
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${
                  currentPage === page
                    ? 'bg-red-600 text-white shadow'
                    : 'border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white'
                }`}
              >
                {page}
              </button>
            ))}
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
