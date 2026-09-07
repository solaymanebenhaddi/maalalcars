'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Filter,
  ArrowUpRight,
  User,
  Calendar,
} from 'lucide-react'

interface KanbanCard {
  id: string
  title: string
  vehicleOrClient?: string
  assignedTo?: string
  priority: 'Haute' | 'Moyenne' | 'Basse'
  dueDate?: string
  amount?: number
  timeAgo?: string
  completedDate?: string
}

export default function TasksKanbanPage() {
  const [statusFilter, setStatusFilter] = useState('Tous')
  const [priorityFilter, setPriorityFilter] = useState('Toutes')
  const [assigneeFilter, setAssigneeFilter] = useState('Tous')
  const [periodFilter, setPeriodFilter] = useState('Cette semaine')

  // 4 Kanban Columns matching Reference #36 Screen 1
  const todoCards: KanbanCard[] = [
    {
      id: 't-1',
      title: 'Préparer dossier carte grise',
      vehicleOrClient: 'Mercedes-Benz GLC · Yassine Benali',
      priority: 'Haute',
      dueDate: '20 mai',
    },
    {
      id: 't-2',
      title: 'Relancer client devis Audi Q7',
      vehicleOrClient: 'Audi Q7 · Omar Tazi',
      priority: 'Moyenne',
      dueDate: '21 mai',
    },
    {
      id: 't-3',
      title: 'Vérifier stock pièces BMW X5',
      vehicleOrClient: 'BMW X5 · Sarah El Amrani',
      priority: 'Basse',
      dueDate: '22 mai',
    },
  ]

  const inProgressCards: KanbanCard[] = [
    {
      id: 't-4',
      title: 'Préparer livraison Toyota Hilux',
      vehicleOrClient: 'Toyota Hilux · Mehdi Lahlou',
      priority: 'Haute',
      dueDate: '18 mai',
    },
    {
      id: 't-5',
      title: 'Contrôle technique Audi A6',
      vehicleOrClient: 'Audi A6 · Mehdi Lahlou',
      priority: 'Moyenne',
      dueDate: '19 mai',
    },
    {
      id: 't-6',
      title: 'Réparation climatisation GLC',
      vehicleOrClient: 'Mercedes-Benz GLC · Youssef El Idrissi',
      priority: 'Moyenne',
      dueDate: '20 mai',
    },
  ]

  const inApprovalCards: KanbanCard[] = [
    {
      id: 't-7',
      title: 'Approbation remise commerciale',
      vehicleOrClient: 'Client: Nabil El Hariri',
      amount: 18750,
      priority: 'Haute',
      timeAgo: 'Depuis 1j',
    },
    {
      id: 't-8',
      title: 'Validation commande fournisseur',
      vehicleOrClient: 'AutoParts Maroc',
      amount: 12450,
      priority: 'Moyenne',
      timeAgo: 'Depuis 3j',
    },
    {
      id: 't-9',
      title: 'Approbation achat véhicule',
      vehicleOrClient: 'Toyota Land Cruiser 2023',
      amount: 86500,
      priority: 'Haute',
      timeAgo: 'Depuis 2h',
    },
  ]

  const doneCards: KanbanCard[] = [
    {
      id: 't-10',
      title: 'Préparation documents client',
      vehicleOrClient: 'Sarah Benali · Terminée',
      priority: 'Basse',
      completedDate: '16 mai',
    },
    {
      id: 't-11',
      title: 'Livraison Toyota Land Cruiser',
      vehicleOrClient: 'Imane Kabbaj · Terminée',
      priority: 'Haute',
      completedDate: '15 mai',
    },
    {
      id: 't-12',
      title: 'Paiement fournisseur validé',
      vehicleOrClient: 'Youssef El Hariri · Terminée',
      priority: 'Moyenne',
      completedDate: '14 mai',
    },
  ]

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Top Header matching Reference #36 Screen 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
        <div>
          <h1 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-red-500" />
            <span>Tâches — Tableau de bord / Kanban</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Centralisez, suivez et validez toutes vos tâches et approbations opérationnelles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/tasks/calendar"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            <span>Vue Calendrier</span>
          </Link>

          <Link
            href="/tasks/new"
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Nouvelle tâche</span>
          </Link>
        </div>
      </div>

      {/* 6 KPI Cards matching Reference #36 Screen 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* KPI 1 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Toutes les tâches</span>
          <div className="text-xl font-black font-mono text-white mt-1">124</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 18,7% ce mois</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">À faire</span>
          <div className="text-xl font-black font-mono text-white mt-1">48</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 28,7%</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">En cours</span>
          <div className="text-xl font-black font-mono text-blue-400 mt-1">27</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 21,8%</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">En approbation</span>
          <div className="text-xl font-black font-mono text-amber-400 mt-1">19</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 15,3%</span>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Terminées</span>
          <div className="text-xl font-black font-mono text-emerald-400 mt-1">30</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 24,2%</span>
          </div>
        </div>

        {/* KPI 6 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Tâches en retard</span>
          <div className="text-xl font-black font-mono text-red-500 mt-1">14</div>
          <div className="text-[10px] text-red-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 5,4% ce mois</span>
          </div>
        </div>
      </div>

      {/* 4 Summary Cards matching Reference #36 Screen 1 Middle Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Approbations urgentes */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between border-b border-[#202028] pb-1.5">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-400" />
              <span>Approbations urgentes</span>
            </h2>
          </div>
          <div className="space-y-2 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-zinc-200 truncate max-w-[150px]">Achat véhicule Toyota Land Cruiser 2023</span>
              <span className="text-[9px] font-bold text-amber-400">En attente (1j)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-200 truncate max-w-[150px]">Remise commerciale client Yassine Benali</span>
              <span className="text-[9px] font-bold text-amber-400">En attente (3h)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-200 truncate max-w-[150px]">Paiement fournisseur AutoParts Maroc</span>
              <span className="text-[9px] font-bold text-amber-400">En attente (2j)</span>
            </div>
          </div>
          <Link href="/tasks/TASK-2025-0048?tab=workflow" className="text-[10px] text-red-400 hover:underline pt-1 block">
            Voir toutes (7) &rarr;
          </Link>
        </div>

        {/* Card 2: Mes tâches assignées */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between border-b border-[#202028] pb-1.5">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-cyan-400" />
              <span>Mes tâches assignées</span>
            </h2>
          </div>
          <div className="space-y-2 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-zinc-200 truncate max-w-[150px]">Préparer livraison Toyota Hilux</span>
              <span className="text-[9px] font-bold text-emerald-400">Aujourd&apos;hui</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-200 truncate max-w-[150px]">Relancer devis client Karim Tazi</span>
              <span className="text-[9px] font-bold text-zinc-400">Demain</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-200 truncate max-w-[150px]">Vérifier documents BMW X5</span>
              <span className="text-[9px] font-bold text-zinc-400">18 mai</span>
            </div>
          </div>
          <span className="text-[10px] text-cyan-400 hover:underline pt-1 block cursor-pointer">
            Voir toutes (15) &rarr;
          </span>
        </div>

        {/* Card 3: Tâches en retard */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between border-b border-[#202028] pb-1.5">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
              <span>Tâches en retard</span>
            </h2>
          </div>
          <div className="space-y-2 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-zinc-200 truncate max-w-[150px]">Approbation achat Mercedes-Benz GLC</span>
              <span className="text-[9px] font-bold text-red-400">En retard (2j)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-200 truncate max-w-[150px]">Validation facture fournisseur Smeia</span>
              <span className="text-[9px] font-bold text-red-400">En retard (3j)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-200 truncate max-w-[150px]">Checklist livraison Audi Q7</span>
              <span className="text-[9px] font-bold text-red-400">En retard (1j)</span>
            </div>
          </div>
          <span className="text-[10px] text-red-400 hover:underline pt-1 block cursor-pointer">
            Voir toutes (14) &rarr;
          </span>
        </div>

        {/* Card 4: Filtres avancés */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between space-y-2">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-1.5 flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-zinc-400" />
            <span>Filtres avancés</span>
          </h2>
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-7 rounded border border-[#282834] bg-[#18181f] px-1.5 text-zinc-300 focus:outline-none"
            >
              <option value="Tous">Statut : Tous</option>
              <option value="À faire">À faire</option>
              <option value="En cours">En cours</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="h-7 rounded border border-[#282834] bg-[#18181f] px-1.5 text-zinc-300 focus:outline-none"
            >
              <option value="Toutes">Priorité : Toutes</option>
              <option value="Haute">Haute</option>
              <option value="Moyenne">Moyenne</option>
            </select>
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="h-7 rounded border border-[#282834] bg-[#18181f] px-1.5 text-zinc-300 focus:outline-none"
            >
              <option value="Tous">Tous les membres</option>
              <option value="Mehdi L.">Mehdi L.</option>
              <option value="Omar B.">Omar B.</option>
            </select>
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="h-7 rounded border border-[#282834] bg-[#18181f] px-1.5 text-zinc-300 focus:outline-none"
            >
              <option value="Cette semaine">Cette semaine</option>
              <option value="Ce mois">Ce mois</option>
            </select>
          </div>
          <button
            onClick={() => {
              setStatusFilter('Tous')
              setPriorityFilter('Toutes')
              setAssigneeFilter('Tous')
            }}
            className="text-[10px] text-zinc-400 hover:text-white text-right block"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </div>

      {/* 4-Column Kanban Board matching Reference #36 Screen 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
        {/* Column 1: À faire (48) */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between border-b border-[#202028] pb-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-zinc-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">À faire</h3>
              </div>
              <span className="rounded-full bg-zinc-800 px-2 py-0.2 text-[10px] font-bold text-zinc-300">
                48
              </span>
            </div>

            <div className="space-y-2.5">
              {todoCards.map((card) => (
                <Link
                  key={card.id}
                  href={`/tasks/${card.id}`}
                  className="block rounded-lg border border-[#24242e] bg-[#16161c] p-3 text-xs space-y-2 hover:border-zinc-500 transition-colors"
                >
                  <div className="font-bold text-white leading-snug">{card.title}</div>
                  <div className="text-[10px] text-zinc-400">{card.vehicleOrClient}</div>
                  <div className="pt-2 border-t border-[#202028] flex items-center justify-between text-[10px]">
                    <span
                      className={`px-1.5 py-0.2 rounded font-bold ${
                        card.priority === 'Haute'
                          ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                          : card.priority === 'Moyenne'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {card.priority}
                    </span>
                    <span className="font-mono text-zinc-400">{card.dueDate}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/tasks/new"
            className="w-full py-2 rounded-lg border border-dashed border-[#282834] bg-[#16161c] text-center text-[11px] font-semibold text-zinc-400 hover:text-white hover:border-zinc-600 block transition-colors"
          >
            + Ajouter une tâche
          </Link>
        </div>

        {/* Column 2: En cours (27) */}
        <div className="rounded-xl border border-blue-500/20 bg-[#121216] p-3 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between border-b border-[#202028] pb-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">En cours</h3>
              </div>
              <span className="rounded-full bg-blue-500/20 px-2 py-0.2 text-[10px] font-bold text-blue-400">
                27
              </span>
            </div>

            <div className="space-y-2.5">
              {inProgressCards.map((card) => (
                <Link
                  key={card.id}
                  href={`/tasks/${card.id}`}
                  className="block rounded-lg border border-blue-500/30 bg-[#16161c] p-3 text-xs space-y-2 hover:border-blue-400 transition-colors"
                >
                  <div className="font-bold text-white leading-snug">{card.title}</div>
                  <div className="text-[10px] text-zinc-400">{card.vehicleOrClient}</div>
                  <div className="pt-2 border-t border-[#202028] flex items-center justify-between text-[10px]">
                    <span
                      className={`px-1.5 py-0.2 rounded font-bold ${
                        card.priority === 'Haute'
                          ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {card.priority}
                    </span>
                    <span className="font-mono text-cyan-400 font-semibold">{card.dueDate}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/tasks/new"
            className="w-full py-2 rounded-lg border border-dashed border-[#282834] bg-[#16161c] text-center text-[11px] font-semibold text-zinc-400 hover:text-white hover:border-zinc-600 block transition-colors"
          >
            + Ajouter une tâche
          </Link>
        </div>

        {/* Column 3: En approbation (19) */}
        <div className="rounded-xl border border-amber-500/20 bg-[#121216] p-3 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between border-b border-[#202028] pb-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">En approbation</h3>
              </div>
              <span className="rounded-full bg-amber-500/20 px-2 py-0.2 text-[10px] font-bold text-amber-400">
                19
              </span>
            </div>

            <div className="space-y-2.5">
              {inApprovalCards.map((card) => (
                <Link
                  key={card.id}
                  href={`/tasks/TASK-2025-0048?tab=workflow`}
                  className="block rounded-lg border border-amber-500/30 bg-[#16161c] p-3 text-xs space-y-2 hover:border-amber-400 transition-colors"
                >
                  <div className="font-bold text-white leading-snug">{card.title}</div>
                  <div className="text-[10px] text-zinc-400">{card.vehicleOrClient}</div>
                  <div className="pt-2 border-t border-[#202028] flex items-center justify-between text-[10px]">
                    <span className="font-mono font-bold text-emerald-400">
                      {card.amount ? `${card.amount.toLocaleString('fr-FR')} DH` : '—'}
                    </span>
                    <span className="font-mono text-amber-400 text-[10px]">{card.timeAgo}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/tasks/new"
            className="w-full py-2 rounded-lg border border-dashed border-[#282834] bg-[#16161c] text-center text-[11px] font-semibold text-zinc-400 hover:text-white hover:border-zinc-600 block transition-colors"
          >
            + Ajouter une tâche
          </Link>
        </div>

        {/* Column 4: Terminées (30) */}
        <div className="rounded-xl border border-emerald-500/20 bg-[#121216] p-3 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between border-b border-[#202028] pb-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Terminées</h3>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.2 text-[10px] font-bold text-emerald-400">
                30
              </span>
            </div>

            <div className="space-y-2.5">
              {doneCards.map((card) => (
                <div
                  key={card.id}
                  className="rounded-lg border border-emerald-500/20 bg-[#16161c] p-3 text-xs space-y-2"
                >
                  <div className="font-bold text-zinc-300 leading-snug line-through">{card.title}</div>
                  <div className="text-[10px] text-zinc-500">{card.vehicleOrClient}</div>
                  <div className="pt-2 border-t border-[#202028] flex items-center justify-between text-[10px]">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Terminée</span>
                    </span>
                    <span className="font-mono text-zinc-500">{card.completedDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/tasks/new"
            className="w-full py-2 rounded-lg border border-dashed border-[#282834] bg-[#16161c] text-center text-[11px] font-semibold text-zinc-400 hover:text-white hover:border-zinc-600 block transition-colors"
          >
            + Ajouter une tâche
          </Link>
        </div>
      </div>
    </div>
  )
}
