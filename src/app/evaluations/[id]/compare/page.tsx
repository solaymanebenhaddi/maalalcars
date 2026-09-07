'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react'

interface DamagePoint {
  id: number
  location: string
  issue: string
  action: 'Réparé' | 'Remplacé'
  actionColor: string
}

const DAMAGE_POINTS: DamagePoint[] = [
  { id: 1, location: 'Pare-chocs avant', issue: 'Rayures légères', action: 'Réparé', actionColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  { id: 2, location: 'Aile avant droite', issue: 'Rayure 10 cm', action: 'Réparé', actionColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  { id: 3, location: 'Portière arrière gauche', issue: 'Impact léger', action: 'Réparé', actionColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  { id: 4, location: 'Jante avant droite', issue: 'Éraflure', action: 'Réparé', actionColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  { id: 5, location: 'Pneu arrière gauche', issue: 'Usure importante', action: 'Remplacé', actionColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' },
]

export default function EvaluationComparePage() {
  const params = useParams()
  const code = (params?.id as string) || 'EVAL-2025-0128'
  const [viewMode, setViewMode] = useState<'both' | 'before' | 'after'>('both')

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/evaluations/${code}`}
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour au rapport</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-[#282834] bg-[#141418] p-0.5 text-xs">
            <button
              onClick={() => setViewMode('before')}
              className={`rounded-md px-3 py-1 font-semibold transition-colors ${
                viewMode === 'before' ? 'bg-[#22222c] text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Avant
            </button>
            <button
              onClick={() => setViewMode('after')}
              className={`rounded-md px-3 py-1 font-semibold transition-colors ${
                viewMode === 'after' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Après
            </button>
            <button
              onClick={() => setViewMode('both')}
              className={`rounded-md px-3 py-1 font-semibold transition-colors ${
                viewMode === 'both' ? 'bg-[#22222c] text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Comparatif
            </button>
          </div>

          <button className="flex items-center gap-1 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <RotateCcw className="h-3.5 w-3.5 text-zinc-400" />
            <span>Synchroniser</span>
          </button>
        </div>
      </div>

      {/* Main Container matching Reference #25 Screen 25D */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-5 shadow-xl">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white">
            Comparatif Avant / Après Remise en État
          </h1>
          <p className="text-xs text-zinc-400">
            Évolution visuelle, réparations atelier et progression du score global
          </p>
        </div>

        {/* 3 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Col 1: Carrosserie Avant */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col items-center justify-between space-y-4">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Carrosserie avant
            </h3>

            {/* Top-down Car Graphic with Damage Points */}
            <div className="relative h-64 w-32 rounded-3xl border-2 border-zinc-700 bg-zinc-900/60 flex flex-col justify-between p-3 items-center shadow-inner">
              {/* Hotspot 1 (Front Bumper) */}
              <div className="absolute top-2 left-6 h-3.5 w-3.5 rounded-full bg-red-500 animate-ping opacity-75" />
              <div className="absolute top-2 left-6 h-3.5 w-3.5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white shadow-lg">
                1
              </div>

              {/* Hotspot 2 (Right Wing) */}
              <div className="absolute top-12 right-2 h-3.5 w-3.5 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white shadow-lg">
                2
              </div>

              {/* Hotspot 3 (Rear Left Door) */}
              <div className="absolute top-32 left-1 h-3.5 w-3.5 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white shadow-lg">
                3
              </div>

              {/* Hotspot 4 (Right Front Wheel) */}
              <div className="absolute top-16 right-0 h-3.5 w-3.5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white shadow-lg">
                4
              </div>

              {/* Hotspot 5 (Rear Left Tire) */}
              <div className="absolute bottom-12 left-0 h-3.5 w-3.5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white shadow-lg">
                5
              </div>

              <div className="w-20 h-8 rounded-t-xl bg-zinc-800 border border-zinc-600 mt-2" />
              <div className="w-24 h-24 rounded-lg bg-zinc-800/80 border border-zinc-600" />
              <div className="w-20 h-10 rounded-b-xl bg-zinc-800 border border-zinc-600 mb-2" />
            </div>

            <div className="text-center">
              <span className="text-[10px] text-zinc-400 block font-semibold">Score initial</span>
              <span className="font-mono font-black text-amber-400 text-base">62 / 100</span>
            </div>
          </div>

          {/* Col 2: Évolution des points clés & Progression */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white text-center border-b border-[#202028] pb-2">
              Évolution des points clés
            </h3>

            <div className="space-y-2.5">
              {DAMAGE_POINTS.map((dp) => (
                <div
                  key={dp.id}
                  className="rounded-lg border border-[#24242e] bg-[#16161c] p-2.5 flex items-center justify-between text-[11px]"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white">{dp.location}</div>
                    <div className="text-[10px] text-zinc-400">{dp.issue}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3 text-zinc-500" />
                    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[9px] font-bold ${dp.actionColor}`}>
                      {dp.action}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Score Global Evolution Card */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center space-y-1">
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                Score global après reconditionnement
              </div>
              <div className="flex items-center justify-center gap-3 font-mono">
                <span className="font-bold text-zinc-400 text-sm">62/100</span>
                <ArrowRight className="h-4 w-4 text-emerald-400" />
                <span className="font-black text-emerald-400 text-lg">86/100</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-bold">
                ↑ +24 points (État Conforme certifié)
              </div>
            </div>
          </div>

          {/* Col 3: Carrosserie Après */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 flex flex-col items-center justify-between space-y-4">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Carrosserie après
            </h3>

            {/* Top-down Pristine Car Graphic */}
            <div className="relative h-64 w-32 rounded-3xl border-2 border-emerald-500/50 bg-emerald-950/20 flex flex-col justify-between p-3 items-center shadow-inner">
              <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg">
                <CheckCircle2 className="h-3 w-3" />
              </div>

              <div className="w-20 h-8 rounded-t-xl bg-emerald-900/40 border border-emerald-500/40 mt-2" />
              <div className="w-24 h-24 rounded-lg bg-emerald-900/30 border border-emerald-500/40" />
              <div className="w-20 h-10 rounded-b-xl bg-emerald-900/40 border border-emerald-500/40 mb-2" />
            </div>

            <div className="text-center">
              <span className="text-[10px] text-emerald-400 block font-semibold">Score final certifié</span>
              <span className="font-mono font-black text-emerald-400 text-base">86 / 100</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-[#202028] text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="text-zinc-400">Non conforme</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-zinc-400">À revoir</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-zinc-400">Conforme</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
            <span className="text-zinc-400">Réparé / Amélioré</span>
          </div>
        </div>
      </div>
    </div>
  )
}
