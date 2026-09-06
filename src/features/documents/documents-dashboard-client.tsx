'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  FileText,
  HardDrive,
  AlertTriangle,
  Clock,
  Share2,
  Trash2,
  Plus,
  Filter,
  Search,
  Download,
  Eye,
  MoreHorizontal,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react'

interface DocumentItem {
  id: number
  code: string
  name: string
  type: string
  reference: string
  associatedTo: string
  category: string
  addedDate: string
  expirationDate: string
  status: 'Valide' | 'Expire bientôt' | 'Expiré'
  size: string
}

const DOCUMENTS: DocumentItem[] = [
  { id: 1, code: 'DOC-001', name: 'Contrat de vente', type: 'Ventes', reference: 'CONTR-2025-045', associatedTo: 'Toyota Land Cruiser 2023', category: 'Ventes', addedDate: '30/05/2025', expirationDate: '-', status: 'Valide', size: '245 KB' },
  { id: 2, code: 'DOC-002', name: 'Carte grise', type: 'Administratif', reference: 'CG-2025-01245', associatedTo: 'BMW X5 xDrive30d 2021', category: 'Administratif', addedDate: '29/05/2025', expirationDate: '-', status: 'Valide', size: '128 KB' },
  { id: 3, code: 'DOC-003', name: 'Attestation d\'assurance', type: 'Assurance', reference: 'ASS-2025-078', associatedTo: 'Mercedes-Benz GLC 200', category: 'Assurance', addedDate: '28/05/2025', expirationDate: '28/05/2026', status: 'Valide', size: '312 KB' },
  { id: 4, code: 'DOC-004', name: 'Facture achat', type: 'Achats', reference: 'FAC-ACH-2025-032', associatedTo: 'Audi Q7 45 TDI 2020', category: 'Achats', addedDate: '27/05/2025', expirationDate: '-', status: 'Valide', size: '512 KB' },
  { id: 5, code: 'DOC-005', name: 'Bon de livraison', type: 'Livraison', reference: 'BL-2025-091', associatedTo: 'Toyota Land Cruiser 2023', category: 'Livraison', addedDate: '26/05/2025', expirationDate: '-', status: 'Valide', size: '164 KB' },
  { id: 6, code: 'DOC-006', name: 'Contrat de garantie', type: 'Garantie', reference: 'GAR-2025-056', associatedTo: 'BMW X5 xDrive30d 2021', category: 'Garantie', addedDate: '25/05/2025', expirationDate: '25/05/2026', status: 'Expire bientôt', size: '298 KB' },
  { id: 7, code: 'DOC-007', name: 'Contrôle technique', type: 'Technique', reference: 'CT-2025-00456', associatedTo: 'Mercedes-Benz GLC 200', category: 'Technique', addedDate: '24/05/2025', expirationDate: '24/05/2026', status: 'Expire bientôt', size: '216 KB' },
  { id: 8, code: 'DOC-008', name: 'Pièce d\'identité client', type: 'Clients', reference: 'ID-CLIENT-089', associatedTo: 'Hassan Amine', category: 'Clients', addedDate: '23/05/2025', expirationDate: '-', status: 'Valide', size: '98 KB' },
]

