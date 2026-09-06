'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Calculator,
  Plus,
  Search,
  RotateCcw,
  Eye,
  FileText,
  MoreVertical,
  Layers,
  Calendar,
} from 'lucide-react'
import { FinancingApprovalStepper } from './financing-approval-stepper'
import { FinancingSimulationsDonut } from './financing-simulations-donut'
import { Currency } from '@/components/shared/currency'

interface FinancingItem {
  id: string
  code: string
  partnerName: string
  requestedAmount: number
  downPayment: number
  durationMonths: number
  monthlyPayment: number
  interestRate: number
  status: string
  advisorName?: string | null
  vehicleModelName?: string | null
  registrationNumber?: string | null
  lastStep?: string | null
  notes?: string | null
  createdAt: string
  client?: {
    id: string
    firstName: string
    lastName: string
    phone: string
    email?: string | null
  } | null
  vehicle?: {
    id: string
    brand: string
    model: string
    year: number
    licensePlate: string
  } | null
}

interface Props {
  initialDossiers: FinancingItem[]
}

const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  SUBMITTED: { label: 'Soumis', class: 'bg-blue-500/15 text-blue-400 border border-blue-500/30' },
  IN_ANALYSIS: { label: 'En analyse', class: 'bg-amber-500/15 text-amber-400 border border-amber-500/30' },
  VERIFICATION: { label: 'Vérification', class: 'bg-purple-500/15 text-purple-400 border border-purple-500/30' },
  APPROVED: { label: 'Approbation', class: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
  CONTRACT: { label: 'Contrat', class: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' },
  DISBURSED: { label: 'Décaissé', class: 'bg-lime-500/15 text-lime-400 border border-lime-500/30' },
  REJECTED: { label: 'Refusé', class: 'bg-red-500/15 text-red-400 border border-red-500/30' },
}

export function FinancingDashboardClient({ initialDossiers }: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tous')
  const [partnerFilter, setPartnerFilter] = useState('Tous')
  const [advisorFilter, setAdvisorFilter] = useState('Tous')
  const [showFilters, setShowFilters] = useState(true)

  const filteredDossiers = initialDossiers.filter((d) => {
    if (statusFilter !== 'Tous' && d.status !== statusFilter) return false
    if (partnerFilter !== 'Tous' && d.partnerName !== partnerFilter) return false
    if (advisorFilter !== 'Tous' && d.advisorName !== advisorFilter) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const clientName = d.client ? `${d.client.firstName} ${d.client.lastName}`.toLowerCase() : ''
      const vehicleStr = (d.vehicleModelName || '').toLowerCase()
      const match =
        d.code.toLowerCase().includes(q) ||
        clientName.includes(q) ||
        vehicleStr.includes(q) ||
        (d.registrationNumber && d.registrationNumber.toLowerCase().includes(q))
      if (!match) return false
    }
    return true
  })

  const resetFilters = () => {
    setSearchQuery('')
    setStatusFilter('Tous')
    setPartnerFilter('Tous')
    setAdvisorFilter('Tous')
  }

  return (
    <div className="space-y-5 text-xs text-white">
      {/* Top Header matching Reference #09 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Aperçu financement
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Pilotage omnicanal des dossiers de crédit, LLD et accords partenaires financiers au Maroc
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            href="/financing/simulate"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <Calculator className="h-3.5 w-3.5 text-cyan-400" />
            <span>Simulateur</span>
          </Link>

          <Link
            href="/financing/pipeline"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <Layers className="h-3.5 w-3.5 text-purple-400" />
            <span>Suivi d’approbation</span>
          </Link>

          <Link
            href="/financing/new"
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Nouveau dossier</span>
          </Link>
        </div>
      </div>

      {/* 6 Top KPI Summary Cards matching Reference #09 Screen 0 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <span className="text-[11px] font-medium text-zinc-400 block">Dossiers en cours</span>
          <div className="text-2xl font-black text-white font-mono">128</div>
          <div className="text-[10px] font-semibold text-emerald-400">↗ 12,5% vs mois dernier</div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <span className="text-[11px] font-medium text-zinc-400 block">Montant financé (ce mois)</span>
          <div className="text-xl font-black text-white font-mono">2 458 500 DH</div>
          <div className="text-[10px] font-semibold text-emerald-400">↗ 18,7% vs mois dernier</div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <span className="text-[11px] font-medium text-zinc-400 block">Dossiers approuvés</span>
          <div className="text-2xl font-black text-white font-mono">86</div>
          <div className="text-[10px] font-semibold text-emerald-400">↗ 14,3% vs mois dernier</div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <span className="text-[11px] font-medium text-zinc-400 block">Taux d’approbation</span>
          <div className="text-2xl font-black text-white font-mono">67,2 %</div>
          <div className="text-[10px] font-semibold text-emerald-400">↗ 5,8 pts vs mois dernier</div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <span className="text-[11px] font-medium text-zinc-400 block">Montant moyen financé</span>
          <div className="text-xl font-black text-white font-mono">23 450 DH</div>
          <div className="text-[10px] font-semibold text-emerald-400">↗ 6,4% vs mois dernier</div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <span className="text-[11px] font-medium text-zinc-400 block">Dossiers en retard</span>
          <div className="text-2xl font-black text-white font-mono">14</div>
          <div className="text-[10px] font-semibold text-red-400">↘ -6,7% vs mois dernier</div>
        </div>
      </div>

      {/* Middle Row (3 Cards): Étapes d'approbation (5 cols), Résumé simulations (4 cols), Filtres avancés (3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Card 1: Étapes d'approbation */}
        <div className="lg:col-span-5 rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between">
          <div className="border-b border-[#222228] pb-2.5 mb-3">
            <h2 className="text-xs font-bold text-white">Étapes d’approbation</h2>
          </div>
          <FinancingApprovalStepper totalInCourse={128} />
        </div>

        {/* Card 2: Résumé des simulations (ce mois) */}
        <div className="lg:col-span-4 rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between">
          <div className="border-b border-[#222228] pb-2.5 mb-3">
            <h2 className="text-xs font-bold text-white">Résumé des simulations (ce mois)</h2>
          </div>
          <FinancingSimulationsDonut total={194} conversionRate="44,3%" />
        </div>

        {/* Card 3: Filtres avancés */}
        <div className="lg:col-span-3 rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#222228] pb-2.5">
            <h2 className="text-xs font-bold text-white">Filtres avancés</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-[10px] text-zinc-400 hover:text-white"
            >
              {showFilters ? 'Masquer' : 'Afficher'}
            </button>
          </div>

          {showFilters && (
            <div className="space-y-2.5">
              <div>
                <label className="block text-[10px] font-medium text-zinc-400 mb-1">Période</label>
                <div className="relative flex items-center">
                  <Calendar className="absolute left-2.5 h-3 w-3 text-zinc-500" />
                  <input
                    type="text"
                    defaultValue="01/05/2025 – 31/05/2025"
                    className="h-8 w-full rounded border border-[#282834] bg-[#18181f] pl-7 pr-2 text-[10px] text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-medium text-zinc-400 mb-1">Statut</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2 text-[10px] text-white focus:outline-none"
                  >
                    <option value="Tous">Tous les statuts</option>
                    <option value="SUBMITTED">Soumis</option>
                    <option value="IN_ANALYSIS">En analyse</option>
                    <option value="VERIFICATION">Vérification</option>
                    <option value="APPROVED">Approbation</option>
                    <option value="CONTRACT">Contrat</option>
                    <option value="DISBURSED">Décaissé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-zinc-400 mb-1">Partenaire</label>
                  <select
                    value={partnerFilter}
                    onChange={(e) => setPartnerFilter(e.target.value)}
                    className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2 text-[10px] text-white focus:outline-none"
                  >
                    <option value="Tous">Tous les partenaires</option>
                    <option value="CIM Finance">CIM Finance</option>
                    <option value="Wafasalaf">Wafasalaf</option>
                    <option value="Eqdom">Eqdom</option>
                    <option value="Saham Assurance">Saham Assurance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-zinc-400 mb-1">Conseiller</label>
                <select
                  value={advisorFilter}
                  onChange={(e) => setAdvisorFilter(e.target.value)}
                  className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2 text-[10px] text-white focus:outline-none"
                >
                  <option value="Tous">Tous les conseillers</option>
                  <option value="Adel M.">Adel M.</option>
                  <option value="Yassine B.">Yassine B.</option>
                  <option value="Sara M.">Sara M.</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={resetFilters}
                  className="h-8 px-2.5 rounded border border-[#282834] bg-[#18181f] text-[10px] font-semibold text-zinc-300 hover:text-white flex items-center justify-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Réinitialiser</span>
                </button>
                <button className="h-8 flex-1 rounded bg-red-600 text-[10px] font-bold text-white shadow-md hover:bg-red-500">
                  Appliquer les filtres
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Dossiers de financement Table matching Reference #09 Screen 0 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3">
        {/* Table Search & Quick Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
          <div className="relative flex items-center flex-1 max-w-md">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Rechercher un dossier, client, téléphone, immatriculation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-full rounded border border-[#282834] bg-[#18181f] pl-8 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span>Filtres rapides ⌄</span>
            <span className="text-zinc-600">|</span>
            <span>Total : <strong className="text-white font-mono">{filteredDossiers.length}</strong> dossiers</span>
          </div>
        </div>

        {/* Table Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#222228] text-[10px] font-semibold text-zinc-400">
                <th className="pb-2.5">N° Dossier</th>
                <th className="pb-2.5">Client</th>
                <th className="pb-2.5">Véhicule</th>
                <th className="pb-2.5 text-right">Montant demandé</th>
                <th className="pb-2.5 text-right">Apport</th>
                <th className="pb-2.5 text-center">Durée</th>
                <th className="pb-2.5 text-center">Statut</th>
                <th className="pb-2.5">Partenaire</th>
                <th className="pb-2.5">Conseiller</th>
                <th className="pb-2.5">Dernière étape</th>
                <th className="pb-2.5 text-right">MAJ</th>
                <th className="pb-2.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {filteredDossiers.map((d) => {
                const statusMeta = STATUS_CONFIG[d.status] || STATUS_CONFIG.SUBMITTED
                const clientName = d.client ? `${d.client.firstName} ${d.client.lastName}` : 'Client'
                const vehicleName = d.vehicleModelName || (d.vehicle ? `${d.vehicle.brand} ${d.vehicle.model}` : 'BMW X3 xDrive20d 2022')

                return (
                  <tr key={d.id} className="hover:bg-[#18181f] transition-colors group">
                    <td className="py-3 font-mono font-bold text-white">
                      <Link href={`/financing/${d.id}`} className="hover:text-cyan-400">
                        {d.code}
                      </Link>
                    </td>
                    <td className="py-3 font-semibold text-white">
                      <Link href={`/financing/${d.id}`} className="hover:text-red-400">
                        {clientName}
                      </Link>
                    </td>
                    <td className="py-3 text-zinc-300">
                      <span>{vehicleName}</span>
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-white">
                      <Currency amount={d.requestedAmount} />
                    </td>
                    <td className="py-3 text-right font-mono text-zinc-300">
                      <Currency amount={d.downPayment} />
                    </td>
                    <td className="py-3 text-center font-mono text-zinc-300">
                      {d.durationMonths} mois
                    </td>
                    <td className="py-3 text-center">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${statusMeta.class}`}>
                        {statusMeta.label}
                      </span>
                    </td>
                    <td className="py-3 text-zinc-200 font-medium">
                      {d.partnerName}
                    </td>
                    <td className="py-3 text-zinc-400 text-[11px]">
                      {d.advisorName || 'Adel M.'}
                    </td>
                    <td className="py-3 text-zinc-300 text-[11px]">
                      {d.lastStep || 'Analyse crédit'}
                    </td>
                    <td className="py-3 text-right text-zinc-400 font-mono text-[11px]">
                      {new Date(d.createdAt).toLocaleDateString('fr-MA')}
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-zinc-400">
                        <Link
                          href={`/financing/${d.id}`}
                          className="p-1 rounded hover:bg-[#22222a] hover:text-white"
                          title="Consulter"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                        <button className="p-1 rounded hover:bg-[#22222a] hover:text-white" title="Documents">
                          <FileText className="h-3.5 w-3.5" />
                        </button>
                        <button className="p-1 rounded hover:bg-[#22222a] hover:text-white" title="Options">
                          <MoreVertical className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
