'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  FileText,
  CreditCard,
  Coins,
  Clock,
  ListOrdered,
  Filter,
  Download,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Mail,
  MoreVertical,
  Search,
} from 'lucide-react'

export interface InvoiceItem {
  id: string
  code: string
  clientName: string
  vehicleName: string
  issueDateFormatted: string
  dueDateFormatted: string
  totalTTC: number
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'DRAFT'
  paymentMethod: string
}

interface Props {
  invoices: InvoiceItem[]
}

export function InvoicesDashboardClient({ invoices }: Props) {
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredInvoices = invoices.filter((inv) => {
    if (statusFilter === 'PAID' && inv.status !== 'PAID') return false
    if (statusFilter === 'PENDING' && inv.status !== 'PENDING') return false
    if (statusFilter === 'OVERDUE' && inv.status !== 'OVERDUE') return false

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const match =
        inv.code.toLowerCase().includes(q) ||
        inv.clientName.toLowerCase().includes(q) ||
        inv.vehicleName.toLowerCase().includes(q)
      if (!match) return false
    }

    return true
  })

  return (
    <div className="space-y-4 text-xs text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Factures
          </h1>
          <p className="text-zinc-400 text-xs mt-0.5">
            Gérez toutes vos factures émises avec efficacité et simplicité.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/invoices/new"
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Créer une facture</span>
          </Link>
        </div>
      </div>

      {/* 5 Top KPI Cards matching Reference #13 Screen 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* KPI 1: Total facturé */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-medium leading-tight">Total facturé</span>
            <div className="flex h-6 w-6 items-center justify-center rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
              <FileText className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-lg font-black font-mono text-white">218 450 DH</div>
          <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-semibold">
            <ArrowUpRight className="h-2.5 w-2.5" />
            <span>18,7% ce mois</span>
          </div>
        </div>

        {/* KPI 2: Factures payées */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-medium leading-tight">Factures payées</span>
            <div className="flex h-6 w-6 items-center justify-center rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <CreditCard className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-lg font-black font-mono text-white">156 800 DH</div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
            <ArrowUpRight className="h-2.5 w-2.5" />
            <span>12,4% ce mois</span>
          </div>
        </div>

        {/* KPI 3: Factures en attente */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-medium leading-tight">Factures en attente</span>
            <div className="flex h-6 w-6 items-center justify-center rounded border border-amber-500/30 bg-amber-500/10 text-amber-400">
              <Coins className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-lg font-black font-mono text-white">42 350 DH</div>
          <div className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold">
            <ArrowDownRight className="h-2.5 w-2.5" />
            <span>3,6% ce mois</span>
          </div>
        </div>

        {/* KPI 4: Factures en retard */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-medium leading-tight">Factures en retard</span>
            <div className="flex h-6 w-6 items-center justify-center rounded border border-red-500/30 bg-red-500/10 text-red-400">
              <Clock className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-lg font-black font-mono text-white">19 300 DH</div>
          <div className="flex items-center gap-1 text-[10px] text-red-400 font-semibold">
            <ArrowDownRight className="h-2.5 w-2.5" />
            <span>4,2% ce mois</span>
          </div>
        </div>

        {/* KPI 5: Nombre de factures */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-medium leading-tight">Nombre de factures</span>
            <div className="flex h-6 w-6 items-center justify-center rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
              <ListOrdered className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-lg font-black font-mono text-white">48</div>
          <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-semibold">
            <ArrowUpRight className="h-2.5 w-2.5" />
            <span>8 ce mois</span>
          </div>
        </div>
      </div>

      {/* Main Container matching Reference #13 Screen 1 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3.5 shadow-xl">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#222228] pb-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
            >
              <option value="ALL">Tous les statuts ⌄</option>
              <option value="PAID">Payée</option>
              <option value="PENDING">En attente</option>
              <option value="OVERDUE">En retard</option>
            </select>

            <div className="rounded border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs text-zinc-300 font-mono">
              01/05/2025 – 31/05/2025
            </div>

            <select className="h-8 rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none">
              <option>Tous les types ⌄</option>
              <option>Vente véhicule</option>
              <option>Prestation atelier</option>
              <option>Acompte</option>
            </select>

            {/* Search Input */}
            <div className="relative flex items-center min-w-[240px]">
              <Search className="absolute left-2.5 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une facture, client, véhicule..."
                className="h-8 w-full rounded border border-[#282834] bg-[#18181f] pl-8 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
              />
            </div>
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
            <Link
              href="/invoices/new"
              className="flex h-8 items-center gap-1.5 rounded bg-red-600 px-3.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Créer une facture</span>
            </Link>
          </div>
        </div>

        {/* Data Table matching Reference #13 Screen 1 */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#222228] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Numéro</th>
                <th className="py-2.5 px-3">Client</th>
                <th className="py-2.5 px-3">Vente / Véhicule</th>
                <th className="py-2.5 px-3">Date facture</th>
                <th className="py-2.5 px-3">Échéance</th>
                <th className="py-2.5 px-3 text-right">Montant TTC</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3">Mode de paiement</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {filteredInvoices.map((inv, idx) => (
                <tr key={inv.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3 text-zinc-500 font-mono text-[11px]">{idx + 1}</td>
                  <td className="py-3 px-3">
                    <Link
                      href={`/invoices/${inv.code}`}
                      className="font-mono font-bold text-white hover:text-red-400 transition-colors"
                    >
                      {inv.code}
                    </Link>
                  </td>
                  <td className="py-3 px-3 font-medium text-white">{inv.clientName}</td>
                  <td className="py-3 px-3 text-zinc-300 font-medium">{inv.vehicleName}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">
                    {inv.issueDateFormatted}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">
                    {inv.dueDateFormatted}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-white">
                    {inv.totalTTC.toLocaleString('fr-MA', { minimumFractionDigits: 0 })} DH
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : inv.status === 'PENDING'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-red-500/15 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {inv.status === 'PAID'
                        ? 'Payée'
                        : inv.status === 'PENDING'
                        ? 'En attente'
                        : 'En retard'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-zinc-300">{inv.paymentMethod}</td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Link
                        href={`/invoices/${inv.code}`}
                        className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Voir détail"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/invoices/${inv.code}/history`}
                        className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Historique & Envoi"
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/invoices/${inv.code}/preview`}
                        className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Aperçu PDF"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Options"
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <span>10 par page ⌄</span>
          </div>

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
