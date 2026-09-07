'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Printer,
  ArrowUpRight,
  TrendingDown,
  Car,
  ShieldCheck,
} from 'lucide-react'

interface RegistrationDossier {
  id: string
  code: string
  clientName: string
  clientPhone: string
  vehicleName: string
  immatriculationStatus: string
  dossierStatus: 'En attente' | 'En cours' | 'Prêt pour validation' | 'Validé'
  carteGriseStatus: string
  currentStep: string
  feeHt: number
  assignedAgent: string
  createdAt: string
}

const DEFAULT_DOSSIERS: RegistrationDossier[] = [
  {
    id: '1',
    code: 'IMM-2025-0056',
    clientName: 'Yassine Benali',
    clientPhone: '06 12 34 56 78',
    vehicleName: 'Toyota Land Cruiser VR-R 4.0L Essence',
    immatriculationStatus: 'En attente',
    dossierStatus: 'En attente',
    carteGriseStatus: 'Pré-dépôt',
    currentStep: 'Collecte des documents',
    feeHt: 950,
    assignedAgent: 'Imane Z.',
    createdAt: '15/05/2025',
  },
  {
    id: '2',
    code: 'IMM-2025-0055',
    clientName: 'Sarah El Amrani',
    clientPhone: '06 98 76 54 32',
    vehicleName: 'BMW X5 xDrive40d M Sport',
    immatriculationStatus: 'En cours',
    dossierStatus: 'En cours',
    carteGriseStatus: "En cours d'instruction",
    currentStep: 'Dossier en préfecture',
    feeHt: 880,
    assignedAgent: 'Omar B.',
    createdAt: '14/05/2025',
  },
  {
    id: '3',
    code: 'IMM-2025-0054',
    clientName: 'Mehdi Lahlou',
    clientPhone: '07 11 22 33 44',
    vehicleName: 'Mercedes-Benz GLC 220d 4MATIC',
    immatriculationStatus: 'En cours',
    dossierStatus: 'En cours',
    carteGriseStatus: 'Contrôle technique OK',
    currentStep: 'Attente édition CG',
    feeHt: 1200,
    assignedAgent: 'Karima D.',
    createdAt: '13/05/2025',
  },
  {
    id: '4',
    code: 'IMM-2025-0053',
    clientName: 'Imane Kabbaj',
    clientPhone: '06 77 88 99 00',
    vehicleName: 'Audi Q7 45 TDI Quattro',
    immatriculationStatus: 'Validée',
    dossierStatus: 'Prêt pour validation',
    carteGriseStatus: 'Validée',
    currentStep: 'Validation admin',
    feeHt: 950,
    assignedAgent: 'Youssef M.',
    createdAt: '12/05/2025',
  },
  {
    id: '5',
    code: 'IMM-2025-0052',
    clientName: 'Omar Tazi',
    clientPhone: '06 55 66 77 88',
    vehicleName: 'Range Rover Sport HSE D300',
    immatriculationStatus: 'Carte Grise émise',
    dossierStatus: 'Validé',
    carteGriseStatus: 'Carte Grise émise',
    currentStep: 'Remise client',
    feeHt: 1300,
    assignedAgent: 'Imane Z.',
    createdAt: '11/05/2025',
  },
  {
    id: '6',
    code: 'IMM-2025-0051',
    clientName: 'Salma Zahraoui',
    clientPhone: '06 33 44 55 66',
    vehicleName: 'Toyota Hilux 2.8 D-4D',
    immatriculationStatus: 'En attente',
    dossierStatus: 'En attente',
    carteGriseStatus: 'Pré-dépôt',
    currentStep: 'Collecte des documents',
    feeHt: 780,
    assignedAgent: 'Omar B.',
    createdAt: '10/05/2025',
  },
  {
    id: '7',
    code: 'IMM-2025-0050',
    clientName: 'Hassan Amine',
    clientPhone: '06 12 98 76 54',
    vehicleName: 'Peugeot 2008 1.5 BlueHDi',
    immatriculationStatus: 'En cours',
    dossierStatus: 'En cours',
    carteGriseStatus: "En cours d'instruction",
    currentStep: 'Dossier en préfecture',
    feeHt: 790,
    assignedAgent: 'Karima D.',
    createdAt: '09/05/2025',
  },
]

