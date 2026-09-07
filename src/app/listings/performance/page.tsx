'use client'

import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  TrendingUp,
  Download,
  Calendar,
  ArrowUpRight,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const emptySubscribe = () => () => {}
function useMounted() {
  return React.useSyncExternalStore(emptySubscribe, () => true, () => false)
}

const PERFORMANCE_TREND = [
  { day: '1', vues: 450, leads: 5 },
  { day: '5', leads: 12, vues: 850 },
  { day: '10', leads: 18, vues: 1200 },
  { day: '15', leads: 32, vues: 1900 },
  { day: '20', leads: 48, vues: 2400 },
  { day: '25', leads: 65, vues: 2850 },
  { day: '30', leads: 82, vues: 3400 },
]

const SOURCES_DATA = [
  { name: 'Avito.ma', value: 95, percentage: '38,8%', color: '#ef4444' },
  { name: 'Moteur.ma', value: 60, percentage: '24,5%', color: '#f59e0b' },
  { name: 'Facebook', value: 40, percentage: '16,3%', color: '#3b82f6' },
  { name: 'Auto24.ma', value: 25, percentage: '10,2%', color: '#10b981' },
  { name: 'Autres', value: 25, percentage: '10,2%', color: '#71717a' },
]

export default function ListingPerformancePage() {
  const period = '01/05/2025 - 31/05/2025'
  const isMounted = useMounted()

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Top Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-zinc-400">
          <Link
            href="/listings"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour aux annonces</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300">Annonces</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="font-semibold text-white">Performance &amp; Leads</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs text-zinc-300">
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            <span>{period}</span>
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
          <span>Performance des annonces / Leads</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Suivez la portée de vos publications, l&apos;acquisition de prospects et l&apos;efficacité commerciale.
        </p>
      </div>

      {/* 5 KPI Cards matching Reference #38 Screen 5 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Vues totales</span>
          <div className="text-xl font-black font-mono text-white mt-1">24 850</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 15,3% vs mois dernier</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Clics</span>
          <div className="text-xl font-black font-mono text-cyan-400 mt-1">2 845</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 18,2% vs mois dernier</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Taux de clics (CTR)</span>
          <div className="text-xl font-black font-mono text-emerald-400 mt-1">11,45%</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 1,2 pts vs mois dernier</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Leads générés</span>
          <div className="text-xl font-black font-mono text-amber-400 mt-1">245</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 18,7% vs mois dernier</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Leads convertis</span>
          <div className="text-xl font-black font-mono text-emerald-400 mt-1">25</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 20,0% vs mois dernier</span>
          </div>
        </div>
      </div>

      {/* Main Analysis Grid matching Reference #38 Screen 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Évolution des vues et leads (span-7) */}
        <div className="lg:col-span-7 rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#202028] pb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Évolution des vues et leads (30 derniers jours)
            </h2>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                Vues
              </span>
              <span className="flex items-center gap-1 text-red-500 font-semibold">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Leads
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={PERFORMANCE_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  <Line type="monotone" dataKey="vues" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="leads" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right: Top Annonces & Sources Leads (span-5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Top annonces */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-2">
              Top annonces les plus performantes
            </h2>
            <div className="space-y-1.5 text-xs">
              {[
                { title: '1. Toyota Land Cruiser 2023', views: '1 245 vues', leads: '28 leads' },
                { title: '2. BMW X5 2022', views: '962 vues', leads: '21 leads' },
                { title: '3. Mercedes-Benz GLC 2021', views: '755 vues', leads: '16 leads' },
                { title: '4. Audi Q7 2022', views: '612 vues', leads: '12 leads' },
                { title: '5. Peugeot 3008 2021', views: '320 vues', leads: '5 leads' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded bg-[#16161c] border border-[#202028]">
                  <span className="font-bold text-white truncate max-w-[180px]">{item.title}</span>
                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <span className="text-zinc-400">{item.views}</span>
                    <span className="text-cyan-400 font-bold">{item.leads}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sources des leads (Donut Chart) */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-2">
              Sources des leads
            </h2>

            <div className="flex items-center justify-between">
              <div className="relative h-28 w-28 shrink-0">
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={SOURCES_DATA}
                        innerRadius={34}
                        outerRadius={46}
                        dataKey="value"
                      >
                        {SOURCES_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="font-mono font-bold text-xs text-white">245</span>
                  <span className="text-[8px] text-zinc-400">Leads</span>
                </div>
              </div>

              <div className="space-y-1 text-[10px] w-full max-w-[170px]">
                {SOURCES_DATA.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-zinc-300">{s.name}</span>
                    </div>
                    <span className="font-mono font-bold text-white">{s.percentage} ({s.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
