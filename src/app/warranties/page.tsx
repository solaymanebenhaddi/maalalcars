'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  FileText,
  DollarSign,
  Clock,
  CheckCircle2,
  Plus,
  Search,
  Download,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
} from 'lucide-react'

interface WarrantyClaim {
  id: string
  code: string
  clientName: string
  vehicleName: string
  warrantyType: 'Garantie constructeur' | 'Extension garantie'
  claimIssue: string
  fileDate: string
  estimatedAmount: number
  status: 'En attente' | 'En cours' | 'Approuvé' | 'Rejeté'
  approvalProgress: number
}

const DEFAULT_CLAIMS: WarrantyClaim[] = [
  {
    id: '1',
    code: 'GAR-2025-0051',
    clientName: 'Imane Zahiri',
    vehicleName: 'Mercedes-Benz GLC',
    warrantyType: 'Garantie constructeur',
    claimIssue: 'Panne électronique',
    fileDate: '29/05/2025',
    estimatedAmount: 2450,
    status: 'En attente',
    approvalProgress: 25,
  },
  {
    id: '2',
    code: 'GAR-2025-0050',
    clientName: 'Omar Bennis',
    vehicleName: 'Toyota Land Cruiser',
    warrantyType: 'Extension garantie',
    claimIssue: 'Problème moteur',
    fileDate: '28/05/2025',
    estimatedAmount: 4800,
    status: 'En cours',
    approvalProgress: 50,
  },
  {
    id: '3',
    code: 'GAR-2025-0049',
    clientName: 'Sarah Benali',
    vehicleName: 'BMW X5',
    warrantyType: 'Garantie constructeur',
    claimIssue: 'Climatisation',
    fileDate: '27/05/2025',
    estimatedAmount: 1250,
    status: 'Approuvé',
    approvalProgress: 100,
  },
  {
    id: '4',
    code: 'GAR-2025-0048',
    clientName: 'Youssef El Idrissi',
    vehicleName: 'Audi Q7',
    warrantyType: 'Extension garantie',
    claimIssue: 'Suspension',
    fileDate: '26/05/2025',
    estimatedAmount: 3200,
    status: 'En attente',
    approvalProgress: 25,
  },
  {
    id: '5',
    code: 'GAR-2025-0047',
    clientName: 'Kanza Bennani',
    vehicleName: 'Range Rover Sport',
    warrantyType: 'Garantie constructeur',
    claimIssue: 'Système freinage',
    fileDate: '25/05/2025',
    estimatedAmount: 5600,
    status: 'En cours',
    approvalProgress: 75,
  },
  {
    id: '6',
    code: 'GAR-2025-0046',
    clientName: 'Mehdi Lahlou',
    vehicleName: 'Mercedes-Benz GLC',
    warrantyType: 'Extension garantie',
    claimIssue: 'Boîte de vitesses',
    fileDate: '24/05/2025',
    estimatedAmount: 4100,
    status: 'Rejeté',
    approvalProgress: 0,
  },
]

