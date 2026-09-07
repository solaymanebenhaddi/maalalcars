'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Star,
  Plus,
  Search,
  Filter,
  Eye,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
} from 'recharts'

const emptySubscribe = () => () => {}
function useMounted() {
  return React.useSyncExternalStore(emptySubscribe, () => true, () => false)
}

interface SavTicket {
  id: string
  code: string
  clientName: string
  vehicleName: string
  category: string
  subject: string
  priority: 'Élevée' | 'Moyenne' | 'Basse'
  status: 'En cours' | 'En attente' | 'Ouvert' | 'Résolu'
  assignedTo: string
  createdAt: string
  sla: string
}

const DEFAULT_TICKETS: SavTicket[] = [
  {
    id: '1',
    code: 'SAV-2025-0048',
    clientName: 'Yassine Benali',
    vehicleName: 'Toyota Land Cruiser 2023',
    category: 'Mécanique',
    subject: 'Bruit anormal à l’accélération',
    priority: 'Élevée',
    status: 'En cours',
    assignedTo: 'Sarah El Amrani',
    createdAt: '15 mai 2025 10:30',
    sla: '2h 15m',
  },
  {
    id: '2',
    code: 'SAV-2025-0047',
    clientName: 'Imane Zahiri',
    vehicleName: 'Mercedes-Benz GLC 2022',
    category: 'Électrique',
    subject: 'Écran tactile ne répond plus',
    priority: 'Moyenne',
    status: 'En attente',
    assignedTo: 'Mehdi Lahlou',
    createdAt: '15 mai 2025 09:15',
    sla: '1h 40m',
  },
  {
    id: '3',
    code: 'SAV-2025-0046',
    clientName: 'Omar Bennis',
    vehicleName: 'Audi Q7 2021',
    category: 'Carrosserie',
    subject: 'Rayure porte arrière droite',
    priority: 'Basse',
    status: 'Ouvert',
    assignedTo: 'Kanza Bennani',
    createdAt: '14 mai 2025 08:45',
    sla: '—',
  },
  {
    id: '4',
    code: 'SAV-2025-0045',
    clientName: 'Sarah El Amrani',
    vehicleName: 'BMW X5 2022',
    category: 'Mécanique',
    subject: 'Vibration au freinage',
    priority: 'Élevée',
    status: 'En cours',
    assignedTo: 'Youssef El Idrissi',
    createdAt: '14 mai 2025 16:20',
    sla: '1h 50m',
  },
  {
    id: '5',
    code: 'SAV-2025-0044',
    clientName: 'Mehdi Lahlou',
    vehicleName: 'Toyota Hilux 2020',
    category: 'Électronique',
    subject: 'Caméra de recul défaillante',
    priority: 'Moyenne',
    status: 'En attente',
    assignedTo: "Ayoub M'rabet",
    createdAt: '14 mai 2025 14:10',
    sla: '3h 10m',
  },
]

const PRIORITY_DATA = [
  { name: 'Élevée', value: 7, percent: '14,6%', color: '#ef4444' },
  { name: 'Moyenne', value: 19, percent: '39,6%', color: '#f97316' },
  { name: 'Basse', value: 22, percent: '45,8%', color: '#22c55e' },
]

const STATUS_DATA = [
  { name: 'Ouvert', value: 17, percent: '35,4%', color: '#3b82f6' },
  { name: 'En cours', value: 16, percent: '33,3%', color: '#eab308' },
  { name: 'En attente', value: 7, percent: '14,6%', color: '#a855f7' },
  { name: 'Résolu', value: 22, percent: '45,7%', color: '#22c55e' },
]

const RESPONSE_TIME_DATA = [
  { day: '01/05', time: 3.8 },
  { day: '06/05', time: 3.2 },
  { day: '11/05', time: 3.0 },
  { day: '16/05', time: 2.75 },
  { day: '21/05', time: 2.9 },
  { day: '26/05', time: 2.5 },
  { day: '29/05', time: 2.65 },
]