export default function RegistrationsDashboardPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tous')
  const [cgFilter, setCgFilter] = useState('Tous')
  const [agentFilter, setAgentFilter] = useState('Tous')
  const [dossiers] = useState<RegistrationDossier[]>(DEFAULT_DOSSIERS)

  const filtered = dossiers.filter((d) => {
    if (statusFilter !== 'Tous' && d.dossierStatus !== statusFilter) return false
    if (cgFilter !== 'Tous' && d.carteGriseStatus !== cgFilter) return false
    if (agentFilter !== 'Tous' && d.assignedAgent !== agentFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        d.code.toLowerCase().includes(q) ||
        d.clientName.toLowerCase().includes(q) ||
        d.vehicleName.toLowerCase().includes(q) ||
        d.currentStep.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Header matching Reference #35 Screen 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
        <div>
          <h1 className="text-base sm:text-lg font-black text-white tracking-tight uppercase">
            Immatriculations — Tableau de bord / Liste
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Vue d&apos;ensemble des dossiers en cours, statuts Carte Grise, étapes admin, frais et affectations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <Download className="h-3.5 w-3.5 text-zinc-400" />
            <span>Exporter</span>
          </button>

          <Link
            href="/registrations/new"
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Nouveau dossier</span>
          </Link>
        </div>
      </div>

      {/* 5 KPI Cards matching Reference #35 Screen 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* KPI 1 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-semibold">Dossiers en attente</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="text-xl font-black font-mono text-white mt-1">48</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 12 ce mois</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-semibold">Carte Grise en cours</span>
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Car className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="text-xl font-black font-mono text-white mt-1">32</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 8 ce mois</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-semibold">Prêts pour validation</span>
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <ShieldCheck className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="text-xl font-black font-mono text-purple-400 mt-1">16</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 4 ce mois</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-semibold">Dossiers terminés</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="text-xl font-black font-mono text-emerald-400 mt-1">128</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 23 ce mois</span>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-semibold">Frais à encaisser</span>
            <span className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
              <FileCheck2 className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="text-xl font-black font-mono text-white mt-1">27 450 DH</div>
          <div className="text-[10px] text-red-400 font-semibold flex items-center gap-0.5 mt-1">
            <TrendingDown className="h-3 w-3" />
            <span>- 5,4% ce mois</span>
          </div>
        </div>
      </div>

      {/* Filters Bar matching Reference #35 Screen 1 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5 items-center">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un dossier, client, véhicule, immatriculation..."
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] pl-8 pr-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none"
            >
              <option value="Tous">Statut dossier : Tous</option>
              <option value="En attente">En attente</option>
              <option value="En cours">En cours</option>
              <option value="Prêt pour validation">Prêt pour validation</option>
              <option value="Validé">Validé</option>
            </select>
          </div>

          <div>
            <select
              value={cgFilter}
              onChange={(e) => setCgFilter(e.target.value)}
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none"
            >
              <option value="Tous">Statut CG : Tous</option>
              <option value="Pré-dépôt">Pré-dépôt</option>
              <option value="En cours d'instruction">En cours d&apos;instruction</option>
              <option value="Contrôle technique OK">Contrôle technique OK</option>
              <option value="Validée">Validée</option>
              <option value="Carte Grise émise">Carte Grise émise</option>
            </select>
          </div>

          <div>
            <select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none"
            >
              <option value="Tous">Agent assigné : Tous</option>
              <option value="Imane Z.">Imane Z.</option>
              <option value="Omar B.">Omar B.</option>
              <option value="Karima D.">Karima D.</option>
              <option value="Youssef M.">Youssef M.</option>
            </select>
          </div>

          <div>
            <button className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] text-[11px] font-semibold text-zinc-300 hover:text-white flex items-center justify-center gap-1.5">
              <Filter className="h-3 w-3 text-zinc-400" />
              <span>Plus de filtres</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dossiers Table matching Reference #35 Screen 1 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">N° Dossier</th>
                <th className="py-2.5 px-3">Client</th>
                <th className="py-2.5 px-3">Véhicule</th>
                <th className="py-2.5 px-3">Statut dossier</th>
                <th className="py-2.5 px-3">Statut Carte Grise</th>
                <th className="py-2.5 px-3">Étape actuelle</th>
                <th className="py-2.5 px-3 font-mono text-right">Frais (HT)</th>
                <th className="py-2.5 px-3">Agent assigné</th>
                <th className="py-2.5 px-3 font-mono">Créé le</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24] text-[11px]">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-white">
                    <Link href={`/registrations/${d.code}`} className="hover:text-red-400 hover:underline">
                      {d.code}
                    </Link>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-white">{d.clientName}</div>
                    <div className="text-[10px] text-zinc-400">{d.clientPhone}</div>
                  </td>
                  <td className="py-2.5 px-3 text-zinc-200 font-medium">{d.vehicleName}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold ${
                        d.dossierStatus === 'Validé'
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                          : d.dossierStatus === 'En cours'
                          ? 'bg-blue-500/15 border border-blue-500/30 text-blue-400'
                          : d.dossierStatus === 'Prêt pour validation'
                          ? 'bg-purple-500/15 border border-purple-500/30 text-purple-400'
                          : 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                      }`}
                    >
                      {d.dossierStatus}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-zinc-300 font-medium text-[10px]">
                      {d.carteGriseStatus}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-cyan-400 font-medium text-[11px]">
                    {d.currentStep}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-white">
                    {d.feeHt.toLocaleString('fr-FR')} DH
                  </td>
                  <td className="py-2.5 px-3 text-zinc-300 font-semibold">{d.assignedAgent}</td>
                  <td className="py-2.5 px-3 font-mono text-zinc-400 text-[10px]">{d.createdAt}</td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Link
                        href={`/registrations/${d.code}`}
                        className="rounded p-1 text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800"
                        title="Consulter le dossier"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        onClick={() => alert(`Impression récépissé ${d.code}`)}
                        className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Imprimer le récépissé"
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination matching Reference #35 Screen 1 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-[11px] text-zinc-400">
          <span>Affichage de 1 à {filtered.length} sur 48 dossiers</span>
          <div className="flex items-center gap-2">
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
                &gt;
              </button>
            </div>
            <span className="text-zinc-500">10 par page</span>
          </div>
        </div>
      </div>
    </div>
  )
}
