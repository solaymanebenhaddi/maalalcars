'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
  Filter,
  Search,
} from 'lucide-react'

interface AuditLogRow {
  id: number
  dateTime: string
  user: string
  action: string
  module: string
  details: string
  ip: string
}

const AUDIT_LOGS: AuditLogRow[] = [
  { id: 1, dateTime: '31/05/2025 09:45', user: 'Admin Maalal', action: 'Connexion', module: 'Connexion', details: 'Connexion réussie', ip: '192.168.1.10' },
  { id: 2, dateTime: '31/05/2025 09:30', user: 'Sarah Martin', action: 'Création', module: 'Véhicules', details: 'Véhicule "BMW X5 2021" ajouté', ip: '192.168.1.12' },
  { id: 3, dateTime: '31/05/2025 09:15', user: 'Yassine Benali', action: 'Mise à jour', module: 'Vente', details: 'Statut commande #CMD-0256 mis à jour', ip: '192.168.1.15' },
  { id: 4, dateTime: '31/05/2025 08:50', user: 'Karim Lahbili', action: 'Création', module: 'Factures', details: 'Facture #FAC-2025-0156 créée', ip: '192.168.1.18' },
  { id: 5, dateTime: '30/05/2025 17:30', user: 'Nadia Zahra', action: 'Suppression', module: 'Dépenses', details: 'Dépense #DEP-0087 supprimée', ip: '192.168.1.14' },
  { id: 6, dateTime: '30/05/2025 16:20', user: 'Admin Maalal', action: 'Modification', module: 'Utilisateurs', details: 'Rôle modifié pour Yassine Benali', ip: '192.168.1.10' },
  { id: 7, dateTime: '30/05/2025 15:10', user: 'Omar Bennis', action: 'Création', module: 'Vente', details: 'Vente #V-2025-0089 créée', ip: '192.168.1.16' },
  { id: 8, dateTime: '30/05/2025 14:05', user: 'Yassine Benali', action: 'Paiement', module: 'Paiements', details: 'Paiement reçu 12 450 €', ip: '192.168.1.15' },
  { id: 9, dateTime: '29/05/2025 11:40', user: 'Mehdi Amrani', action: 'Connexion', module: 'Connexion', details: 'Connexion réussie', ip: '192.168.1.20' },
  { id: 10, dateTime: '29/05/2025 10:25', user: 'Sarah Martin', action: 'Création', module: 'Clients', details: 'Client #C-0109 créé', ip: '192.168.1.12' },
]

export default function AuditLogPage() {
  const [search, setSearch] = useState('')

  const filteredLogs = AUDIT_LOGS.filter(
    (l) =>
      l.user.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.module.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/users"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour aux utilisateurs</span>
        </Link>

        <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
          <Download className="h-3.5 w-3.5 text-zinc-400" />
          <span>Exporter</span>
        </button>
      </div>

      {/* Main Container matching Reference #28 Screen 5 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white">
            Journal d&apos;activité
          </h1>
          <p className="text-xs text-zinc-400">
            Utilisateurs &gt; Journal d&apos;activité • Traçabilité complète des événements système
          </p>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">
          <input
            type="text"
            defaultValue="01/05/2025 - 31/05/2025"
            className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs font-mono text-zinc-300 focus:outline-none"
          />

          <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none">
            <option>Tous les utilisateurs</option>
            <option>Admin Maalal</option>
            <option>Sarah Martin</option>
            <option>Yassine Benali</option>
            <option>Karim Lahbili</option>
          </select>

          <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none">
            <option>Tous les modules</option>
            <option>Connexion</option>
            <option>Véhicules</option>
            <option>Vente</option>
            <option>Factures</option>
            <option>Dépenses</option>
            <option>Clients</option>
          </select>

          <div className="relative col-span-2 sm:col-span-1">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une activité..."
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex items-center gap-1 col-span-2 sm:col-span-1">
            <button className="h-8 flex-1 rounded-lg border border-[#282834] bg-[#18181f] text-xs font-semibold text-zinc-300 hover:text-white flex items-center justify-center gap-1">
              <Filter className="h-3 w-3" />
              <span>Filtres</span>
            </button>
          </div>
        </div>

        {/* 10-row Audit Log Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3 font-mono">Date &amp; heure</th>
                <th className="py-2.5 px-3">Utilisateur</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Module</th>
                <th className="py-2.5 px-3">Détails</th>
                <th className="py-2.5 px-3 font-mono">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24] text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-2.5 px-3 font-mono text-zinc-400 text-[10px]">{log.dateTime}</td>
                  <td className="py-2.5 px-3 font-semibold text-white">{log.user}</td>
                  <td className="py-2.5 px-3">
                    <span className="rounded bg-zinc-800/80 px-2 py-0.5 text-[9px] font-medium text-zinc-300 border border-zinc-700/50">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-zinc-300">{log.module}</td>
                  <td className="py-2.5 px-3 text-zinc-200">{log.details}</td>
                  <td className="py-2.5 px-3 font-mono text-zinc-500 text-[10px]">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 text-[11px] text-zinc-400">
          <span>Afficher 1 à 10 sur 128 activités</span>
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
              13
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
