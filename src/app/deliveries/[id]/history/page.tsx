'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Calendar,
  Clock,
} from 'lucide-react'

export default function DeliveryHistoryPage() {
  const params = useParams()
  const code = (params?.id as string) || 'LDV-2025-0056'

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/deliveries/${code}/checklist`}
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour à la checklist</span>
        </Link>
      </div>

      {/* Main Container matching Reference #26 Screen 26D */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white">
                Historique de remise — Mercedes GLE 53 AMG
              </h1>
              <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                Livrée
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Traçabilité complète des étapes de livraison et des signatures
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs">
          <button className="font-bold text-white relative pb-1">
            <span>Timeline</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold">Documents</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Historique des actions</button>
        </div>

        {/* Audit Timeline matching Reference #26 Screen 26D */}
        <div className="space-y-3.5 text-[11px] py-2">
          {/* Step 1: Remise réalisée */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#16161c] border border-[#22222c]">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="space-y-0.5 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">Remise réalisée</span>
                <span className="font-mono text-[10px] text-zinc-500">20/05/2025 10:35</span>
              </div>
              <div className="text-zinc-300">La remise a été effectuée et le client a signé le bon de livraison.</div>
              <div className="text-[10px] text-zinc-500">Par Yassine Benali</div>
            </div>
          </div>

          {/* Step 2: Checklist validée */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#16161c] border border-[#22222c]">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="space-y-0.5 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">Checklist validée</span>
                <span className="font-mono text-[10px] text-zinc-500">20/05/2025 10:10</span>
              </div>
              <div className="text-zinc-300">La checklist de remise a été complétée à 100%.</div>
              <div className="text-[10px] text-zinc-500">Par Yassine Benali</div>
            </div>
          </div>

          {/* Step 3: Documents téléchargés */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#16161c] border border-[#22222c]">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
              <FileText className="h-4 w-4" />
            </div>
            <div className="space-y-0.5 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">Documents téléchargés</span>
                <span className="font-mono text-[10px] text-zinc-500">20/05/2025 09:45</span>
              </div>
              <div className="text-zinc-300">Tous les documents requis ont été téléchargés et validés.</div>
              <div className="text-[10px] text-zinc-500">Par Yassine Benali</div>
            </div>
          </div>

          {/* Step 4: Livraison planifiée */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#16161c] border border-[#22222c]">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
              <Calendar className="h-4 w-4" />
            </div>
            <div className="space-y-0.5 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">Livraison planifiée</span>
                <span className="font-mono text-[10px] text-zinc-500">20/05/2025 09:00</span>
              </div>
              <div className="text-zinc-300">La livraison a été planifiée pour le 20/05/2025 à 10:30.</div>
              <div className="text-[10px] text-zinc-500">Par Yassine Benali</div>
            </div>
          </div>

          {/* Step 5: Livraison créée */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#16161c] border border-[#22222c]">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 shrink-0">
              <Clock className="h-4 w-4" />
            </div>
            <div className="space-y-0.5 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">Livraison créée</span>
                <span className="font-mono text-[10px] text-zinc-500">18/05/2025 14:22</span>
              </div>
              <div className="text-zinc-300">La fiche de livraison a été initialisée suite à la finalisation de vente.</div>
              <div className="text-[10px] text-zinc-500">Par Sarah Martin</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