export function DocumentsDashboardClient() {
  const [search, setSearch] = useState('')

  const filteredDocs = DOCUMENTS.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.reference.toLowerCase().includes(search.toLowerCase()) ||
      d.associatedTo.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Top Header matching Reference #17 Screen 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Centre de documents
          </h1>
          <p className="text-xs text-zinc-400">
            Gérez, organisez et sécurisez tous vos documents au même endroit
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/documents/expirations"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
            <span>Alertes d&apos;expiration</span>
          </Link>

          <Link
            href="/documents/upload"
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Nouveau document</span>
          </Link>
        </div>
      </div>

      {/* 6 KPI Cards matching Reference #17 Screen 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total documents */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Total documents</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <FileText className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-lg sm:text-xl">
            1 248
          </div>
          <div className="mt-1 text-[10px] text-cyan-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="h-3 w-3" />
            <span>12 ce mois</span>
          </div>
        </div>

        {/* Stockage utilisé */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Stockage utilisé</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <HardDrive className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-sm sm:text-base truncate">
            18.4 <span className="text-xs text-zinc-400 font-normal">GB / 100 GB</span>
          </div>
          <div className="mt-1 w-full bg-[#1e1e26] rounded-full h-1.5 overflow-hidden">
            <div className="bg-cyan-400 h-full rounded-full" style={{ width: '18.4%' }} />
          </div>
        </div>

        {/* Documents expirés */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Documents expirés</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
              <AlertTriangle className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-lg sm:text-xl">
            24
          </div>
          <div className="mt-1 text-[10px] text-red-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="h-3 w-3" />
            <span>3 ce mois</span>
          </div>
        </div>

        {/* Expirés bientôt */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Expirés bientôt</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-lg sm:text-xl">
            37
          </div>
          <div className="mt-1 text-[10px] text-amber-400 font-semibold truncate">
            Dans les 30 jours
          </div>
        </div>

        {/* Documents partagés */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Documents partagés</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Share2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-lg sm:text-xl">
            128
          </div>
          <div className="mt-1 text-[10px] text-emerald-400 font-semibold truncate">
            Partagés (18 users)
          </div>
        </div>

        {/* Corbeille */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-[11px]">
            <span>Corbeille</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-700/40 text-zinc-400">
              <Trash2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 font-mono font-black text-white text-lg sm:text-xl">
            15
          </div>
          <div className="mt-1 text-[10px] text-zinc-500 font-semibold truncate">
            Docs supprimés
          </div>
        </div>
      </div>

      {/* Main Table Container matching Reference #17 Screen 1 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-sm space-y-3">
        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un document, type, référence..."
              className="h-9 w-full rounded-lg border border-[#282834] bg-[#18181f] pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select className="h-9 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none">
              <option>Type de document: Tous</option>
              <option>Ventes</option>
              <option>Administratif</option>
              <option>Assurance</option>
              <option>Achats</option>
            </select>

            <select className="h-9 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none">
              <option>Catégorie: Toutes</option>
              <option>Véhicules</option>
              <option>Clients</option>
              <option>Contrats</option>
            </select>

            <select className="h-9 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none">
              <option>Statut: Tous</option>
              <option>Valide</option>
              <option>Expire bientôt</option>
              <option>Expiré</option>
            </select>

            <button className="flex items-center gap-1.5 h-9 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs font-semibold text-zinc-300 hover:text-white">
              <Filter className="h-3.5 w-3.5 text-zinc-400" />
              <span>Filtres</span>
            </button>
          </div>
        </div>

        {/* 8-row Documents Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Nom du document</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Référence</th>
                <th className="py-2.5 px-3">Associé à</th>
                <th className="py-2.5 px-3">Catégorie</th>
                <th className="py-2.5 px-3 font-mono">Date d&apos;ajout</th>
                <th className="py-2.5 px-3 font-mono">Expiration</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3 text-right">Taille</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3">
                    <Link
                      href={`/documents/${doc.code}`}
                      className="font-bold text-white hover:text-red-400 transition-colors flex items-center gap-2"
                    >
                      <FileText className="h-3.5 w-3.5 text-red-500 shrink-0" />
                      <span>{doc.name}</span>
                    </Link>
                  </td>
                  <td className="py-3 px-3 text-zinc-300">{doc.type}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">{doc.reference}</td>
                  <td className="py-3 px-3 text-zinc-200 font-medium">{doc.associatedTo}</td>
                  <td className="py-3 px-3 text-zinc-400">{doc.category}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">{doc.addedDate}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">{doc.expirationDate}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold ${
                        doc.status === 'Valide'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      <ShieldCheck className="h-2.5 w-2.5" />
                      <span>{doc.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-zinc-400">{doc.size}</td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Télécharger"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                      <Link
                        href={`/documents/${doc.code}`}
                        className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Voir détail"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
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
          <span>Affichage 1 à 8 sur 1 248 documents</span>
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
            <span className="text-zinc-600 px-1">...</span>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              125
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
