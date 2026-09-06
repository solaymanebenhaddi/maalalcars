'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Wrench,
  Clock,
  CheckCircle2,
  Award,
  TrendingUp,
  ShoppingBag,
  RotateCcw,
  Calendar,
  Layers,
  CalendarDays,
} from 'lucide-react'
import { WorkshopEvolutionChart } from './workshop-evolution-chart'
import { WorkshopInterventionDonut } from './workshop-intervention-donut'
import { WorkshopWorkloadChart } from './workshop-workload-chart'
import { Currency } from '@/components/shared/currency'

interface WorkshopOrderItem {
  id: string
  code: string
  serviceType: string
  interventionCategory?: string | null
  priority: string
  status: string
  scheduledDate: string
  dueDate?: string | null
  partsCostHT: number
  laborCostHT: number
  totalTTC: number
  vehicleName?: string | null
  licensePlate?: string | null
  technicianName?: string | null
  workshopBay?: string | null
  client?: {
    id: string
    firstName: string
    lastName: string
    phone: string
  } | null
}

interface Props {
  initialOrders: WorkshopOrderItem[]
}

const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  IN_PROGRESS: { label: 'En cours', class: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
  WAITING_PARTS: { label: 'En attente pièces', class: 'bg-amber-500/15 text-amber-400 border border-amber-500/30' },
  PLANNED: { label: 'À planifier', class: 'bg-zinc-500/15 text-zinc-300 border border-zinc-500/30' },
  COMPLETED: { label: 'Terminés', class: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
  CANCELLED: { label: 'Annulés', class: 'bg-red-500/15 text-red-400 border border-red-500/30' },
}

const PRIORITY_CONFIG: Record<string, { label: string; class: string }> = {
  HIGH: { label: 'Haute', class: 'text-red-400 font-semibold' },
  URGENT: { label: 'Urgente', class: 'text-red-500 font-bold' },
  MEDIUM: { label: 'Moyenne', class: 'text-zinc-300 font-normal' },
  LOW: { label: 'Basse', class: 'text-zinc-400 font-normal' },
}

export function WorkshopDashboardClient({ initialOrders }: Props) {
  const [statusFilter, setStatusFilter] = useState('Tous')
  const [categoryFilter, setCategoryFilter] = useState('Tous')
  const [techFilter, setTechFilter] = useState('Tous')
  const [priorityFilter, setPriorityFilter] = useState('Toutes')

  const filteredOrders = initialOrders.filter((o) => {
    if (statusFilter !== 'Tous' && o.status !== statusFilter) return false
    if (categoryFilter !== 'Tous' && o.interventionCategory !== categoryFilter) return false
    if (techFilter !== 'Tous' && o.technicianName !== techFilter) return false
    if (priorityFilter !== 'Toutes' && o.priority !== priorityFilter) return false
    return true
  })

  const resetFilters = () => {
    setStatusFilter('Tous')
    setCategoryFilter('Tous')
    setTechFilter('Tous')
    setPriorityFilter('Toutes')
  }

  return (
    <div className="space-y-5 text-xs text-white">
      {/* Top Header matching Reference #10 Screen 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Atelier / Entretien — Tableau de bord
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Vue d’ensemble de la performance et de l’activité de votre atelier.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            href="/workshop/planning"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <CalendarDays className="h-3.5 w-3.5 text-cyan-400" />
            <span>Planning atelier</span>
          </Link>

          <Link
            href="/workshop/orders"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <Layers className="h-3.5 w-3.5 text-amber-400" />
            <span>Ordres de travail</span>
          </Link>

          <Link
            href="/workshop/parts"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <Wrench className="h-3.5 w-3.5 text-purple-400" />
            <span>Pièces & Coûts</span>
          </Link>
        </div>
      </div>

      {/* 6 Top KPI Summary Cards matching Reference #10 Screen 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium">O.T. ouverts</span>
            <Wrench className="h-3.5 w-3.5 text-zinc-500" />
          </div>
          <div className="text-2xl font-black text-white font-mono">128</div>
          <div className="text-[10px] font-semibold text-emerald-400">↗ 12.5% vs mois dernier</div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium">Interventions en cours</span>
            <Clock className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">36</div>
          <div className="text-[10px] font-semibold text-emerald-400">En cours aujourd’hui</div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium">O.T. terminés</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">214</div>
          <div className="text-[10px] font-semibold text-emerald-400">↗ 18.7% vs mois dernier</div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium">Taux de réalisation</span>
            <Award className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">92.4%</div>
          <div className="text-[10px] font-semibold text-emerald-400">↗ 4.6% vs mois dernier</div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium">Chiffre d’affaires atelier</span>
            <TrendingUp className="h-3.5 w-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">128 560 DH</div>
          <div className="text-[10px] font-semibold text-emerald-400">↗ 16.2% vs mois dernier</div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-medium">Panier moyen</span>
            <ShoppingBag className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">452 DH</div>
          <div className="text-[10px] font-semibold text-emerald-400">↗ 9.8% vs mois dernier</div>
        </div>
      </div>

      {/* Middle 3 Charts Row matching Reference #10 Screen 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Chart 1: Évolution des O.T. (30 derniers jours) */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3 flex flex-col justify-between">
          <div className="border-b border-[#222228] pb-2">
            <h2 className="text-xs font-bold text-white">Évolution des O.T. <span className="text-zinc-400 font-normal">(30 derniers jours)</span></h2>
          </div>
          <WorkshopEvolutionChart />
        </div>

        {/* Chart 2: Répartition par type d'intervention */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3 flex flex-col justify-between">
          <div className="border-b border-[#222228] pb-2">
            <h2 className="text-xs font-bold text-white">Répartition par type d’intervention</h2>
          </div>
          <WorkshopInterventionDonut total={128} />
        </div>

        {/* Chart 3: Charge atelier (Heures prévues) */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3 flex flex-col justify-between">
          <div className="border-b border-[#222228] pb-2">
            <h2 className="text-xs font-bold text-white">Charge atelier <span className="text-zinc-400 font-normal">(Heures prévues)</span></h2>
          </div>
          <WorkshopWorkloadChart />
        </div>
      </div>

      {/* Filtres Avancés Bar matching Reference #10 Screen 1 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 space-y-2">
        <div className="text-xs font-bold text-white mb-2">Filtres avancés</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 items-end">
          <div>
            <label className="block text-[10px] font-medium text-zinc-400 mb-1">Période</label>
            <div className="relative flex items-center">
              <Calendar className="absolute left-2 h-3 w-3 text-zinc-500" />
              <input
                type="text"
                defaultValue="22/05/2025 – 22/06/2025"
                className="h-8 w-full rounded border border-[#282834] bg-[#18181f] pl-6 pr-2 text-[10px] text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-zinc-400 mb-1">Statut</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2 text-[10px] text-white focus:outline-none"
            >
              <option value="Tous">Tous</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="WAITING_PARTS">En attente pièces</option>
              <option value="PLANNED">À planifier</option>
              <option value="COMPLETED">Terminés</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-zinc-400 mb-1">Type d’intervention</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2 text-[10px] text-white focus:outline-none"
            >
              <option value="Tous">Tous</option>
              <option value="Entretien">Entretien</option>
              <option value="Mécanique">Mécanique</option>
              <option value="Électronique">Électronique</option>
              <option value="Carrosserie">Carrosserie</option>
              <option value="Autres">Autres</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-zinc-400 mb-1">Technicien</label>
            <select
              value={techFilter}
              onChange={(e) => setTechFilter(e.target.value)}
              className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2 text-[10px] text-white focus:outline-none"
            >
              <option value="Tous">Tous</option>
              <option value="Yassine Benali">Yassine B.</option>
              <option value="Mehdi Kacem">Mehdi K.</option>
              <option value="Karim Zahid">Karim Z.</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-zinc-400 mb-1">Priorité</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2 text-[10px] text-white focus:outline-none"
            >
              <option value="Toutes">Toutes</option>
              <option value="HIGH">Haute</option>
              <option value="MEDIUM">Moyenne</option>
              <option value="LOW">Basse</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-zinc-400 mb-1">Tag / Service</label>
            <select className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2 text-[10px] text-white focus:outline-none">
              <option>Sélectionner ⌄</option>
              <option>Forfait révision</option>
              <option>Climatisation</option>
              <option>Pneumatiques</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetFilters}
              className="h-8 px-2 rounded border border-[#282834] bg-[#18181f] text-[10px] font-semibold text-zinc-300 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Réinitialiser</span>
            </button>
            <button className="h-8 flex-1 rounded bg-red-600 px-3 text-[10px] font-bold text-white shadow-md hover:bg-red-500">
              Filtrer
            </button>
          </div>
        </div>
      </div>

      {/* Ordres de travail récents Table matching Reference #10 Screen 1 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#222228] pb-2.5">
          <h2 className="text-xs font-bold text-white">Ordres de travail récents</h2>
          <Link href="/workshop/orders" className="text-[11px] text-zinc-400 hover:text-white">
            Voir tous les O.T. &gt;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#222228] text-[10px] font-semibold text-zinc-400">
                <th className="pb-2.5">N° O.T.</th>
                <th className="pb-2.5">Date</th>
                <th className="pb-2.5">Client</th>
                <th className="pb-2.5">Véhicule</th>
                <th className="pb-2.5">Immatriculation</th>
                <th className="pb-2.5">Intervention</th>
                <th className="pb-2.5">Technicien</th>
                <th className="pb-2.5 text-center">Statut</th>
                <th className="pb-2.5 text-center">Priorité</th>
                <th className="pb-2.5 text-right">Montant TTC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {filteredOrders.map((o) => {
                const statusMeta = STATUS_CONFIG[o.status] || STATUS_CONFIG.IN_PROGRESS
                const priorityMeta = PRIORITY_CONFIG[o.priority] || PRIORITY_CONFIG.MEDIUM
                const clientName = o.client ? `${o.client.firstName} ${o.client.lastName}` : 'Client'

                return (
                  <tr key={o.id} className="hover:bg-[#18181f] transition-colors group">
                    <td className="py-3 font-mono font-bold text-white">
                      <Link href={`/workshop/${o.code}`} className="hover:text-cyan-400">
                        {o.code}
                      </Link>
                    </td>
                    <td className="py-3 text-zinc-400 font-mono text-[11px]">
                      {new Date(o.scheduledDate).toLocaleDateString('fr-MA')}
                    </td>
                    <td className="py-3 font-semibold text-white">
                      <Link href={`/workshop/${o.code}`} className="hover:text-red-400">
                        {clientName}
                      </Link>
                    </td>
                    <td className="py-3 text-zinc-200">{o.vehicleName || 'BMW Série 3'}</td>
                    <td className="py-3 font-mono text-zinc-400 text-[11px]">{o.licensePlate || 'WW-123-AA'}</td>
                    <td className="py-3 text-zinc-300">{o.serviceType}</td>
                    <td className="py-3 text-zinc-400 text-[11px]">{o.technicianName || 'Yassine B.'}</td>
                    <td className="py-3 text-center">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${statusMeta.class}`}>
                        {statusMeta.label}
                      </span>
                    </td>
                    <td className={`py-3 text-center text-[11px] ${priorityMeta.class}`}>
                      {priorityMeta.label}
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-white">
                      <Currency amount={o.totalTTC} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom CTA matching Reference #10 Screen 1 */}
        <div className="flex justify-end pt-2 border-t border-[#222228]">
          <Link
            href="/workshop/orders"
            className="rounded-lg border border-[#282834] bg-[#16161c] px-4 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            Voir tous les O.T.
          </Link>
        </div>
      </div>
    </div>
  )
}
