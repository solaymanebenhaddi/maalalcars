'use client'

import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
} from 'lucide-react'

interface ExportItem {
  id: string
  title: string
  desc: string
  formats: ('Excel' | 'PDF' | 'CSV')[]
}

const EXPORTS_LIST: ExportItem[] = [
  { id: 'exp1', title: 'Rapport ventes (détaillé)', desc: 'Exporter les ventes par véhicule et commercial', formats: ['Excel', 'CSV'] },
  { id: 'exp2', title: 'Rapport profits & marges', desc: 'Exporter les profits et marges unitaires', formats: ['Excel', 'PDF'] },
  { id: 'exp3', title: 'Rapport dépenses', desc: 'Exporter les dépenses par catégorie', formats: ['Excel', 'CSV'] },
  { id: 'exp4', title: 'Rapport stock & rotation', desc: 'Exporter le stock valorisé et la rotation', formats: ['Excel', 'CSV'] },
  { id: 'exp5', title: 'Rapport activité globale', desc: 'Synthèse exécutive et reporting financier', formats: ['Excel', 'PDF'] },
]

const RECENT_EXPORTS = [
  { id: 1, name: 'Rapport ventes - Mai 2025', date: '01/06/2025 10:24', format: 'Excel' },
  { id: 2, name: 'Rapport stock - Mai 2025', date: '01/06/2025 09:15', format: 'CSV' },
  { id: 3, name: 'Rapport profits - Mai 2025', date: '31/05/2025 18:45', format: 'PDF' },
]

export default function ReportsExportsPage() {
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
      </div>

      {/* Main Container matching Reference #27 Screen 5 (Exports & Comparaisons) */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white">
            Exports &amp; Comparaisons
          </h1>
          <p className="text-xs text-zinc-400">
            Centre de téléchargement des données brutes et comparaison de périodes
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs">
          <button className="font-bold text-white relative pb-1">
            <span>Exports</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold">Comparaison</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Planification</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Exports disponibles + Récents */}
          <div className="lg:col-span-2 space-y-5">
            {/* Exports disponibles */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white">Exports disponibles</h3>

              <div className="space-y-2">
                {EXPORTS_LIST.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3 rounded-xl border border-[#24242e] bg-[#16161c] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-zinc-500 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-white text-xs">{exp.title}</div>
                      <div className="text-[10px] text-zinc-400">{exp.desc}</div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {exp.formats.map((fmt) => (
                        <button
                          key={fmt}
                          className="flex items-center gap-1 rounded border border-[#282834] bg-[#121216] px-2.5 py-1 text-[10px] font-bold text-zinc-300 hover:text-white hover:border-red-500 transition-colors"
                        >
                          <Download className="h-3 w-3 text-red-500" />
                          <span>{fmt}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exports récents */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-white">Exports récents</h3>

              <div className="overflow-x-auto rounded-lg border border-[#202028]">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#202028] bg-[#18181f] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                      <th className="py-2 px-3">Nom du fichier</th>
                      <th className="py-2 px-3 font-mono">Date de génération</th>
                      <th className="py-2 px-3 text-center">Format</th>
                      <th className="py-2 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                    {RECENT_EXPORTS.map((r) => (
                      <tr key={r.id} className="hover:bg-[#18181f]">
                        <td className="py-2.5 px-3 font-semibold text-white">{r.name}</td>
                        <td className="py-2.5 px-3 font-mono text-zinc-400 text-[10px]">{r.date}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="rounded bg-zinc-800 px-2 py-0.5 text-[9px] font-mono text-zinc-300">
                            {r.format}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button className="text-red-400 hover:text-red-300 p-1">
                            <Download className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right 1 Col: Comparaison de périodes */}
          <div className="space-y-4">
            {/* Widget Comparaison */}
            <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
              <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
                Comparaison de périodes
              </h3>

              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] text-zinc-400 pb-1">Période actuelle vs Période N-1</label>
                  <input
                    type="text"
                    defaultValue="01/05/2025 - 31/05/2025"
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#121216] px-2.5 text-xs font-mono text-white focus:outline-none"
                  />
                </div>

                <button className="w-full rounded-lg bg-red-600 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors">
                  Comparer
                </button>
              </div>
            </div>

            {/* Aperçu comparaison */}
            <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
              <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
                Aperçu comparaison
              </h3>

              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Ventes totales</span>
                  <div className="text-right">
                    <span className="font-mono font-bold text-white">218 450 € </span>
                    <span className="text-[10px] text-emerald-400 font-bold">↑ 18,7%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Bénéfice net</span>
                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-400">36 950 € </span>
                    <span className="text-[10px] text-emerald-400 font-bold">↑ 14,6%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Dépenses totales</span>
                  <div className="text-right">
                    <span className="font-mono font-bold text-white">24 700 € </span>
                    <span className="text-[10px] text-red-400 font-bold">↓ 5,1%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Transactions</span>
                  <div className="text-right">
                    <span className="font-mono font-bold text-white">86 </span>
                    <span className="text-[10px] text-emerald-400 font-bold">↑ 33,3%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Panier moyen</span>
                  <div className="text-right">
                    <span className="font-mono font-bold text-white">2 540 € </span>
                    <span className="text-[10px] text-emerald-400 font-bold">↑ 4,7%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-[#202028] pt-1.5">
                  <span className="text-zinc-400">Marge bénéficiaire</span>
                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-400">16,9 % </span>
                    <span className="text-[10px] text-emerald-400 font-bold">↑ 2,1 pts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
