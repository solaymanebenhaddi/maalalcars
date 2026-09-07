'use client'

import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

const SALES_TREND = [
  { month: 'Mai 24', sales: 120000 },
  { month: 'Juil. 24', sales: 155000 },
  { month: 'Sept. 24', sales: 168000 },
  { month: 'Nov. 24', sales: 175000 },
  { month: 'Janv. 25', sales: 170000 },
  { month: 'Mars 25', sales: 205000 },
  { month: 'Mai 25', sales: 218450 },
]

const SALES_BY_STATUS = [
  { name: 'Finalisées', count: 62, color: '#10b981' },
  { name: 'En cours', count: 18, color: '#06b6d4' },
  { name: 'Annulées', count: 6, color: '#ef4444' },
]

const BEST_SALES = [
  { id: 1, vehicle: 'Toyota Land Cruiser', client: 'Imane Zahri', date: '20/05/2025', amount: '28 500 €' },
  { id: 2, vehicle: 'BMW X5', client: 'Sarah Benali', date: '19/05/2025', amount: '26 500 €' },
  { id: 3, vehicle: 'Mercedes-Benz GLC', client: 'Karim Tazi', date: '18/05/2025', amount: '24 900 €' },
  { id: 4, vehicle: 'Audi Q7', client: 'Omar Bennis', date: '26/05/2025', amount: '21 400 €' },
  { id: 5, vehicle: 'Toyota Hilux', client: 'Youssef M.', date: '25/05/2025', amount: '19 800 €' },
]

const BRAND_SALES_BARS = [
  { name: 'Toyota', percentage: 28 },
  { name: 'BMW', percentage: 21 },
  { name: 'Mercedes-Benz', percentage: 18 },
  { name: 'Audi', percentage: 15 },
  { name: 'Autres', percentage: 18 },
]

export default function ReportsSalesPage() {
  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/reports"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour au tableau de bord</span>
        </Link>

        <div className="flex items-center gap-2">
          <input
            type="text"
            defaultValue="01/05/2025 - 31/05/2025"
            className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs font-mono text-zinc-300 focus:outline-none"
          />

          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <Download className="h-3.5 w-3.5 text-zinc-400" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Main Container matching Reference #27 Screen 3 (Rapport Ventes) */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white">
            Rapport Ventes
          </h1>
          <p className="text-xs text-zinc-400">
            Analyse détaillée des transactions commerciales, volumes et conversion
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs">
          <button className="font-bold text-white relative pb-1">
            <span>Aperçu</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold">Détails des ventes</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Clients</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Véhicules</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Tendances</button>
        </div>

        {/* 5 KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Ventes totales</div>
            <div className="font-mono font-black text-white text-base mt-1">218 450 €</div>
            <div className="text-[9px] text-cyan-400 font-semibold">↑ 18,7%</div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Nombre de ventes</div>
            <div className="font-mono font-black text-emerald-400 text-base mt-1">86</div>
            <div className="text-[9px] text-emerald-400 font-semibold">↑ 33,3%</div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Panier moyen</div>
            <div className="font-mono font-black text-white text-base mt-1">2 540 €</div>
            <div className="text-[9px] text-emerald-400 font-semibold">↑ 4,7%</div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Taux de conversion</div>
            <div className="font-mono font-black text-emerald-400 text-base mt-1">22,6 %</div>
            <div className="text-[9px] text-emerald-400 font-semibold">↑ 2,3 pts</div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center col-span-2 sm:col-span-1">
            <div className="text-[10px] text-zinc-400">Ventes récurrentes</div>
            <div className="font-mono font-black text-white text-base mt-1">28 %</div>
            <div className="text-[9px] text-emerald-400 font-semibold">↑ 3,1 pts</div>
          </div>
        </div>

        {/* Row 1: Évolution des ventes + Ventes par statut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col justify-between h-[230px]">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Évolution des ventes
            </h3>

            <div className="h-[160px] w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SALES_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#22222a" vertical={false} />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={8} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" fontSize={8} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-[#2a2a34] bg-[#18181f]/95 p-1.5 text-[10px] shadow-2xl">
                            <span className="font-bold text-white">{label}: </span>
                            <span className="font-mono text-red-400 font-bold">
                              {Number(payload[0]?.value).toLocaleString('fr-FR')} €
                            </span>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line type="monotone" dataKey="sales" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: '#ef4444' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ventes par statut */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col justify-between h-[230px]">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Ventes par statut
            </h3>

            <div className="grid grid-cols-2 items-center gap-2 flex-1">
              <div className="relative h-[120px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={SALES_BY_STATUS}
                      cx="50%"
                      cy="50%"
                      innerRadius={32}
                      outerRadius={50}
                      paddingAngle={2}
                      dataKey="count"
                    >
                      {SALES_BY_STATUS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#16161c" strokeWidth={2} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-mono text-xs font-black text-white">86</span>
                  <span className="text-[7px] text-zinc-400 uppercase font-bold">Ventes</span>
                </div>
              </div>

              <div className="space-y-1 text-[9px]">
                {SALES_BY_STATUS.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1 truncate pr-1">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-zinc-300 truncate">{item.name}</span>
                    </div>
                    <span className="font-mono text-zinc-400 font-semibold">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Meilleures ventes + Ventes par marque */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Meilleures ventes
            </h3>

            <div className="overflow-x-auto rounded-lg border border-[#202028]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#202028] bg-[#18181f] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    <th className="py-2 px-3 font-mono">#</th>
                    <th className="py-2 px-3">Véhicule</th>
                    <th className="py-2 px-3">Client</th>
                    <th className="py-2 px-3 font-mono">Date</th>
                    <th className="py-2 px-3 text-right font-mono">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                  {BEST_SALES.map((s) => (
                    <tr key={s.id} className="hover:bg-[#18181f]">
                      <td className="py-2 px-3 font-mono text-zinc-500">{s.id}</td>
                      <td className="py-2 px-3 font-semibold text-white">{s.vehicle}</td>
                      <td className="py-2 px-3 text-zinc-300">{s.client}</td>
                      <td className="py-2 px-3 font-mono text-zinc-400">{s.date}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-emerald-400">{s.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ventes par marque */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col justify-between">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Ventes par marque
            </h3>

            <div className="space-y-2 py-1 flex-1 flex flex-col justify-center">
              {BRAND_SALES_BARS.map((brand) => (
                <div key={brand.name} className="space-y-0.5 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-zinc-300">{brand.name}</span>
                    <span className="font-mono text-zinc-400 font-bold">{brand.percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#1e1e24] overflow-hidden">
                    <div
                      className="h-full bg-red-600 rounded-full"
                      style={{ width: `${brand.percentage * 3}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
