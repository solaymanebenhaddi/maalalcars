'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Plus,
  Eye,
  FileText,
  Clock,
} from 'lucide-react'

interface ContractRow {
  id: number
  reference: string
  title: string
  party: string
  type: string
  status: 'Actif' | 'En négociation' | 'Expire bientôt' | 'Résilié'
  statusColor: string
  startDate: string
  endDate: string
  amountHT: string
}

const CONTRACTS: ContractRow[] = [
  { id: 1, reference: 'CTR-2025-00128', title: 'Contrat de maintenance flotte', party: 'Groupe TransLog', type: 'Maintenance', status: 'Actif', statusColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', startDate: '01/05/2025', endDate: '30/04/2026', amountHT: '48 500,00 €' },
  { id: 2, reference: 'CTR-2025-00127', title: 'Contrat de fourniture pièces', party: 'Auto Partenaire SARL', type: 'Fourniture', status: 'Actif', statusColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', startDate: '10/04/2025', endDate: '09/04/2026', amountHT: '125 000,00 €' },
  { id: 3, reference: 'CTR-2025-00126', title: 'Contrat de location véhicules', party: 'City Rent', type: 'Location', status: 'En négociation', statusColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', startDate: '01/05/2025', endDate: '04/05/2026', amountHT: '210 000,00 €' },
  { id: 4, reference: 'CTR-2025-00125', title: 'Contrat d\'assurance flotte', party: 'Allianz Assurance', type: 'Assurance', status: 'Actif', statusColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', startDate: '01/03/2025', endDate: '28/02/2026', amountHT: '36 750,00 €' },
  { id: 5, reference: 'CTR-2025-00124', title: 'Contrat de partenariat', party: 'Bosch Automotive', type: 'Partenariat', status: 'Expire bientôt', statusColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30', startDate: '15/06/2024', endDate: '14/06/2025', amountHT: '15 000,00 €' },
  { id: 6, reference: 'CTR-2025-00123', title: 'Contrat de service après-vente', party: 'Speedy Services', type: 'Service', status: 'Actif', statusColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', startDate: '01/01/2025', endDate: '31/12/2025', amountHT: '62 300,00 €' },
  { id: 7, reference: 'CTR-2025-00122', title: 'NDA - Confidentialité', party: 'Tech Solutions', type: 'NDA', status: 'Résilié', statusColor: 'bg-red-500/15 text-red-400 border-red-500/30', startDate: '01/09/2024', endDate: '01/03/2025', amountHT: '0,00 €' },
]

export function ContractsDashboardClient() {
  const [search, setSearch] = useState('')

  const filteredContracts = CONTRACTS.filter(
    (c) =>
      c.reference.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.party.toLowerCase().includes(search.toLowerCase()) ||
      c.type.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Top Header matching Reference #24 Screen 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Contrats — Liste / Tableau de bord
          </h1>
          <p className="text-xs text-zinc-400">
            Gérez l&apos;ensemble de vos contrats en toute simplicité et sécurité.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/contracts/new"
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Nouveau contrat</span>
          </Link>
        </div>
      </div>

      {/* 6 KPI Cards matching Reference #24 Screen 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* TOTAL CONTRATS */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total contrats</div>
          <div className="mt-2 font-mono font-black text-white text-base sm:text-lg">
            128
          </div>
          <div className="mt-0.5 text-[9px] text-cyan-400 font-semibold">
            ↑ 12,4% ce mois
          </div>
        </div>

        {/* CONTRATS ACTIFS */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Contrats actifs</div>
          <div className="mt-2 font-mono font-black text-emerald-400 text-base sm:text-lg">
            78
          </div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold">
            ↑ 8,7% ce mois
          </div>
        </div>

        {/* EN NÉGOCIATION */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">En négociation</div>
          <div className="mt-2 font-mono font-black text-cyan-400 text-base sm:text-lg">
            22
          </div>
          <div className="mt-0.5 text-[9px] text-cyan-400 font-semibold">
            ↑ 15,2% ce mois
          </div>
        </div>

        {/* EXPIRANT SOUS 30 JOURS */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Expirant sous 30 jours</div>
          <div className="mt-2 font-mono font-black text-amber-400 text-base sm:text-lg">
            14
          </div>
          <div className="mt-0.5 text-[9px] text-red-400 font-semibold">
            ↓ 4,3% ce mois
          </div>
        </div>

        {/* RÉSILIÉS CE MOIS */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Résiliés ce mois</div>
          <div className="mt-2 font-mono font-black text-red-400 text-base sm:text-lg">
            3
          </div>
          <div className="mt-0.5 text-[9px] text-red-400 font-semibold">
            ↑ 25% ce mois
          </div>
        </div>

        {/* VALEUR TOTALE */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between shadow-sm">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Valeur totale</div>
          <div className="mt-2 font-mono font-black text-white text-sm sm:text-base">
            2 548 600 €
          </div>
          <div className="mt-0.5 text-[9px] text-emerald-400 font-semibold">
            ↑ 18,6% ce mois
          </div>
        </div>
      </div>

      {/* Filtres avancés */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-white">FILTRES AVANCÉS</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none">
            <option>Tous les statuts</option>
            <option>Actif</option>
            <option>En négociation</option>
            <option>Expire bientôt</option>
            <option>Résilié</option>
          </select>

          <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none">
            <option>Tous les types</option>
            <option>Maintenance</option>
            <option>Fourniture</option>
            <option>Location</option>
            <option>Assurance</option>
            <option>Partenariat</option>
            <option>Service</option>
            <option>NDA</option>
          </select>

          <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none">
            <option>Toutes les parties</option>
            <option>Groupe TransLog</option>
            <option>Auto Partenaire SARL</option>
            <option>City Rent</option>
            <option>Allianz Assurance</option>
          </select>

          <input
            type="text"
            placeholder="Du (jj/mm/aaaa)"
            className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs font-mono text-zinc-300 focus:outline-none"
          />

          <input
            type="text"
            placeholder="Au (jj/mm/aaaa)"
            className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs font-mono text-zinc-300 focus:outline-none"
          />

          <input
            type="text"
            placeholder="Min (€)"
            className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs font-mono text-zinc-300 focus:outline-none"
          />

          <input
            type="text"
            placeholder="Max (€)"
            className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs font-mono text-zinc-300 focus:outline-none"
          />

          <div className="flex items-center gap-1">
            <button className="h-8 flex-1 rounded-lg border border-[#282834] bg-[#18181f] text-xs text-zinc-300 hover:text-white flex items-center justify-center">
              <span>Réinitialiser</span>
            </button>
            <button className="h-8 flex-1 rounded-lg bg-red-600 text-xs font-bold text-white hover:bg-red-700">
              Filtrer
            </button>
          </div>
        </div>
      </div>

      {/* Main Contracts Table */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher dans la liste..."
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* 7-row Contracts Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Référence</th>
                <th className="py-2.5 px-3">Titre du contrat</th>
                <th className="py-2.5 px-3">Partie</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3 font-mono">Date début</th>
                <th className="py-2.5 px-3 font-mono">Date fin</th>
                <th className="py-2.5 px-3 text-right font-mono">Montant HT</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {filteredContracts.map((c) => (
                <tr key={c.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3">
                    <Link
                      href={`/contracts/${c.reference}`}
                      className="font-mono font-bold text-white hover:text-red-400 transition-colors"
                    >
                      {c.reference}
                    </Link>
                  </td>
                  <td className="py-3 px-3 font-semibold text-white">
                    <Link href={`/contracts/${c.reference}`} className="hover:text-red-400">
                      {c.title}
                    </Link>
                  </td>
                  <td className="py-3 px-3 text-zinc-300">{c.party}</td>
                  <td className="py-3 px-3 text-zinc-400">{c.type}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-bold ${c.statusColor}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">{c.startDate}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">{c.endDate}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-white">{c.amountHT}</td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Link
                        href={`/contracts/${c.reference}`}
                        className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Détail"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/contracts/${c.reference}/preview`}
                        className="rounded p-1 text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800"
                        title="Aperçu & Signature"
                      >
                        <FileText className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/contracts/${c.reference}/history`}
                        className="rounded p-1 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800"
                        title="Historique"
                      >
                        <Clock className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 text-[11px] text-zinc-400">
          <span>Affichage 1 à 7 sur 128 contrats</span>
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
              19
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
