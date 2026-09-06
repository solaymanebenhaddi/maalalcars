'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Users,
  UserCheck,
  CreditCard,
  AlertCircle,
  Star,
  Plus,
  Download,
  Filter,
  Search,
  Eye,
  Edit2,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Truck,
} from 'lucide-react'
import { SuppliersSpendChart } from './suppliers-spend-chart'
import { SuppliersCategoryDonut } from './suppliers-category-donut'

interface SupplierRow {
  id: number
  code: string
  name: string
  category: string
  contact: string
  phone: string
  email: string
  totalPurchases: string
  amountDue: string
  rating: string
  status: 'Actif' | 'Inactif'
}

const SUPPLIERS: SupplierRow[] = [
  { id: 1, code: 'SUP-001', name: 'Bosch Automotive', category: 'Électronique', contact: 'Jean Dupont', phone: '+33 1 40 10 20 30', email: 'jean.dupont@bosch.com', totalPurchases: '198 450 €', amountDue: '12 450 €', rating: '4,6 ★', status: 'Actif' },
  { id: 2, code: 'SUP-002', name: 'Valeo France', category: 'Électronique', contact: 'Marie Leroy', phone: '+33 1 41 20 30 40', email: 'marie.leroy@valeo.com', totalPurchases: '165 300 €', amountDue: '8 950 €', rating: '4,3 ★', status: 'Actif' },
  { id: 3, code: 'SUP-003', name: 'SKF Automotive', category: 'Pièces mécaniques', contact: 'Lucas Bernard', phone: '+33 1 42 30 40 50', email: 'lucas.bernard@skf.com', totalPurchases: '142 800 €', amountDue: '11 200 €', rating: '4,4 ★', status: 'Actif' },
  { id: 4, code: 'SUP-004', name: 'Michelin', category: 'Pneumatiques', contact: 'Sophie Martin', phone: '+33 1 45 60 70 80', email: 'sophie.martin@michelin.com', totalPurchases: '128 750 €', amountDue: '6 400 €', rating: '4,1 ★', status: 'Actif' },
  { id: 5, code: 'SUP-005', name: 'Brembo S.p.A.', category: 'Freinage', contact: 'Alessandro R.', phone: '+39 035 60 50 111', email: 'alessandro.r@brembo.com', totalPurchases: '95 600 €', amountDue: '5 800 €', rating: '4,5 ★', status: 'Actif' },
  { id: 6, code: 'SUP-006', name: 'Mann+Hummel', category: 'Filtration', contact: 'Thomas Wagner', phone: '+49 711 123456', email: 'thomas.wagner@mann-hummel.com', totalPurchases: '78 300 €', amountDue: '3 150 €', rating: '4,0 ★', status: 'Actif' },
  { id: 7, code: 'SUP-007', name: 'Plastic Omnium', category: 'Carrosserie', contact: 'Nathalie Petit', phone: '+33 1 40 87 60 00', email: 'nathalie.petit@plasticomnium.com', totalPurchases: '68 400 €', amountDue: '7 100 €', rating: '4,2 ★', status: 'Actif' },
  { id: 8, code: 'SUP-008', name: 'Hella', category: 'Éclairage', contact: 'Christian Müller', phone: '+49 2941 38 0', email: 'christian.muller@hella.com', totalPurchases: '54 200 €', amountDue: '2 750 €', rating: '3,9 ★', status: 'Actif' },
  { id: 9, code: 'SUP-009', name: 'TotalEnergies Lub.', category: 'Lubrifiants', contact: 'Pierre Dubois', phone: '+33 1 47 44 45 46', email: 'pierre.dubois@totalenergies.com', totalPurchases: '48 900 €', amountDue: '4 600 €', rating: '4,3 ★', status: 'Actif' },
  { id: 10, code: 'SUP-010', name: 'NGK Spark Plug', category: 'Allumage', contact: 'Hiroshi Tanaka', phone: '+81 3 1234 5678', email: 'hiroshi.tanaka@ngkntk.jp', totalPurchases: '37 750 €', amountDue: '2 300 €', rating: '4,1 ★', status: 'Actif' },
]

const TOP_SUPPLIERS = [
  { id: 1, name: 'Bosch Automotive', amount: '198 450 €' },
  { id: 2, name: 'Valeo France', amount: '165 300 €' },
  { id: 3, name: 'SKF Automotive', amount: '142 800 €' },
  { id: 4, name: 'Michelin', amount: '128 750 €' },
  { id: 5, name: 'Brembo S.p.A.', amount: '95 600 €' },
]

