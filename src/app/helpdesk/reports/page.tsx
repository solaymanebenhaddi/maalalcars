'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  TrendingUp,
  Download,
  Calendar,
  ArrowUpRight,
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
  CartesianGrid,
} from 'recharts'

const emptySubscribe = () => () => {}
function useMounted() {
  return React.useSyncExternalStore(emptySubscribe, () => true, () => false)
}

const SLA_DATA = [
  { name: 'Respectés', value: 92, color: '#10b981' },
  { name: 'Risques', value: 6, color: '#f59e0b' },
  { name: 'En retard', value: 2, color: '#ef4444' },
]

const TICKETS_DATA = [
  { name: 'Nouveau', value: 28, color: '#3b82f6' },
  { name: 'En cours', value: 30, color: '#f59e0b' },
  { name: 'En attente', value: 40, color: '#06b6d4' },
  { name: 'Résolu', value: 30, color: '#10b981' },
]

const TICKETS_EVOLUTION = [
  { day: '15 Mai', recus: 22, resolus: 18 },
  { day: '22 Mai', recus: 28, resolus: 25 },
  { day: '29 Mai', recus: 24, resolus: 22 },
  { day: '5 Juin', recus: 32, resolus: 30 },
  { day: '12 Juin', recus: 26, resolus: 27 },
]

const TOP_AGENTS = [
  { name: 'Sarah El Amrani', resolved: 42, sla: '96%', csat: '4,8', fcr: '82%' },
  { name: 'Omar Tazi', resolved: 35, sla: '93%', csat: '4,6', fcr: '76%' },
  { name: 'Nadia Benmoussa', resolved: 28, sla: '90%', csat: '4,5', fcr: '72%' },
  { name: 'Youssef M.', resolved: 23, sla: '88%', csat: '4,3', fcr: '70%' },
]

