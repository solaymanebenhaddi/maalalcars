'use client'

import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
  Car,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

const STOCK_EVOLUTION = [
  { month: 'Déc.', stock: 950000 },
  { month: 'Janv.', stock: 1050000 },
  { month: 'Févr.', stock: 1120000 },
  { month: 'Mars', stock: 1180000 },
  { month: 'Avr.', stock: 1184000 },
  { month: 'Mai', stock: 1248500 },
]

const TOP_VEHICLES = [
  { id: 1, name: 'Toyota Land Cruiser 2023', amount: '245 000 DH' },
  { id: 2, name: 'BMW X5 2021', amount: '192 000 DH' },
  { id: 3, name: 'Mercedes-Benz GLC 2022', amount: '154 000 DH' },
  { id: 4, name: 'Audi Q7 2020', amount: '138 000 DH' },
  { id: 5, name: 'Ford Ranger 4x4 2022', amount: '136 000 DH' },
]

const CATEGORY_ROWS = [
  { name: 'SUV', amount: '484 250 DH', pct: '38,9%', count: 12, avgPrice: '40 354 DH' },
  { name: 'Berlines', amount: '312 400 DH', pct: '25,0%', count: 9, avgPrice: '34 711 DH' },
  { name: '4x4 & Pick-up', amount: '228 900 DH', pct: '18,3%', count: 6, avgPrice: '38 150 DH' },
  { name: 'Citadines', amount: '148 950 DH', pct: '11,9%', count: 7, avgPrice: '21 279 DH' },
  { name: 'Utilitaires', amount: '72 000 DH', pct: '5,8%', count: 3, avgPrice: '24 000 DH' },
]

export default function StockCapitalPage() {
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

      {/* Main Container matching Reference #23 Screen 4 (Stock Capital) */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
          <div>
            <h1 className="text-base sm:text-lg font-black text-white">
              Capital du stock
            </h1>
            <p className="text-xs text-zinc-400">
              Finance &gt; Capital du stock
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

        {/* 4 Top KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Capital du stock</div>
            <div className="font-mono font-black text-cyan-400 text-sm sm:text-base mt-1">1 248 500 DH</div>
            <div className="text-[9px] text-emerald-400 font-semibold mt-0.5">↑ 5,4% ce mois</div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Nombre de véhicules</div>
            <div className="font-mono font-black text-white text-sm sm:text-base mt-1">37</div>
            <div className="text-[9px] text-zinc-500 mt-0.5">0 ce mois</div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Prix moyen/véhicule</div>
            <div className="font-mono font-black text-white text-sm sm:text-base mt-1">33 743 DH</div>
            <div className="text-[9px] text-emerald-400 font-semibold mt-0.5">↑ 2,1% ce mois</div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Rotation du stock</div>
            <div className="font-mono font-black text-amber-400 text-sm sm:text-base mt-1">1,8 mois</div>
            <div className="text-[9px] text-red-400 font-semibold mt-0.5">↓ 0,2 ce mois</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left 2 Cols: Répartition par catégorie */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold text-white">Répartition par catégorie</h3>

            <div className="overflow-x-auto rounded-xl border border-[#202028] bg-[#16161c]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#202028] bg-[#18181f] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Catégorie</th>
                    <th className="py-2.5 px-3 text-right font-mono">Capital (DH)</th>
                    <th className="py-2.5 px-3 text-right font-mono">%</th>
                    <th className="py-2.5 px-3 text-center font-mono">Nb véhicules</th>
                    <th className="py-2.5 px-3 text-right font-mono">Prix moyen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                  {CATEGORY_ROWS.map((c) => (
                    <tr key={c.name} className="hover:bg-[#18181f] transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-white">{c.name}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-cyan-400">{c.amount}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-zinc-300">{c.pct}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-white">{c.count}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-zinc-300">{c.avgPrice}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#121216] font-bold border-t border-[#202028]">
                    <td className="py-2.5 px-3 text-white">Total</td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-400 font-bold">1 248 500 DH</td>
                    <td className="py-2.5 px-3 text-right font-mono text-zinc-300">100%</td>
                    <td className="py-2.5 px-3 text-center font-mono text-white">37</td>
                    <td className="py-2.5 px-3 text-right font-mono text-white">33 743 DH</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Right 1 Col: Évolution du capital & Top 5 Véhicules */}
          <div className="space-y-4">
            {/* Évolution du capital en stock */}
            <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 h-[200px] flex flex-col justify-between">
              <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
                Évolution du capital en stock
              </h3>

              <div className="h-[130px] w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={STOCK_EVOLUTION} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#22222a" vertical={false} />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#6b7280" fontSize={8} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border border-[#2a2a34] bg-[#18181f]/95 p-1.5 text-[10px] shadow-2xl">
                              <span className="font-bold text-white">{label}: </span>
                              <span className="font-mono text-cyan-400 font-bold">
                                {Number(payload[0]?.value).toLocaleString('fr-FR')} DH
                              </span>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Area type="monotone" dataKey="stock" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorStock)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top 5 véhicules */}
            <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-2">
              <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
                Top 5 véhicules <span className="text-[10px] text-zinc-500 font-normal">(capital immobilisé)</span>
              </h3>

              <div className="space-y-1.5 text-[11px]">
                {TOP_VEHICLES.map((v) => (
                  <div key={v.id} className="flex items-center justify-between p-1.5 rounded-lg bg-[#121216] border border-[#202028]">
                    <div className="flex items-center gap-2 truncate pr-1">
                      <span className="font-mono text-zinc-500 text-[10px] font-bold w-3">{v.id}</span>
                      <Car className="h-3 w-3 text-zinc-400 shrink-0" />
                      <span className="text-zinc-200 truncate">{v.name}</span>
                    </div>
                    <span className="font-mono font-bold text-white shrink-0 text-xs">{v.amount}</span>
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
