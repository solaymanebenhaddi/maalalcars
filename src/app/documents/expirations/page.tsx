import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  AlertTriangle,
  FileText,
  Car,
  Users,
  Search,
  Filter,
  Download,
  Eye,
  RefreshCw,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface ExpirationItem {
  id: number
  document: string
  associatedTo: string
  expirationDate: string
  daysRemaining: string
  status: 'Critique' | 'Attention'
}

const EXPIRATION_ALERTS: ExpirationItem[] = [
  { id: 1, document: 'Contrôle technique', associatedTo: 'Mercedes-Benz GLC 200', expirationDate: '24/05/2025', daysRemaining: '5 jours', status: 'Critique' },
  { id: 2, document: 'Contrat de garantie', associatedTo: 'BMW X5 xDrive30d 2021', expirationDate: '25/05/2025', daysRemaining: '6 jours', status: 'Critique' },
  { id: 3, document: 'Attestation d\'assurance', associatedTo: 'Toyota Land Cruiser 2023', expirationDate: '28/05/2025', daysRemaining: '9 jours', status: 'Attention' },
  { id: 4, document: 'Assurance', associatedTo: 'Audi Q7 45 TDI 2020', expirationDate: '29/05/2025', daysRemaining: '10 jours', status: 'Attention' },
  { id: 5, document: 'Carte grise', associatedTo: 'Hassan Amine', expirationDate: '30/05/2025', daysRemaining: '11 jours', status: 'Attention' },
  { id: 6, document: 'Permis de conduire', associatedTo: 'Sarah Benali', expirationDate: '30/05/2025', daysRemaining: '11 jours', status: 'Attention' },
]

export default function DocumentExpirationsPage() {
  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/documents"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour aux documents</span>
        </Link>
      </div>

      {/* Main Container matching Reference #17 Screen 5 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
            Alertes d&apos;expiration
          </h1>
          <p className="text-xs text-zinc-400">
            Suivi des documents arrivant à échéance et renouvellements urgents
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs">
          <button className="text-zinc-400 hover:text-white font-semibold">Vue d&apos;ensemble</button>
          <button className="font-bold text-white relative pb-1">
            <span>Expirés bientôt</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold">Expirés</button>
        </div>

        {/* 4 Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3.5">
            <div className="flex items-center justify-between text-zinc-400 text-[10px]">
              <span>Expirés bientôt</span>
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <div className="mt-2 font-mono font-black text-white text-lg sm:text-xl">
              37
            </div>
            <div className="mt-0.5 text-[10px] text-amber-400 font-semibold">
              Dans les 30 prochains jours
            </div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3.5">
            <div className="flex items-center justify-between text-zinc-400 text-[10px]">
              <span>Documents concernés</span>
              <FileText className="h-3.5 w-3.5 text-red-400" />
            </div>
            <div className="mt-2 font-mono font-black text-white text-lg sm:text-xl">
              25
            </div>
            <div className="mt-0.5 text-[10px] text-zinc-400">
              Documents uniques
            </div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3.5">
            <div className="flex items-center justify-between text-zinc-400 text-[10px]">
              <span>Véhicules concernés</span>
              <Car className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <div className="mt-2 font-mono font-black text-white text-lg sm:text-xl">
              18
            </div>
            <div className="mt-0.5 text-[10px] text-zinc-400">
              Véhicules
            </div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3.5">
            <div className="flex items-center justify-between text-zinc-400 text-[10px]">
              <span>Clients concernés</span>
              <Users className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="mt-2 font-mono font-black text-white text-lg sm:text-xl">
              12
            </div>
            <div className="mt-0.5 text-[10px] text-zinc-400">
              Clients
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <select className="h-9 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none">
              <option>Période: 30 prochains jours</option>
              <option>7 prochains jours</option>
              <option>60 prochains jours</option>
            </select>

            <select className="h-9 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none">
              <option>Type de document: Tous</option>
              <option>Assurance</option>
              <option>Technique</option>
              <option>Garantie</option>
            </select>

            <select className="h-9 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none">
              <option>Statut: Tous</option>
              <option>Critique</option>
              <option>Attention</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="h-9 w-44 rounded-lg border border-[#282834] bg-[#18181f] pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
              />
            </div>
            <button className="flex items-center gap-1 h-9 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-semibold text-zinc-300 hover:text-white">
              <Filter className="h-3.5 w-3.5" />
              <span>Filtres</span>
            </button>
          </div>
        </div>

        {/* Alert Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Document</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Associé à</th>
                <th className="py-2.5 px-3 font-mono">Expiration</th>
                <th className="py-2.5 px-3 font-mono">Jours restants</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {EXPIRATION_ALERTS.map((alert) => (
                <tr key={alert.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-red-500 shrink-0" />
                    <span>{alert.document}</span>
                  </td>
                  <td className="py-3 px-3 text-zinc-300">{alert.document}</td>
                  <td className="py-3 px-3 text-zinc-200 font-medium">{alert.associatedTo}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">{alert.expirationDate}</td>
                  <td className="py-3 px-3 font-mono font-bold text-white">{alert.daysRemaining}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold ${
                        alert.status === 'Critique'
                          ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      <AlertTriangle className="h-2.5 w-2.5" />
                      <span>{alert.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800" title="Télécharger">
                        <Download className="h-3.5 w-3.5" />
                      </button>
                      <Link href={`/documents/DOC-00${alert.id}`} className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800" title="Voir">
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <button className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800" title="Renouveler">
                        <RefreshCw className="h-3.5 w-3.5" />
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
          <span>Affichage 1 à 6 sur 37 alertes</span>
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
          </div>
        </div>
      </div>
    </div>
  )
}
