'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const STAGES = [
  { id: 'SUBMITTED', name: 'Soumis', count: 32, color: '#3b82f6', border: 'border-blue-500/40', bg: 'bg-blue-500/10' },
  { id: 'IN_ANALYSIS', name: 'En analyse', count: 28, color: '#f59e0b', border: 'border-amber-500/40', bg: 'bg-amber-500/10' },
  { id: 'VERIFICATION', name: 'Vérification', count: 21, color: '#a855f7', border: 'border-purple-500/40', bg: 'bg-purple-500/10' },
  { id: 'APPROVED', name: 'Approbation', count: 36, color: '#22c55e', border: 'border-emerald-500/40', bg: 'bg-emerald-500/10' },
  { id: 'CONTRACT', name: 'Contrat', count: 8, color: '#06b6d4', border: 'border-cyan-500/40', bg: 'bg-cyan-500/10' },
  { id: 'DISBURSED', name: 'Décaissé', count: 3, color: '#84cc16', border: 'border-lime-500/40', bg: 'bg-lime-500/10' },
]

export function FinancingApprovalStepper({ totalInCourse = 128 }: { totalInCourse?: number }) {
  return (
    <div className="space-y-4">
      {/* 6 Stage Boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {STAGES.map((stg) => (
          <div
            key={stg.id}
            className={`rounded-xl border ${stg.border} ${stg.bg} p-2.5 text-center space-y-1 transition-all hover:border-zinc-400`}
          >
            <span className="text-[10px] font-semibold text-zinc-300 block">{stg.name}</span>
            <span className="text-xl font-black text-white font-mono block">{stg.count}</span>
          </div>
        ))}
      </div>

      {/* Connected Stepper Line with Nodes */}
      <div className="relative flex items-center justify-between px-4 py-2">
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-[#282834] z-0" />
        {STAGES.map((stg) => (
          <div key={stg.id} className="relative z-10 flex flex-col items-center">
            <div
              className="h-3.5 w-3.5 rounded-full border-2 border-[#121216] shadow-md"
              style={{ backgroundColor: stg.color }}
            />
          </div>
        ))}
      </div>

      {/* Footer Meta */}
      <div className="flex items-center justify-between pt-1 border-t border-[#222228] text-xs">
        <span className="text-zinc-400 font-medium">
          Total en cours : <strong className="text-white font-mono">{totalInCourse} dossiers</strong>
        </span>
        <Link
          href="/financing/pipeline"
          className="text-cyan-400 font-semibold hover:text-cyan-300 flex items-center gap-1 text-[11px]"
        >
          <span>Voir le suivi d’approbation</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  )
}
