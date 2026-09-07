'use client'

import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts'

const PNL_BAR_DATA = [
  { month: 'Déc.', net: 85000 },
  { month: 'Janv.', net: 92000 },
  { month: 'Févr.', net: 105000 },
  { month: 'Mars', net: 110000 },
  { month: 'Avr.', net: 109800 },
  { month: 'Mai', net: 126280 },
]

const EXPENSES_BREAKDOWN = [
  { name: 'Achats véhicules', amount: 112750, percentage: 40.8, color: '#06b6d4' },
  { name: 'Frais de personnel', amount: 56000, percentage: 25.6, color: '#f59e0b' },
  { name: 'Loyer & charges', amount: 12000, percentage: 10.8, color: '#ef4444' },
  { name: 'Marketing & publicité', amount: 4600, percentage: 7.6, color: '#10b981' },
  { name: 'Autres charges', amount: 37070, percentage: 15.2, color: '#8b5cf6' },
]

export default function PnLPage() {
  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/finance"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour au tableau de bord</span>
        </Link>
      </div>

      {/* Main Container matching Reference #23 Screen 3 (P&L) */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
          <div>
            <h1 className="text-base sm:text-lg font-black text-white">
              Compte de résultat (P&amp;L)
            </h1>
            <p className="text-xs text-zinc-400">
              Finance &gt; Compte de résultat
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 focus:outline-none">
              <option>Ce mois</option>
              <option>Ce trimestre</option>
              <option>Cette année</option>
            </select>

            <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
              <Download className="h-3.5 w-3.5 text-zinc-400" />
              <span>Exporter</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column: Left KPI Box & Compte de résultat Table */}
          <div className="lg:col-span-2 space-y-4">
            {/* Top 3 KPI Ribbons */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
                <div className="text-[10px] text-zinc-400">Bénéfice net</div>
                <div className="font-mono font-black text-emerald-400 text-sm sm:text-base mt-1">126 280 DH</div>
                <div className="text-[9px] text-emerald-400 font-semibold mt-0.5">↑ 15,7% ce mois</div>
              </div>

              <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
                <div className="text-[10px] text-zinc-400">Marge bénéficiaire</div>
                <div className="font-mono font-black text-white text-sm sm:text-base mt-1">14,6%</div>
                <div className="text-[9px] text-zinc-500 mt-0.5">Sur ventes totales</div>
              </div>

              <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
                <div className="text-[10px] text-zinc-400">Ventes</div>
                <div className="font-mono font-black text-cyan-400 text-sm sm:text-base mt-1">865 200 DH</div>
                <div className="text-[9px] text-emerald-400 font-semibold mt-0.5">↑ 17,8% ce mois</div>
              </div>
            </div>

            {/* Compte de résultat Table */}
            <div className="overflow-x-auto rounded-xl border border-[#202028] bg-[#16161c]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#202028] bg-[#18181f] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Libellé</th>
                    <th className="py-2.5 px-3 text-right font-mono">Ce mois</th>
                    <th className="py-2.5 px-3 text-right font-mono">Mois dernier</th>
                    <th className="py-2.5 px-3 text-right font-mono">Cumul YTD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                  <tr>
                    <td className="py-2 px-3 font-semibold text-white">Ventes totales</td>
                    <td className="py-2 px-3 text-right font-mono text-cyan-400 font-bold">865 200 DH</td>
                    <td className="py-2 px-3 text-right font-mono text-zinc-400">733 650 DH</td>
                    <td className="py-2 px-3 text-right font-mono text-zinc-300">3 915 400 DH</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-zinc-300 pl-6">Coût des ventes</td>
                    <td className="py-2 px-3 text-right font-mono text-red-400">-612 450 DH</td>
                    <td className="py-2 px-3 text-right font-mono text-red-400/80">-528 300 DH</td>
                    <td className="py-2 px-3 text-right font-mono text-red-400/80">-2 785 700 DH</td>
                  </tr>
                  <tr className="bg-[#121216]/60">
                    <td className="py-2 px-3 font-bold text-white">Marge brute</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-emerald-400">252 750 DH</td>
                    <td className="py-2 px-3 text-right font-mono text-zinc-300">205 350 DH</td>
                    <td className="py-2 px-3 text-right font-mono text-zinc-200">1 129 700 DH</td>
                  </tr>

                  {/* Charges d'exploitation */}
                  <tr>
                    <td colSpan={4} className="py-1 px-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider bg-[#141418]">
                      Charges d&apos;exploitation
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 text-zinc-300 pl-6">Frais de personnel</td>
                    <td className="py-1.5 px-3 text-right font-mono text-red-400">-56 000 DH</td>
                    <td className="py-1.5 px-3 text-right font-mono text-zinc-400">-52 000 DH</td>
                    <td className="py-1.5 px-3 text-right font-mono text-zinc-300">-247 000 DH</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 text-zinc-300 pl-6">Loyer &amp; charges</td>
                    <td className="py-1.5 px-3 text-right font-mono text-red-400">-12 000 DH</td>
                    <td className="py-1.5 px-3 text-right font-mono text-zinc-400">-12 000 DH</td>
                    <td className="py-1.5 px-3 text-right font-mono text-zinc-300">-60 000 DH</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 text-zinc-300 pl-6">Marketing &amp; publicité</td>
                    <td className="py-1.5 px-3 text-right font-mono text-red-400">-4 600 DH</td>
                    <td className="py-1.5 px-3 text-right font-mono text-zinc-400">-4 800 DH</td>
                    <td className="py-1.5 px-3 text-right font-mono text-zinc-300">-26 200 DH</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-3 text-zinc-300 pl-6">Autres charges</td>
                    <td className="py-1.5 px-3 text-right font-mono text-red-400">-37 070 DH</td>
                    <td className="py-1.5 px-3 text-right font-mono text-zinc-400">-31 750 DH</td>
                    <td className="py-1.5 px-3 text-right font-mono text-zinc-300">-155 650 DH</td>
                  </tr>
                  <tr className="bg-[#121216]/60">
                    <td className="py-2 px-3 font-semibold text-zinc-300">Total charges d&apos;exploitation</td>
                    <td className="py-2 px-3 text-right font-mono text-red-400 font-bold">-126 470 DH</td>
                    <td className="py-2 px-3 text-right font-mono text-red-400/80">-113 050 DH</td>
                    <td className="py-2 px-3 text-right font-mono text-red-400/80">-600 850 DH</td>
                  </tr>
                  <tr className="bg-emerald-500/10 border-t border-emerald-500/30">
                    <td className="py-2.5 px-3 font-black text-white text-xs">Bénéfice net</td>
                    <td className="py-2.5 px-3 text-right font-mono font-black text-emerald-400 text-sm">126 280 DH</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400/80">92 300 DH</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400/80">539 050 DH</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: 2 Visual Charts */}
          <div className="space-y-4">
            {/* Évolution du résultat net */}
            <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 h-[210px] flex flex-col justify-between">
              <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
                Évolution du résultat net
              </h3>

              <div className="h-[140px] w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PNL_BAR_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#22222a" vertical={false} />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#6b7280" fontSize={8} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border border-[#2a2a34] bg-[#18181f]/95 p-1.5 text-[10px] shadow-2xl">
                              <span className="font-bold text-white">{label}: </span>
                              <span className="font-mono text-emerald-400 font-bold">
                                {Number(payload[0]?.value).toLocaleString('fr-FR')} DH
                              </span>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="net" fill="#10b981" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Répartition des charges */}
            <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 h-[210px] flex flex-col justify-between">
              <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
                Répartition des charges
              </h3>

              <div className="grid grid-cols-2 items-center gap-2 flex-1">
                <div className="relative h-[110px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={EXPENSES_BREAKDOWN}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={48}
                        paddingAngle={2}
                        dataKey="amount"
                      >
                        {EXPENSES_BREAKDOWN.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="#16161c" strokeWidth={2} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-1 text-[9px]">
                  {EXPENSES_BREAKDOWN.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-1 truncate pr-1">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-zinc-300 truncate">{item.name}</span>
                      </div>
                      <span className="font-mono text-zinc-400 shrink-0 font-semibold">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