export default function WarrantiesDashboardPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tous')
  const [typeFilter, setTypeFilter] = useState('Tous')
  const [providerFilter, setProviderFilter] = useState('Tous')
  const [claims] = useState<WarrantyClaim[]>(DEFAULT_CLAIMS)

  const filtered = claims.filter((c) => {
    if (statusFilter !== 'Tous' && c.status !== statusFilter) return false
    if (typeFilter !== 'Tous' && c.warrantyType !== typeFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        c.code.toLowerCase().includes(q) ||
        c.clientName.toLowerCase().includes(q) ||
        c.vehicleName.toLowerCase().includes(q) ||
        c.claimIssue.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Header matching Reference #33 Screen 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
        <div>
          <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
            Tableau de bord garanties
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Vue d&apos;ensemble de vos garanties et sinistres
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#282834] bg-[#141418] text-xs text-zinc-300 font-mono">
            <span>01/05/2025 - 31/05/2025</span>
          </div>

          <Link
            href="/warranties/claims/new"
            className="flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>+ Déclarer une panne</span>
          </Link>

          <Link
            href="/warranties/new"
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Nouvelle garantie</span>
          </Link>
        </div>
      </div>

      {/* 5 KPI Cards matching Reference #33 Screen 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* KPI 1 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-semibold">Garanties actives</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="text-xl font-black font-mono text-white mt-1">126</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 12,4% ce mois</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-semibold">Dossiers sinistres</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <FileText className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="text-xl font-black font-mono text-amber-400 mt-1">48</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 8,2% ce mois</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-semibold">Montant sinistres (ce mois)</span>
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <DollarSign className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="text-xl font-black font-mono text-white mt-1">27 850 DH</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 3,6% ce mois</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-semibold">En attente d&apos;approbation</span>
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Clock className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="text-xl font-black font-mono text-purple-400 mt-1">16</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowDownRight className="h-3 w-3" />
            <span>- 2,1% ce mois</span>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-semibold">Taux d&apos;acceptation</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="text-xl font-black font-mono text-emerald-400 mt-1">78%</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 5,7% ce mois</span>
          </div>
        </div>
      </div>

      {/* Dossiers Section matching Reference #33 Screen 1 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Dossiers de garanties récents
          </h2>

          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <Download className="h-3.5 w-3.5 text-zinc-400" />
            <span>Exporter</span>
          </button>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un dossier, client, véhicule..."
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] pl-8 pr-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none"
            >
              <option value="Tous">Statut : Tous</option>
              <option value="En attente">En attente</option>
              <option value="En cours">En cours</option>
              <option value="Approuvé">Approuvé</option>
              <option value="Rejeté">Rejeté</option>
            </select>
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none"
            >
              <option value="Tous">Type : Tous</option>
              <option value="Garantie constructeur">Garantie constructeur</option>
              <option value="Extension garantie">Extension garantie</option>
            </select>
          </div>

          <div>
            <select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none"
            >
              <option value="Tous">Fournisseur : Tous</option>
              <option value="Toyota Maroc">Toyota Maroc</option>
              <option value="BMW Group">BMW Group</option>
              <option value="Auto Nejma">Auto Nejma</option>
            </select>
          </div>
        </div>

        {/* Claims Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Référence</th>
                <th className="py-2.5 px-3">Client</th>
                <th className="py-2.5 px-3">Véhicule</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Sinistre / Panne</th>
                <th className="py-2.5 px-3 font-mono">Date dossier</th>
                <th className="py-2.5 px-3 font-mono text-right">Montant estimé</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3 text-center">Approbation</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24] text-[11px]">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-white">
                    <Link href={`/warranties/${c.code}`} className="hover:text-red-400 hover:underline">
                      {c.code}
                    </Link>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-white">{c.clientName}</td>
                  <td className="py-2.5 px-3 text-zinc-300">{c.vehicleName}</td>
                  <td className="py-2.5 px-3 text-cyan-400 font-medium">{c.warrantyType}</td>
                  <td className="py-2.5 px-3 text-white">{c.claimIssue}</td>
                  <td className="py-2.5 px-3 font-mono text-zinc-400">{c.fileDate}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-right text-white">
                    {c.estimatedAmount.toLocaleString('fr-FR')} DH
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold ${
                        c.status === 'Approuvé'
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                          : c.status === 'En cours'
                          ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                          : c.status === 'Rejeté'
                          ? 'bg-red-500/15 border border-red-500/30 text-red-400'
                          : 'bg-zinc-500/15 border border-zinc-500/30 text-zinc-300'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-[#202028] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            c.approvalProgress === 100
                              ? 'bg-emerald-500'
                              : c.approvalProgress > 0
                              ? 'bg-amber-500'
                              : 'bg-zinc-700'
                          }`}
                          style={{ width: `${c.approvalProgress}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-zinc-400 w-7 text-right">
                        {c.approvalProgress}%
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Link
                        href={`/warranties/${c.code}`}
                        className="rounded p-1 text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800"
                        title="Voir détail dossier"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/warranties/${c.code}?tab=workflow`}
                        className="rounded p-1 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800"
                        title="Workflow d'approbation"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-[11px] text-zinc-400">
          <span>Affichage de 1 à {filtered.length} sur 126 dossiers</span>
          <div className="flex items-center gap-1">
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              &lt;
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
              21
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
