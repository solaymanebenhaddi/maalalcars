'use client'

import React from 'react'
import Link from 'next/link'
import {
  LifeBuoy,
  Plus,
  BookOpen,
  TrendingUp,
  ArrowUpRight,
  Eye,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const emptySubscribe = () => () => {}
function useMounted() {
  return React.useSyncExternalStore(emptySubscribe, () => true, () => false)
}

const TICKETS_BY_STATUS = [
  { name: 'Nouveau', value: 28, pct: '21,9%', color: '#3b82f6' },
  { name: 'En cours', value: 30, pct: '23,4%', color: '#f59e0b' },
  { name: 'En attente client', value: 26, pct: '20,3%', color: '#06b6d4' },
  { name: 'En attente tiers', value: 14, pct: '10,9%', color: '#a855f7' },
  { name: 'Résolu', value: 30, pct: '23,4%', color: '#10b981' },
]

const CSAT_TREND = [
  { date: '15 Mai', csat: 4.3 },
  { date: '22 Mai', csat: 4.5 },
  { date: '29 Mai', csat: 4.4 },
  { date: '5 Juin', csat: 4.7 },
  { date: '12 Juin', csat: 4.6 },
]

interface TicketRow {
  id: string
  code: string
  subject: string
  client: string
  priority: 'Élevée' | 'Moyenne' | 'Faible'
  assignedTo: string
  status: 'En cours' | 'Nouveau' | 'En attente' | 'Résolu'
  sla: string
  lastActivity: string
}

const RECENT_TICKETS: TicketRow[] = [
  {
    id: '1',
    code: 'SUP-2025-0128',
    subject: 'Problème de confirmation de commande',
    client: 'Yassine Benali',
    priority: 'Élevée',
    assignedTo: 'Sarah El Amrani',
    status: 'En cours',
    sla: '1h 23m',
    lastActivity: '15/06/2025 10:32',
  },
  {
    id: '2',
    code: 'SUP-2025-0127',
    subject: 'Quels sont les délais de livraison ?',
    client: 'Imane Zahiri',
    priority: 'Moyenne',
    assignedTo: 'Omar Tazi',
    status: 'En attente',
    sla: '4h 15m',
    lastActivity: '15/06/2025 09:45',
  },
  {
    id: '3',
    code: 'SUP-2025-0126',
    subject: 'Produit endommagé',
    client: 'Mehdi Lahlou',
    priority: 'Élevée',
    assignedTo: 'Nadia Benmoussa',
    status: 'Nouveau',
    sla: '45m',
    lastActivity: '15/06/2025 09:12',
  },
  {
    id: '4',
    code: 'SUP-2025-0125',
    subject: 'Demande de facture',
    client: 'Salma Zahraoui',
    priority: 'Faible',
    assignedTo: 'Nadia K.',
    status: 'Résolu',
    sla: 'Respecté',
    lastActivity: '14/06/2025 16:22',
  },
  {
    id: '5',
    code: 'SUP-2025-0124',
    subject: 'Prélèvement de paiement',
    client: 'Omar Bennis',
    priority: 'Moyenne',
    assignedTo: 'Youssef M.',
    status: 'En cours',
    sla: '2h 00m',
    lastActivity: '14/06/2025 15:10',
  },
]

export default function HelpdeskDashboardPage() {
  const isMounted = useMounted()

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Top Header matching Reference #39 Screen 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
        <div>
          <h1 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
            <LifeBuoy className="h-4 w-4 text-red-500" />
            <span>Centre d&apos;Aide &amp; Support Client — Helpdesk</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Vue d&apos;ensemble de l&apos;activité support, respect des SLA et satisfaction client.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/helpdesk/kb"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <BookOpen className="h-3.5 w-3.5 text-zinc-400" />
            <span>Base de connaissances</span>
          </Link>

          <Link
            href="/helpdesk/reports"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <TrendingUp className="h-3.5 w-3.5 text-zinc-400" />
            <span>Rapports SLA &amp; CSAT</span>
          </Link>

          <Link
            href="/helpdesk/tickets/new"
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Nouveau ticket</span>
          </Link>
        </div>
      </div>

      {/* 6 KPI Cards matching Reference #39 Screen 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Tickets reçus</span>
          <div className="text-xl font-black font-mono text-white mt-1">128</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 18,7% ce mois</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Tickets résolus</span>
          <div className="text-xl font-black font-mono text-emerald-400 mt-1">98</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 12,4% ce mois</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">En cours</span>
          <div className="text-xl font-black font-mono text-amber-400 mt-1">30</div>
          <div className="text-[10px] text-zinc-400 mt-1">↓ 22,4%</div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">SLA respectés</span>
          <div className="text-xl font-black font-mono text-emerald-400 mt-1">92%</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 5,6%</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Temps réponse moyen</span>
          <div className="text-xl font-black font-mono text-cyan-400 mt-1">2h 15m</div>
          <div className="text-[10px] text-emerald-400 mt-1">↓ 15m vs mois dernier</div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Satisfaction (CSAT)</span>
          <div className="text-xl font-black font-mono text-amber-400 mt-1 flex items-center gap-1">
            <span>4,6</span>
            <span className="text-xs text-zinc-400">/ 5</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 0,3</span>
          </div>
        </div>
      </div>

      {/* Middle Section: 4 Central Analysis Cards matching Reference #39 Screen 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Tickets par statut (Donut Chart) */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-md">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-1.5">
            Tickets par statut
          </h2>

          <div className="flex items-center justify-between my-2">
            <div className="relative h-24 w-24 shrink-0">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={TICKETS_BY_STATUS}
                      innerRadius={30}
                      outerRadius={42}
                      dataKey="value"
                    >
                      {TICKETS_BY_STATUS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-mono font-bold text-xs text-white">128</span>
                <span className="text-[8px] text-zinc-400">Tickets</span>
              </div>
            </div>

            <div className="space-y-1 text-[9px] w-full max-w-[120px]">
              {TICKETS_BY_STATUS.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-1 truncate">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-zinc-300 truncate">{s.name}</span>
                  </div>
                  <span className="font-mono font-bold text-white">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Tickets par priorité */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-md space-y-2">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-1.5">
            Tickets par priorité
          </h2>

          <div className="space-y-2 text-[11px] my-auto">
            <div className="flex items-center justify-between p-1.5 rounded bg-[#16161c] border border-[#202028]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-white font-medium">Élevée</span>
              </div>
              <span className="font-mono font-bold text-white">32 (25,0%)</span>
            </div>

            <div className="flex items-center justify-between p-1.5 rounded bg-[#16161c] border border-[#202028]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-white font-medium">Moyenne</span>
              </div>
              <span className="font-mono font-bold text-white">64 (50,0%)</span>
            </div>

            <div className="flex items-center justify-between p-1.5 rounded bg-[#16161c] border border-[#202028]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-white font-medium">Faible</span>
              </div>
              <span className="font-mono font-bold text-white">32 (25,0%)</span>
            </div>
          </div>
        </div>

        {/* Card 3: SLA */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-md space-y-2">
          <div className="flex items-center justify-between border-b border-[#202028] pb-1.5">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              SLA
            </h2>
            <Link href="/helpdesk/reports" className="text-[10px] text-red-400 hover:underline">
              Voir rapport &rarr;
            </Link>
          </div>

          <div className="space-y-2 my-auto text-[11px]">
            <div>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-zinc-300">Respectés</span>
                <span className="font-mono font-bold text-emerald-400">92%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-zinc-300">Risques</span>
                <span className="font-mono font-bold text-amber-400">6%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '6%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-zinc-300">En retard</span>
                <span className="font-mono font-bold text-red-400">2%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '2%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Satisfaction client (CSAT) */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between shadow-md space-y-2">
          <div className="flex items-center justify-between border-b border-[#202028] pb-1.5">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Satisfaction client (CSAT)
            </h2>
            <span className="font-mono font-bold text-amber-400">4,6 / 5</span>
          </div>

          <div className="h-24 w-full">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={CSAT_TREND} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <XAxis dataKey="date" stroke="#71717a" fontSize={8} tickLine={false} />
                  <YAxis domain={[4.0, 5.0]} stroke="#71717a" fontSize={8} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#141418',
                      borderColor: '#282834',
                      borderRadius: '8px',
                      fontSize: '10px',
                      color: '#fff',
                    }}
                  />
                  <Line type="monotone" dataKey="csat" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: KB metrics, FAQs, and Ticket Queue matching Reference #39 Screen 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left: Utilisation KB & FAQ populaires (span-5) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Utilisation KB */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-2">
            <div className="flex items-center justify-between border-b border-[#202028] pb-2">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Utilisation de la base de connaissances
              </h2>
              <Link href="/helpdesk/kb" className="text-[10px] text-red-400 hover:underline">
                Accéder &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2 rounded bg-[#16161c] border border-[#202028]">
                <span className="text-[10px] text-zinc-400">Vues articles</span>
                <div className="font-mono font-bold text-white text-sm mt-0.5">356</div>
                <span className="text-[9px] text-emerald-400 font-semibold">↑ 26,4%</span>
              </div>
              <div className="p-2 rounded bg-[#16161c] border border-[#202028]">
                <span className="text-[10px] text-zinc-400">Recherches</span>
                <div className="font-mono font-bold text-cyan-400 text-sm mt-0.5">242</div>
                <span className="text-[9px] text-emerald-400 font-semibold">↑ 18,1%</span>
              </div>
              <div className="p-2 rounded bg-[#16161c] border border-[#202028]">
                <span className="text-[10px] text-zinc-400">Articles utiles</span>
                <div className="font-mono font-bold text-emerald-400 text-sm mt-0.5">89%</div>
                <span className="text-[9px] text-emerald-400 font-semibold">↑ 6%</span>
              </div>
            </div>
          </div>

          {/* FAQ populaires */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-2">
            <div className="flex items-center justify-between border-b border-[#202028] pb-2">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                FAQ populaires
              </h2>
              <Link href="/helpdesk/kb" className="text-[10px] text-zinc-400 hover:underline">
                Voir toutes les FAQ &rarr;
              </Link>
            </div>

            <div className="space-y-1.5 text-[11px]">
              {[
                { q: 'Comment suivre ma commande ?', v: 156 },
                { q: 'Quels sont les délais de livraison ?', v: 98 },
                { q: 'Comment effectuer un retour ?', v: 74 },
                { q: 'Quels sont les modes de paiement acceptés ?', v: 58 },
                { q: 'Comment changer mes informations personnelles ?', v: 42 },
              ].map((faq, i) => (
                <div key={i} className="flex items-center justify-between p-1.5 rounded hover:bg-[#16161c] transition-colors">
                  <span className="text-zinc-200 truncate">{faq.q}</span>
                  <span className="font-mono text-[10px] text-zinc-400 shrink-0 ml-2">{faq.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: File d'attente des tickets (span-7) */}
        <div className="lg:col-span-7 rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#202028] pb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              File d&apos;attente des tickets récents
            </h2>
            <Link href="/helpdesk/tickets/new" className="text-[10px] text-red-400 hover:underline font-semibold">
              + Créer un ticket
            </Link>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#202028]">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase">
                  <th className="py-2 px-2.5">ID / Sujet</th>
                  <th className="py-2 px-2.5">Client</th>
                  <th className="py-2 px-2.5 text-center">Priorité</th>
                  <th className="py-2 px-2.5">Assigné à</th>
                  <th className="py-2 px-2.5 text-center">Statut</th>
                  <th className="py-2 px-2.5 font-mono text-center">SLA</th>
                  <th className="py-2 px-2.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24]">
                {RECENT_TICKETS.map((t) => (
                  <tr key={t.id} className="hover:bg-[#18181f] transition-colors">
                    <td className="py-2 px-2.5">
                      <Link href={`/helpdesk/tickets/${t.code}`} className="font-mono font-bold text-white hover:text-red-400 hover:underline">
                        {t.code}
                      </Link>
                      <div className="text-[10px] text-zinc-400 truncate max-w-[140px]">{t.subject}</div>
                    </td>
                    <td className="py-2 px-2.5 font-semibold text-zinc-200 truncate max-w-[100px]">
                      {t.client}
                    </td>
                    <td className="py-2 px-2.5 text-center">
                      <span
                        className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                          t.priority === 'Élevée'
                            ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                            : t.priority === 'Moyenne'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-2 px-2.5 text-zinc-300 truncate max-w-[90px]">
                      {t.assignedTo}
                    </td>
                    <td className="py-2 px-2.5 text-center">
                      <span
                        className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                          t.status === 'En cours'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : t.status === 'Nouveau'
                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                            : t.status === 'Résolu'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-2 px-2.5 font-mono text-[10px] text-center font-bold text-cyan-400">
                      {t.sla}
                    </td>
                    <td className="py-2 px-2.5 text-center">
                      <Link
                        href={`/helpdesk/tickets/${t.code}`}
                        className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="Ouvrir le ticket"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