export function SuppliersDashboardClient() {
  const [search, setSearch] = useState('')

  const filteredSuppliers = SUPPLIERS.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase()) ||
      s.contact.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Top Header matching Reference #19 Screen 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Fournisseurs — Tableau de bord
          </h1>
          <p className="text-xs text-zinc-400">
            Gestion des achats, commandes, pièces et évaluations fournisseurs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/suppliers/new"
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Nouveau fournisseur</span>
          </Link>
        </div>
      </div>

      {/* 5 KPI Cards matching Reference #19 Screen 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total fournisseurs */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Total fournisseurs</span>
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

        {/* Fournisseurs actifs */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Fournisseurs actifs</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <UserCheck className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-lg sm:text-xl">
            102
          </div>
          <div className="mt-1 text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="h-3 w-3" />
            <span>8 ce mois</span>
          </div>
        </div>

        {/* Achats cumulés (2025) */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Achats cumulés (2025)</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <CreditCard className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-base sm:text-lg">
            1 248 500 €
          </div>
          <div className="mt-1 text-[10px] text-cyan-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="h-3 w-3" />
            <span>15,4% ce mois</span>
          </div>
        </div>

        {/* Montants dus */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Montants dus</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
              <AlertCircle className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-red-400 text-base sm:text-lg">
            96 450 €
          </div>
          <div className="mt-1 text-[10px] text-red-400 flex items-center gap-1 font-semibold">
            <ArrowDownRight className="h-3 w-3" />
            <span>3,1% ce mois</span>
          </div>
        </div>

        {/* Performance moyenne */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Performance moyenne</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Star className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-amber-400 text-lg sm:text-xl">
            4,2 / 5
          </div>
          <div className="mt-1 text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="h-3 w-3" />
            <span>0,3% ce mois</span>
          </div>
        </div>
      </div>

      {/* 3 Middle Visualizations matching Reference #19 Screen 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <SuppliersSpendChart />
        <SuppliersCategoryDonut />

        {/* Top 5 fournisseurs (achats) */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between h-[280px] shadow-sm">
          <div className="flex items-center justify-between border-b border-[#202028] pb-2">
            <h3 className="text-xs font-bold text-white tracking-wide">
              Top 5 fournisseurs (achats)
            </h3>
            <span className="text-zinc-500 text-[10px]">Voir tout</span>
          </div>

          <div className="space-y-2 py-1">
            {TOP_SUPPLIERS.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-lg bg-[#16161c] px-3 py-2 border border-[#202028] hover:border-[#2e2e3a] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-zinc-500 text-[11px] font-bold w-3">
                    {s.id}
                  </span>
                  <Truck className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="font-bold text-white text-xs">{s.name}</span>
                </div>
                <span className="font-mono font-bold text-white text-xs">{s.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table Container matching Reference #19 Screen 1 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-sm space-y-3">
        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un fournisseur..."
              className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select className="h-9 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none">
              <option>Statut: Tous</option>
              <option>Actif</option>
              <option>Inactif</option>
            </select>

            <select className="h-9 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none">
              <option>Catégorie: Tous</option>
              <option>Électronique</option>
              <option>Pièces mécaniques</option>
              <option>Pneumatiques</option>
            </select>

            <button className="flex items-center gap-1.5 h-9 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-semibold text-zinc-300 hover:text-white">
              <Filter className="h-3.5 w-3.5 text-zinc-400" />
              <span>Filtres avancés</span>
            </button>

            <button className="flex items-center gap-1.5 h-9 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-semibold text-zinc-300 hover:text-white">
              <Download className="h-3.5 w-3.5 text-zinc-400" />
              <span>Exporter</span>
            </button>
          </div>
        </div>

        {/* 10-row Suppliers Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Fournisseur</th>
                <th className="py-2.5 px-3">Catégorie</th>
                <th className="py-2.5 px-3">Contact principal</th>
                <th className="py-2.5 px-3">Téléphone</th>
                <th className="py-2.5 px-3">Email</th>
                <th className="py-2.5 px-3 text-right">Achats cumulés (2025)</th>
                <th className="py-2.5 px-3 text-right">Montant dû</th>
                <th className="py-2.5 px-3 text-center">Performance</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {filteredSuppliers.map((s) => (
                <tr key={s.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3 text-zinc-500 font-mono text-[11px]">{s.id}</td>
                  <td className="py-3 px-3">
                    <Link
                      href={`/suppliers/${s.code}`}
                      className="font-bold text-white hover:text-red-400 transition-colors"
                    >
                      {s.name}
                    </Link>
                  </td>
                  <td className="py-3 px-3 text-zinc-300">{s.category}</td>
                  <td className="py-3 px-3 text-zinc-300">{s.contact}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">{s.phone}</td>
                  <td className="py-3 px-3 text-zinc-400">{s.email}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-white">{s.totalPurchases}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-red-400">{s.amountDue}</td>
                  <td className="py-3 px-3 text-center font-bold text-amber-400">{s.rating}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/suppliers/${s.code}`}
                        className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Voir détail"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Modifier"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Plus"
                      >
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
          <span>Affichage 1 à 10 sur 128 fournisseurs</span>
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
            <span className="text-zinc-600 px-1">...</span>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              13
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
