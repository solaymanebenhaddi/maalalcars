'use client'

import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
} from 'lucide-react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const STOCK_TYPES = [
  { name: 'SUV', percentage: 40, color: '#06b6d4' },
  { name: 'Berlines', percentage: 30, color: '#f59e0b' },
  { name: '4x4', percentage: 15, color: '#ef4444' },
  { name: 'Utilitaires', percentage: 10, color: '#10b981' },
]

const AGING_BARS = [
  { range: '0 - 30 jours', count: 45, percentage: 35 },
  { range: '31 - 60 jours', count: 32, percentage: 25 },
  { range: '61 - 90 jours', count: 26, percentage: 20 },
  { range: '91 - 120 jours', count: 15, percentage: 12 },
  { range: '> 120 jours', count: 10, percentage: 8 },
]

const TOP_STOCK_VEHICLES = [
  { id: 1, name: 'Toyota Land Cruiser', year: 2023, km: '12 450 km', price: '72 500 €', days: 35 },
  { id: 2, name: 'BMW X5', year: 2021, km: '45 230 km', price: '48 900 €', days: 42 },
  { id: 3, name: 'Mercedes-Benz GLC', year: 2022, km: '28 900 km', price: '41 500 €', days: 55 },
  { id: 4, name: 'Audi Q7', year: 2020, km: '61 300 km', price: '36 500 €', days: 68 },
  { id: 5, name: 'Toyota Hilux', year: 2023, km: '18 750 km', price: '19 800 €', days: 95 },
]

export default function ReportsStockPage() {
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

      {/* Main Container matching Reference #27 Screen 4 (Rapport Stock / Rotation) */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white">
            Rapport Stock &amp; Rotation
          </h1>
          <p className="text-xs text-zinc-400">
            Inventaire valorisé, durée d&apos;immobilisation et alertes de vieillissement (Aging)
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs">
          <button className="font-bold text-white relative pb-1">
            <span>Aperçu</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold">Stock actuel</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Rotation</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Mouvements</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Alertes</button>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Stock total</div>
            <div className="font-mono font-black text-white text-base mt-1">128 <span className="text-xs text-zinc-400 font-normal">Véhicules</span></div>
            <div className="text-[9px] text-cyan-400 font-semibold">↑ 5,4% vs avril</div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Valeur totale</div>
            <div className="font-mono font-black text-white text-base mt-1">1 248 500 €</div>
            <div className="text-[9px] text-emerald-400 font-semibold">Capital valorisé</div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Stock disponible</div>
            <div className="font-mono font-black text-emerald-400 text-base mt-1">90 <span className="text-xs text-emerald-400/70 font-normal">Véhicules</span></div>
            <div className="text-[9px] text-zinc-500">Prêts à la vente</div>
          </div>

          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Valeur moyenne</div>
            <div className="font-mono font-black text-white text-base mt-1">24 000 €</div>
            <div className="text-[9px] text-zinc-500">Par véhicule</div>
          </div>
        </div>

        {/* Row 1: Éléments stock + Rotation + Véhicules lents */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Répartition par catégorie */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col justify-between h-[230px]">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Éléments en stock
            </h3>

            <div className="grid grid-cols-2 items-center gap-2 flex-1">
              <div className="relative h-[120px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={STOCK_TYPES}
                      cx="50%"
                      cy="50%"
                      innerRadius={32}
                      outerRadius={50}
                      paddingAngle={2}
                      dataKey="percentage"
                    >
                      {STOCK_TYPES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#16161c" strokeWidth={2} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-mono text-xs font-black text-white">128</span>
                  <span className="text-[7px] text-zinc-400 uppercase font-bold">Total</span>
                </div>
              </div>

              <div className="space-y-1 text-[9px]">
                {STOCK_TYPES.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1 truncate pr-1">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-zinc-300 truncate">{item.name}</span>
                    </div>
                    <span className="font-mono text-zinc-400 font-semibold">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rotation du stock */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col justify-between h-[230px] text-center">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2 text-left">
              Rotation du stock
            </h3>

            <div className="flex flex-col items-center justify-center flex-1 space-y-1">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-amber-500/30 bg-amber-500/10">
                <span className="font-mono font-black text-amber-400 text-lg">45 <span className="text-[10px] font-normal">j</span></span>
              </div>
              <div className="text-[10px] text-zinc-400 font-semibold">Durée moyenne</div>
              <div className="text-[9px] text-emerald-400 font-bold">↓ 8 jours vs avril</div>
            </div>
          </div>

          {/* Véhicules lents (>90 jours) */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col justify-between h-[230px]">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Véhicules lents (&gt; 90 jours)
            </h3>

            <div className="space-y-2 py-2 flex-1 flex flex-col justify-center">
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 space-y-1 text-center">
                <div className="font-mono font-black text-red-400 text-xl">2 véhicules</div>
                <div className="text-[10px] text-zinc-300">Valeur totale : <strong className="text-white font-mono">18 900 €</strong></div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#202028]">
              <span className="text-[10px] text-red-400 hover:text-red-300 font-semibold cursor-pointer">
                Voir la liste &rarr;
              </span>
            </div>
          </div>
        </div>

        {/* Row 2: Âge des stocks + Top véhicules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Âge des stocks */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Âge des stocks (Aging)
            </h3>

            <div className="space-y-2 py-1">
              {AGING_BARS.map((a) => (
                <div key={a.range} className="space-y-0.5 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-zinc-300">{a.range}</span>
                    <span className="font-mono font-bold text-white">{a.count} <span className="text-zinc-500 font-normal">({a.percentage}%)</span></span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#1e1e24] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        a.percentage >= 30 ? 'bg-cyan-500' : a.percentage >= 20 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${a.percentage * 2.5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top véhicules en stock */}
          <div className="lg:col-span-2 rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Top véhicules en stock
            </h3>

            <div className="overflow-x-auto rounded-lg border border-[#202028]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#202028] bg-[#18181f] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    <th className="py-2 px-3">Véhicule</th>
                    <th className="py-2 px-3 text-center font-mono">Année</th>
                    <th className="py-2 px-3 font-mono">Km</th>
                    <th className="py-2 px-3 text-right font-mono">Prix d&apos;achat</th>
                    <th className="py-2 px-3 text-center font-mono">Jours en stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                  {TOP_STOCK_VEHICLES.map((v) => (
                    <tr key={v.id} className="hover:bg-[#18181f]">
                      <td className="py-2 px-3 font-semibold text-white">{v.name}</td>
                      <td className="py-2 px-3 text-center font-mono text-zinc-400">{v.year}</td>
                      <td className="py-2 px-3 font-mono text-zinc-300">{v.km}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-white">{v.price}</td>
                      <td className="py-2 px-3 text-center font-mono font-bold text-amber-400">{v.days}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
