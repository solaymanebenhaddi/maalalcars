'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Download,
  Share2,
  Printer,
  Camera,
  GitCompare,
} from 'lucide-react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const SCORE_DISTRIBUTION = [
  { name: 'Excellent (90-100)', percentage: 35, color: '#10b981' },
  { name: 'Bon (75-89)', percentage: 34, color: '#06b6d4' },
  { name: 'Moyen (50-74)', percentage: 19, color: '#f59e0b' },
  { name: 'Faible (0-49)', percentage: 12, color: '#ef4444' },
]

export default function EvaluationDetailPage() {
  const params = useParams()
  const code = (params?.id as string) || 'EVAL-2025-0128'

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/evaluations"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour aux évaluations</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/evaluations/${code}/photos`}
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <Camera className="h-3.5 w-3.5 text-cyan-400" />
            <span>Photos &amp; Dommages (18)</span>
          </Link>

          <Link
            href={`/evaluations/${code}/compare`}
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <GitCompare className="h-3.5 w-3.5 text-amber-400" />
            <span>Comparatif Avant / Après</span>
          </Link>
        </div>
      </div>

      {/* Main Container matching Reference #25 Screen 25B */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-5 shadow-xl">
        {/* Vehicle Header Card */}
        <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-24 rounded-lg bg-[#1a1a24] border border-[#282834] flex items-center justify-center overflow-hidden shrink-0">
              <span className="font-bold text-zinc-500 text-xs">BMW Série 3</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white">
                  BMW Série 3 <span className="text-xs text-zinc-400 font-normal">(2021 • Berline)</span>
                </h1>
                <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  Validée
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono">
                <span className="font-bold text-zinc-200">AA-123-BB</span>
                <span>•</span>
                <span>WBA5R31070FK12345</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Circular Score Badge */}
            <div className="flex items-center gap-3 bg-[#121216] border border-[#22222c] px-4 py-2 rounded-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-500/10">
                <span className="font-mono font-black text-emerald-400 text-sm">86</span>
              </div>
              <div>
                <div className="text-[10px] text-zinc-400 uppercase font-semibold">Score global</div>
                <div className="font-bold text-white text-xs">86 / 100</div>
              </div>
            </div>

            <div className="text-[11px] space-y-1 text-zinc-400 border-l border-[#24242e] pl-4">
              <div>Inspecteur : <span className="text-white font-medium">Yacine Benali</span></div>
              <div>Date d&apos;évaluation : <span className="font-mono text-zinc-200">28/05/2025 14:32</span></div>
              <div>Kilométrage : <span className="font-mono text-zinc-200">45 230 km</span></div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs overflow-x-auto">
          <button className="font-bold text-white relative pb-1 shrink-0">
            <span>Résumé</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Détails</button>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Équipements</button>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Documents</button>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Historique</button>
        </div>

        {/* 3 Main Panels matching Reference #25 Screen 25B */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Panel 1: Synthèse des points de contrôle */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Synthèse des points de contrôle
            </h3>

            <div className="space-y-2.5 text-[11px]">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#121216]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-zinc-300">Carrosserie &amp; Peinture</span>
                </div>
                <span className="font-mono font-bold text-white">85/100</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#121216]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-zinc-300">Mécanique &amp; Transmission</span>
                </div>
                <span className="font-mono font-bold text-white">80/100</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#121216]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-zinc-300">Intérieur &amp; Confort</span>
                </div>
                <span className="font-mono font-bold text-white">88/100</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#121216]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span className="text-zinc-300">Électronique &amp; Électricité</span>
                </div>
                <span className="font-mono font-bold text-amber-400">76/100</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#121216]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-zinc-300">Documents &amp; Conformité</span>
                </div>
                <span className="font-mono font-bold text-emerald-400">100/100</span>
              </div>
            </div>
          </div>

          {/* Panel 2: Répartition des scores */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col justify-between">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Répartition des scores
            </h3>

            <div className="grid grid-cols-2 items-center gap-2 flex-1">
              <div className="relative h-[130px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={SCORE_DISTRIBUTION}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={54}
                      paddingAngle={2}
                      dataKey="percentage"
                    >
                      {SCORE_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#16161c" strokeWidth={2} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-mono text-xs font-black text-emerald-400">86/100</span>
                  <span className="text-[7px] text-zinc-400 uppercase font-bold">Score global</span>
                </div>
              </div>

              <div className="space-y-1.5 text-[9px]">
                {SCORE_DISTRIBUTION.map((item) => (
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

          {/* Panel 3: Observations principales */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
                Observations principales
              </h3>

              <div className="space-y-2 py-2 text-[11px]">
                <div className="flex items-start gap-2 text-zinc-300">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>Légères rayures sur le pare-chocs avant</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-300">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>Usure des plaquettes de frein avant (30%)</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-300">
                  <span className="text-red-400 font-bold">•</span>
                  <span>Pneu arrière gauche à remplacer d&apos;ici 5 000 km</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#202028]">
              <span className="text-[10px] text-red-400 hover:text-red-300 font-semibold cursor-pointer">
                Voir toutes les observations (8) &rarr;
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#202028]">
          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white">
            <Download className="h-3.5 w-3.5 text-zinc-400" />
            <span>Exporter PDF</span>
          </button>

          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white">
            <Share2 className="h-3.5 w-3.5 text-zinc-400" />
            <span>Partager</span>
          </button>

          <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors">
            <Printer className="h-3.5 w-3.5" />
            <span>Imprimer</span>
          </button>
        </div>
      </div>
    </div>
  )
}
