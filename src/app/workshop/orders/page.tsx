'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Currency } from '@/components/shared/currency'

interface OrderRow {
  code: string
  client: string
  vehicle: string
  intervention: string
  status: string
  priority: string
  dueDate: string
  amountTTC: number
}

const ORDERS_DATA: OrderRow[] = [
  { code: 'OT-2025-0128', client: 'Jean Dupont', vehicle: 'BMW Série 3', intervention: 'Entretien périodique', status: 'IN_PROGRESS', priority: 'MEDIUM', dueDate: '24/05/2025', amountTTC: 328.50 },
  { code: 'OT-2025-0127', client: 'Sophie Martin', vehicle: 'Peugeot 308', intervention: 'Diagnostic électronique', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: '23/05/2025', amountTTC: 186.00 },
  { code: 'OT-2025-0126', client: 'Lucas Bernard', vehicle: 'Renault Clio', intervention: 'Remplacement freins AV', status: 'WAITING_PARTS', priority: 'HIGH', dueDate: '26/05/2025', amountTTC: 412.80 },
  { code: 'OT-2025-0125', client: 'Emma Lefèvre', vehicle: 'Audi A4', intervention: 'Vidange + filtres', status: 'PLANNED', priority: 'LOW', dueDate: '27/05/2025', amountTTC: 129.90 },
  { code: 'OT-2025-0124', client: 'Marc Petit', vehicle: 'Mercedes C220', intervention: 'Distribution + pompe à eau', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: '25/05/2025', amountTTC: 1295.00 },
  { code: 'OT-2025-0123', client: 'Chloé Moreau', vehicle: 'Citroën C3', intervention: 'Révision complète', status: 'COMPLETED', priority: 'LOW', dueDate: '21/05/2025', amountTTC: 198.00 },
  { code: 'OT-2025-0122', client: 'David Rolland', vehicle: 'Ford Focus', intervention: 'Diagnostic moteur', status: 'COMPLETED', priority: 'MEDIUM', dueDate: '20/05/2025', amountTTC: 94.80 },
  { code: 'OT-2025-0121', client: 'Julien Morel', vehicle: 'VW Golf', intervention: 'Changement embrayage', status: 'WAITING_PARTS', priority: 'HIGH', dueDate: '28/05/2025', amountTTC: 742.50 },
  { code: 'OT-2025-0120', client: 'Sarah Girard', vehicle: 'Nissan Qashqai', intervention: 'Entretien périodique', status: 'IN_PROGRESS', priority: 'MEDIUM', dueDate: '24/05/2025', amountTTC: 259.00 },
  { code: 'OT-2025-0119', client: 'Antoine Dubois', vehicle: 'Opel Astra', intervention: 'Freinage AR', status: 'COMPLETED', priority: 'LOW', dueDate: '19/05/2025', amountTTC: 211.20 },
]

const TABS = [
  { id: 'ALL', label: 'Tous', count: 128 },
  { id: 'IN_PROGRESS', label: 'En cours', count: 36 },
  { id: 'WAITING_PARTS', label: 'En attente pièces', count: 18 },
  { id: 'PLANNED', label: 'À planifier', count: 22 },
  { id: 'COMPLETED', label: 'Terminés', count: 214 },
  { id: 'CANCELLED', label: 'Annulés', count: 6 },
]

