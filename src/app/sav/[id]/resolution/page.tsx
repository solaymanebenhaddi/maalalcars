'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Star,
  Check,
} from 'lucide-react'

export default function SavResolutionSatisfactionPage() {
  const params = useParams()
  const rawId = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : 'SAV-2025-0042'
  const ticketCode = decodeURIComponent(rawId)

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Breadcrumb matching Reference #32 Screen 5 */}
      <div className="flex items-center gap-2 text-zinc-400">
        <Link
          href="/sav"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour au tableau de bord SAV</span>
        </Link>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-300">Accueil</span>
        <span className="text-zinc-600">&gt;</span>
        <span className="text-zinc-300">SAV / Support</span>
        <span className="text-zinc-600">&gt;</span>
        <span className="font-semibold text-white">Historique et satisfaction</span>
      </div>

      {/* Banner Header matching Reference #32 Screen 5 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm text-white">{ticketCode}</span>
            <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              Résolu
            </span>
            <span className="text-zinc-300 text-xs font-semibold">· Problème de climatisation</span>
          </div>
          <div className="text-[11px] text-zinc-400">
            Résolu le <strong className="text-white">13 mai 2025 à 17:20</strong>
          </div>
        </div>

        <Link
          href={`/sav/${ticketCode}`}
          className="rounded-lg border border-[#282834] bg-[#18181f] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
        >
          Voir le fil de conversation
        </Link>
      </div>

      {/* 3 Cards Layout matching Reference #32 Screen 5 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Card: Résumé (span-3) */}
        <div className="md:col-span-3 rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-4 shadow-md h-fit">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
            Résumé
          </h2>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Client</span>
              <div className="font-bold text-white text-xs">Omar Bennis</div>
            </div>

            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Véhicule</span>
              <div className="text-zinc-200">Audi Q7 2021</div>
            </div>

            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Catégorie</span>
              <div className="font-semibold text-cyan-400">Climatisation</div>
            </div>

            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Assigné à</span>
              <div className="text-zinc-200 font-medium">Mehdi Lahlou</div>
            </div>

            <div className="pt-2 border-t border-[#1e1e24]">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Durée totale</span>
              <div className="font-mono font-bold text-emerald-400 text-xs">2 jours 4h 30m</div>
            </div>
          </div>
        </div>

        {/* Center Card: Historique (Timeline) (span-5) */}
        <div className="md:col-span-5 rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-4 shadow-md">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
            Historique
          </h2>

          <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#282834]">
            {/* Step 1 */}
            <div className="relative">
              <span className="absolute -left-6 top-0.5 h-5 w-5 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                <Check className="h-3 w-3" />
              </span>
              <div className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Ticket créé</span>
                  <span className="text-[10px] font-mono text-zinc-400">11/05/2025 09:10</span>
                </div>
                <p className="text-[11px] text-zinc-400">Problème signalé par le client</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <span className="absolute -left-6 top-0.5 h-5 w-5 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                <Check className="h-3 w-3" />
              </span>
              <div className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Diagnostic</span>
                  <span className="text-[10px] font-mono text-zinc-400">11/05/2025 11:45</span>
                </div>
                <p className="text-[11px] text-zinc-400">Diagnostic effectué : fuite de gaz réfrigérant</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <span className="absolute -left-6 top-0.5 h-5 w-5 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                <Check className="h-3 w-3" />
              </span>
              <div className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Intervention</span>
                  <span className="text-[10px] font-mono text-zinc-400">12/05/2025 14:30</span>
                </div>
                <p className="text-[11px] text-zinc-400">Recharge climatisation + test d&apos;étanchéité sous pression</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <span className="absolute -left-6 top-0.5 h-5 w-5 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                <Check className="h-3 w-3" />
              </span>
              <div className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Résolution</span>
                  <span className="text-[10px] font-mono text-zinc-400">13/05/2025 17:20</span>
                </div>
                <p className="text-[11px] text-zinc-400">Problème résolu, test final OK et véhicule restitué</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Satisfaction client (span-4) */}
        <div className="md:col-span-4 rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-4 shadow-md flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
              Satisfaction client
            </h2>

            <div className="space-y-2">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Note globale</span>
              <div className="flex items-center gap-1.5 text-amber-400">
                <Star className="h-5 w-5 fill-amber-400" />
                <Star className="h-5 w-5 fill-amber-400" />
                <Star className="h-5 w-5 fill-amber-400" />
                <Star className="h-5 w-5 fill-amber-400" />
                <Star className="h-5 w-5 fill-amber-400" />
                <span className="font-mono font-bold text-base text-white ml-2">4.8 / 5</span>
              </div>
            </div>

            <div className="space-y-1.5 rounded-xl border border-[#24242e] bg-[#16161c] p-3">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Commentaire</span>
              <blockquote className="text-zinc-200 text-xs italic leading-relaxed">
                &ldquo;Très satisfait du service et de la rapidité d&apos;intervention.&rdquo;
              </blockquote>
              <div className="text-[11px] text-zinc-400 font-semibold text-right">
                — Omar Bennis
              </div>
            </div>
          </div>

          <button
            onClick={() => alert('Détail complet du dossier SAV archivé')}
            className="w-full rounded-lg border border-[#282834] bg-[#18181f] py-2 text-xs font-bold text-zinc-200 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Voir le détail complet
          </button>
        </div>
      </div>
    </div>
  )
}