export default function HelpdeskReportsPage() {
  const [activeTab, setActiveTab] = useState('Vue d’ensemble')
  const isMounted = useMounted()

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Top Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-zinc-400">
          <Link
            href="/helpdesk"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Tableau de bord</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300">Support</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="font-semibold text-white">Rapports SLA &amp; Satisfaction</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs text-zinc-300">
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            <span>15/05/2025 - 15/06/2025</span>
          </div>

          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <Download className="h-3.5 w-3.5" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="border-b border-[#222228] pb-3">
        <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-red-500" />
          <span>Rapports de performance SLA &amp; Satisfaction</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Analysez la qualité de service, le temps de réponse et la productivité de l&apos;équipe support.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#222228] pb-1">
        {['Vue d’ensemble', 'SLA', 'Satisfaction', 'Tickets', 'Agents'].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors ${
              activeTab === t
                ? 'border-b-2 border-red-500 text-white bg-[#141418]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* 5 KPI Cards matching Reference #39 Screen 5 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
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
          <div className="text-[10px] text-emerald-400 mt-1">↓ 15m</div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Temps résolution moyen</span>
          <div className="text-xl font-black font-mono text-white mt-1">18h 45m</div>
          <div className="text-[10px] text-emerald-400 mt-1">↓ 2h 12m</div>
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

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Résolution au 1er contact</span>
          <div className="text-xl font-black font-mono text-emerald-400 mt-1">76%</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 4%</span>
          </div>
        </div>
      </div>

      {/* Middle Row: 3 Donut/Charts matching Reference #39 Screen 5 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Chart 1: Performance SLA */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl flex flex-col justify-between">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-1.5">
            Performance SLA
          </h2>

          <div className="flex items-center justify-between my-2">
            <div className="relative h-24 w-24 shrink-0">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={SLA_DATA}
                      innerRadius={30}
                      outerRadius={42}
                      dataKey="value"
                    >
                      {SLA_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-mono font-bold text-xs text-emerald-400">92%</span>
                <span className="text-[8px] text-zinc-400">Respectés</span>
              </div>
            </div>

            <div className="space-y-1 text-[10px] w-full max-w-[120px]">
              <div className="flex items-center justify-between">
                <span className="text-zinc-300">Respectés</span>
                <span className="font-mono font-bold text-emerald-400">92%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-300">Risques</span>
                <span className="font-mono font-bold text-amber-400">6%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-300">En retard</span>
                <span className="font-mono font-bold text-red-400">2%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Tickets par statut */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl flex flex-col justify-between">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-1.5">
            Tickets par statut
          </h2>

          <div className="flex items-center justify-between my-2">
            <div className="relative h-24 w-24 shrink-0">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={TICKETS_DATA}
                      innerRadius={30}
                      outerRadius={42}
                      dataKey="value"
                    >
                      {TICKETS_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-mono font-bold text-xs text-white">128</span>
                <span className="text-[8px] text-zinc-400">Total</span>
              </div>
            </div>

            <div className="space-y-1 text-[10px] w-full max-w-[120px]">
              <div className="flex items-center justify-between">
                <span className="text-zinc-300">Nouveau</span>
                <span className="font-mono font-bold text-white">28</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-300">En cours</span>
                <span className="font-mono font-bold text-amber-400">30</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-300">En attente</span>
                <span className="font-mono font-bold text-cyan-400">40</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-300">Résolu</span>
                <span className="font-mono font-bold text-emerald-400">30</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 3: Satisfaction (CSAT) */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#202028] pb-1.5">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Satisfaction (CSAT)
            </h2>
            <span className="font-mono font-bold text-amber-400">4,6 / 5</span>
          </div>

          <div className="space-y-2 my-auto text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-300">Note moyenne</span>
              <span className="font-mono font-bold text-amber-400">4,6 / 5 ★</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-300">Avis 5 étoiles</span>
              <span className="font-mono font-bold text-emerald-400">78%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-300">Avis 4 étoiles</span>
              <span className="font-mono font-bold text-cyan-400">16%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-300">Avis &lt; 3 étoiles</span>
              <span className="font-mono font-bold text-red-400">6%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Top agents & Evolution des tickets matching Reference #39 Screen 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Top agents (span-6) */}
        <div className="lg:col-span-6 rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-2">
            Top agents du support
          </h2>

          <div className="overflow-x-auto rounded-lg border border-[#202028]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase">
                  <th className="py-2 px-2.5">Agent</th>
                  <th className="py-2 px-2.5 font-mono text-center">Résolus</th>
                  <th className="py-2 px-2.5 font-mono text-center">SLA</th>
                  <th className="py-2 px-2.5 font-mono text-center">CSAT</th>
                  <th className="py-2 px-2.5 font-mono text-right">1er Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                {TOP_AGENTS.map((agent, i) => (
                  <tr key={i} className="hover:bg-[#18181f] transition-colors">
                    <td className="py-2 px-2.5 font-semibold text-white">{agent.name}</td>
                    <td className="py-2 px-2.5 font-mono text-center text-zinc-200">{agent.resolved}</td>
                    <td className="py-2 px-2.5 font-mono text-center font-bold text-emerald-400">{agent.sla}</td>
                    <td className="py-2 px-2.5 font-mono text-center text-amber-400">{agent.csat}</td>
                    <td className="py-2 px-2.5 font-mono text-right text-cyan-400">{agent.fcr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Évolution des tickets reçus vs résolus (span-6) */}
        <div className="lg:col-span-6 rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#202028] pb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Évolution des tickets (Reçus vs Résolus)
            </h2>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                Reçus
              </span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Résolus
              </span>
            </div>
          </div>

          <div className="h-44 w-full">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TICKETS_EVOLUTION} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#202028" />
                  <XAxis dataKey="day" stroke="#71717a" fontSize={10} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#141418',
                      borderColor: '#282834',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: '#fff',
                    }}
                  />
                  <Line type="monotone" dataKey="recus" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="resolus" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