const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  IN_PROGRESS: { label: 'En cours', class: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
  WAITING_PARTS: { label: 'En attente pièces', class: 'bg-amber-500/15 text-amber-400 border border-amber-500/30' },
  PLANNED: { label: 'À planifier', class: 'bg-zinc-500/15 text-zinc-300 border border-zinc-500/30' },
  COMPLETED: { label: 'Terminés', class: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
  CANCELLED: { label: 'Annulés', class: 'bg-red-500/15 text-red-400 border border-red-500/30' },
}

const PRIORITY_CONFIG: Record<string, { label: string; class: string }> = {
  HIGH: { label: 'Haute', class: 'text-red-400 font-semibold' },
  MEDIUM: { label: 'Moyenne', class: 'text-zinc-300 font-normal' },
  LOW: { label: 'Basse', class: 'text-zinc-400 font-normal' },
}

export default function WorkshopOrdersPage() {
  const [activeTab, setActiveTab] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredOrders = ORDERS_DATA.filter((o) => {
    if (activeTab !== 'ALL' && o.status !== activeTab) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const match =
        o.code.toLowerCase().includes(q) ||
        o.client.toLowerCase().includes(q) ||
        o.vehicle.toLowerCase().includes(q) ||
        o.intervention.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })

  return (
    <div className="space-y-5 text-xs text-white">
      <PageHeader
        title="Ordres de travail"
        subtitle="Gérez et suivez tous les ordres de travail de l’atelier."
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Atelier', href: '/workshop' },
          { label: 'Ordres de travail' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/workshop"
              className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Tableau de bord</span>
            </Link>
            <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500">
              <Plus className="h-3.5 w-3.5" />
              <span>+ Nouvel O.T.</span>
            </button>
          </div>
        }
      />

      {/* Filter Tabs Bar matching Reference #10 Screen 2 */}
      <div className="flex items-center gap-6 border-b border-[#222228] px-2 text-xs overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 font-semibold transition-all relative shrink-0 ${
              activeTab === tab.id ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>
              {tab.label} ({tab.count})
            </span>
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Search & Actions Bar matching Reference #10 Screen 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#222228] bg-[#121216] p-3">
        <div className="relative flex items-center flex-1 max-w-md">
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Rechercher un O.T., client, véhicule..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] pl-8 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none"
          />
        </div>

        <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
          <Filter className="h-3.5 w-3.5 text-zinc-500" />
          <span>Filtres ⌄</span>
        </button>
      </div>

      {/* Orders Table matching Reference #10 Screen 2 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#222228] text-[10px] font-semibold text-zinc-400">
                <th className="pb-2.5">N° O.T.</th>
                <th className="pb-2.5">Client</th>
                <th className="pb-2.5">Véhicule</th>
                <th className="pb-2.5">Intervention</th>
                <th className="pb-2.5 text-center">Statut</th>
                <th className="pb-2.5 text-center">Priorité</th>
                <th className="pb-2.5 text-center">Échéance</th>
                <th className="pb-2.5 text-right">Montant TTC</th>
                <th className="pb-2.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {filteredOrders.map((o) => {
                const statusMeta = STATUS_CONFIG[o.status] || STATUS_CONFIG.IN_PROGRESS
                const priorityMeta = PRIORITY_CONFIG[o.priority] || PRIORITY_CONFIG.MEDIUM

                return (
                  <tr key={o.code} className="hover:bg-[#18181f] transition-colors group">
                    <td className="py-3 font-mono font-bold text-white">
                      <Link href={`/workshop/${o.code}`} className="hover:text-cyan-400">
                        {o.code}
                      </Link>
                    </td>
                    <td className="py-3 font-semibold text-white">
                      <Link href={`/workshop/${o.code}`} className="hover:text-red-400">
                        {o.client}
                      </Link>
                    </td>
                    <td className="py-3 text-zinc-300">{o.vehicle}</td>
                    <td className="py-3 text-zinc-300">{o.intervention}</td>
                    <td className="py-3 text-center">
                      <span className={`rounded px-2.5 py-0.5 text-[10px] font-bold ${statusMeta.class}`}>
                        {statusMeta.label}
                      </span>
                    </td>
                    <td className={`py-3 text-center text-[11px] ${priorityMeta.class}`}>
                      {priorityMeta.label}
                    </td>
                    <td className="py-3 text-center font-mono text-zinc-400 text-[11px]">
                      {o.dueDate}
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-white">
                      <Currency amount={o.amountTTC} />
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-2 text-zinc-400">
                        <Link
                          href={`/workshop/${o.code}`}
                          className="p-1 rounded hover:bg-[#22222a] hover:text-white"
                          title="Consulter"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                        <button className="p-1 rounded hover:bg-[#22222a] hover:text-white" title="Télécharger">
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination matching Reference #10 Screen 2 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#222228] text-xs text-zinc-400">
          <span>Affichage 1 à 10 sur 128 résultats</span>
          <div className="flex items-center gap-1 font-mono">
            <button className="px-2 py-1 rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">&lt;</button>
            <button className="px-2.5 py-1 rounded bg-red-600 text-white font-bold">1</button>
            <button className="px-2.5 py-1 rounded border border-[#282834] bg-[#18181f] hover:text-white">2</button>
            <button className="px-2.5 py-1 rounded border border-[#282834] bg-[#18181f] hover:text-white">3</button>
            <span className="px-1 text-zinc-600">...</span>
            <button className="px-2.5 py-1 rounded border border-[#282834] bg-[#18181f] hover:text-white">13</button>
            <button className="px-2 py-1 rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  )
}