export default function SavDashboardPage() {
  const mounted = useMounted()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tous')
  const [priorityFilter, setPriorityFilter] = useState('Toutes')
  const [categoryFilter, setCategoryFilter] = useState('Toutes')
  const [assigneeFilter, setAssigneeFilter] = useState('Tous')
  const [tickets] = useState<SavTicket[]>(DEFAULT_TICKETS)

  const filtered = tickets.filter((t) => {
    if (statusFilter !== 'Tous' && t.status !== statusFilter) return false
    if (priorityFilter !== 'Toutes' && t.priority !== priorityFilter) return false
    if (categoryFilter !== 'Toutes' && t.category !== categoryFilter) return false
    if (assigneeFilter !== 'Tous' && t.assignedTo !== assigneeFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        t.code.toLowerCase().includes(q) ||
        t.clientName.toLowerCase().includes(q) ||
        t.vehicleName.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Header matching Reference #32 Screen 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
        <div>
          <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
            SAV / Support client
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Vue d&apos;ensemble des tickets et activités SAV
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/sav/planning"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <Calendar className="h-3.5 w-3.5 text-cyan-400" />
            <span>Planification interventions</span>
          </Link>

          <Link
            href="/sav/new"
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Nouveau ticket</span>
          </Link>
        </div>
      </div>

      {/* 6 KPI Cards matching Reference #32 Screen 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* KPI 1 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Tickets ouverts</span>
          <div className="text-xl font-black font-mono text-white mt-1">48</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 12 ce mois</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">En attente de réponse</span>
          <div className="text-xl font-black font-mono text-white mt-1">16</div>
          <div className="text-[10px] text-red-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 4 ce mois</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Priorité élevée</span>
          <div className="text-xl font-black font-mono text-red-400 mt-1">7</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowDownRight className="h-3 w-3" />
            <span>- 2 ce mois</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Temps de réponse moyen</span>
          <div className="text-xl font-black font-mono text-white mt-1">2h 45m</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <TrendingDown className="h-3 w-3" />
            <span>- 15% vs mois dernier</span>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Tickets résolus</span>
          <div className="text-xl font-black font-mono text-emerald-400 mt-1">128</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 18% ce mois</span>
          </div>
        </div>

        {/* KPI 6 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Satisfaction client</span>
          <div className="text-xl font-black font-mono text-amber-400 mt-1 flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span>4.6 / 5</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 0.3 ce mois</span>
          </div>
        </div>
      </div>

      {/* 3 Analytics Charts Cards matching Reference #32 Screen 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Card 1: Tickets par priorité */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2 shadow-md">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Tickets par priorité
          </h2>
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="relative h-28 w-28 flex-shrink-0">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={PRIORITY_DATA}
                      innerRadius={30}
                      outerRadius={48}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="#121216"
                      strokeWidth={2}
                    >
                      {PRIORITY_DATA.map((entry, index) => (
                        <Cell key={`cell-prio-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#141418',
                        borderColor: '#282834',
                        borderRadius: '8px',
                        fontSize: '11px',
                        color: '#fff',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-mono font-bold text-xs text-white">48</span>
                <span className="text-[8px] text-zinc-400">Total</span>
              </div>
            </div>

            <div className="flex-1 space-y-1 text-[10px]">
              {PRIORITY_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-zinc-300">{item.name}</span>
                  </div>
                  <span className="font-mono text-zinc-400">
                    {item.value} ({item.percent})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Répartition par statut */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2 shadow-md">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Répartition par statut
          </h2>
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="relative h-28 w-28 flex-shrink-0">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={STATUS_DATA}
                      innerRadius={30}
                      outerRadius={48}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="#121216"
                      strokeWidth={2}
                    >
                      {STATUS_DATA.map((entry, index) => (
                        <Cell key={`cell-stat-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#141418',
                        borderColor: '#282834',
                        borderRadius: '8px',
                        fontSize: '11px',
                        color: '#fff',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-mono font-bold text-xs text-white">48</span>
                <span className="text-[8px] text-zinc-400">Total</span>
              </div>
            </div>

            <div className="flex-1 space-y-1 text-[10px]">
              {STATUS_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-zinc-300">{item.name}</span>
                  </div>
                  <span className="font-mono text-zinc-400">
                    {item.value} ({item.percent})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: Temps de réponse (moyen) */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Temps de réponse (moyen)
            </h2>
            <span className="text-[10px] text-zinc-400">30 derniers jours</span>
          </div>
          <div className="h-28 w-full pt-1">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={RESPONSE_TIME_DATA}>
                  <defs>
                    <linearGradient id="savGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#6b7280" fontSize={9} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={9} tickLine={false} unit="h" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#141418',
                      borderColor: '#282834',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: '#fff',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="time"
                    name="Délai"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#savGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Filter bar matching Reference #32 Screen 1 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5 items-center">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un ticket, client, véhicule..."
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] pl-8 pr-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none"
            >
              <option value="Tous">Statut (Tous)</option>
              <option value="Ouvert">Ouvert</option>
              <option value="En cours">En cours</option>
              <option value="En attente">En attente</option>
              <option value="Résolu">Résolu</option>
            </select>
          </div>

          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none"
            >
              <option value="Toutes">Priorité (Toutes)</option>
              <option value="Élevée">Élevée</option>
              <option value="Moyenne">Moyenne</option>
              <option value="Basse">Basse</option>
            </select>
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none"
            >
              <option value="Toutes">Catégorie (Toutes)</option>
              <option value="Mécanique">Mécanique</option>
              <option value="Électrique">Électrique</option>
              <option value="Carrosserie">Carrosserie</option>
              <option value="Électronique">Électronique</option>
            </select>
          </div>

          <div>
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none"
            >
              <option value="Tous">Assigné à (Tous)</option>
              <option value="Sarah El Amrani">Sarah El Amrani</option>
              <option value="Mehdi Lahlou">Mehdi Lahlou</option>
              <option value="Kanza Bennani">Kanza Bennani</option>
              <option value="Youssef El Idrissi">Youssef El Idrissi</option>
            </select>
          </div>

          <div>
            <button className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] text-[11px] font-semibold text-zinc-300 hover:text-white flex items-center justify-center gap-1.5">
              <Filter className="h-3 w-3 text-zinc-400" />
              <span>Actions</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tickets Table matching Reference #32 Screen 1 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Référence</th>
                <th className="py-2.5 px-3">Client</th>
                <th className="py-2.5 px-3">Véhicule</th>
                <th className="py-2.5 px-3">Catégorie</th>
                <th className="py-2.5 px-3">Sujet</th>
                <th className="py-2.5 px-3 text-center">Priorité</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3">Assigné à</th>
                <th className="py-2.5 px-3 font-mono">Créé le</th>
                <th className="py-2.5 px-3 font-mono text-center">SLA</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24] text-[11px]">
              {filtered.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-white">
                    <Link href={`/sav/${ticket.code}`} className="hover:text-red-400 hover:underline">
                      {ticket.code}
                    </Link>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-white">{ticket.clientName}</td>
                  <td className="py-2.5 px-3 text-zinc-300">{ticket.vehicleName}</td>
                  <td className="py-2.5 px-3 text-cyan-400 font-semibold">{ticket.category}</td>
                  <td className="py-2.5 px-3 text-white max-w-xs truncate">{ticket.subject}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold ${
                        ticket.priority === 'Élevée'
                          ? 'bg-red-500/15 border border-red-500/30 text-red-400'
                          : ticket.priority === 'Moyenne'
                          ? 'bg-orange-500/15 border border-orange-500/30 text-orange-400'
                          : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold ${
                        ticket.status === 'En cours'
                          ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                          : ticket.status === 'En attente'
                          ? 'bg-purple-500/15 border border-purple-500/30 text-purple-400'
                          : ticket.status === 'Résolu'
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                          : 'bg-blue-500/15 border border-blue-500/30 text-blue-400'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-zinc-300">{ticket.assignedTo}</td>
                  <td className="py-2.5 px-3 font-mono text-zinc-400 text-[10px]">{ticket.createdAt}</td>
                  <td className="py-2.5 px-3 text-center font-mono text-cyan-400 font-bold">{ticket.sla}</td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Link
                        href={`/sav/${ticket.code}`}
                        title="Voir la conversation"
                        className="rounded p-1 text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/sav/planning?ticket=${ticket.code}`}
                        title="Planifier intervention"
                        className="rounded p-1 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800"
                      >
                        <Calendar className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination matching Reference #32 Screen 1 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-[11px] text-zinc-400">
          <span>Affichage de 1 à {filtered.length} sur 48 tickets</span>
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
              10
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
