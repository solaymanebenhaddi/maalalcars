'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Download,
  Send,
  CheckCircle2,
} from 'lucide-react'

export default function ContractPreviewPage() {
  const params = useParams()
  const code = (params?.id as string) || 'CTR-2025-00128'

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/contracts/${code}`}
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour au contrat</span>
        </Link>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <Download className="h-3.5 w-3.5 text-zinc-400" />
            <span>Télécharger le PDF</span>
          </button>

          <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors">
            <Send className="h-3.5 w-3.5" />
            <span>Demander une signature</span>
          </button>
        </div>
      </div>

      {/* Main Container matching Reference #24 Screen 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Paper Contract Preview */}
        <div className="lg:col-span-2 rounded-xl border border-[#222228] bg-[#0d0d10] p-6 space-y-6 shadow-2xl text-zinc-300">
          <div className="border-b border-[#222228] pb-4 flex items-center justify-between">
            <div>
              <span className="font-mono text-xs text-red-400 font-bold uppercase tracking-wider">MAALAL CARS</span>
              <h2 className="text-sm font-black text-white mt-1 uppercase tracking-tight">
                CONTRAT DE MAINTENANCE FLOTTE
              </h2>
            </div>
            <span className="font-mono text-xs text-zinc-400">Réf : {code}</span>
          </div>

          <div className="space-y-4 text-[11px] leading-relaxed">
            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-zinc-400">Entre les soussignés :</h4>
              <div className="p-3 rounded-lg bg-[#141418] border border-[#202028] space-y-1">
                <div className="font-bold text-white">MAALAL CARS</div>
                <div>123, Route du Boulevard, Casablanca, Maroc</div>
                <div className="text-[10px] text-zinc-400">ci-après dénommée « MAALAL CARS »</div>
              </div>

              <div className="text-center font-bold text-zinc-500 py-1">Et</div>

              <div className="p-3 rounded-lg bg-[#141418] border border-[#202028] space-y-1">
                <div className="font-bold text-white">GROUPE TRANSLOG</div>
                <div>55, Avenue Cheikh Anta Diop, Casablanca, Maroc</div>
                <div className="text-[10px] text-zinc-400">ci-après dénommée « le Client »</div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#202028]">
              <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-zinc-400">Il a été convenu ce qui suit :</h4>
              
              <div className="space-y-1.5">
                <div className="font-bold text-white">1. Objet du contrat</div>
                <p className="text-zinc-400 text-[11px]">
                  Le présent contrat a pour objet de définir les conditions techniques et financières dans lesquelles MAALAL CARS assure la maintenance préventive et corrective de la flotte automobile appartenant au Client.
                </p>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="font-bold text-white">2. Durée &amp; Montant</div>
                <p className="text-zinc-400 text-[11px]">
                  Le présent accord est conclu pour une durée ferme de 12 mois à compter du 01/05/2025 jusqu&apos;au 30/04/2026 pour un montant forfaitaire annuel de 48 500,00 € HT.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Signatures & Historique */}
        <div className="space-y-4">
          {/* Signatures Panel */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-4 shadow-md">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Signatures
            </h3>

            {/* MAALAL CARS */}
            <div className="rounded-lg bg-[#121216] border border-[#22222c] p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">MAALAL CARS</span>
                <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                  Signé
                </span>
              </div>
              <div className="text-[10px] text-zinc-400">Représentant autorisé: Admin Maalal</div>
              <div className="text-[10px] text-zinc-500">Signé le 12/05/2025</div>
              <div className="pt-2 font-serif italic text-emerald-400 text-sm tracking-widest border-t border-[#202028]">
                Admin Maalal
              </div>
            </div>

            {/* GROUPE TRANSLOG */}
            <div className="rounded-lg bg-[#121216] border border-[#22222c] p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">GROUPE TRANSLOG</span>
                <span className="inline-flex items-center rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[9px] font-bold text-amber-400">
                  En attente
                </span>
              </div>
              <div className="text-[10px] text-zinc-400">Représentant: Mamadou Diop</div>
              <div className="text-[10px] text-amber-400 font-medium">En attente de signature</div>
            </div>
          </div>

          {/* Historique des signatures */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3 shadow-md">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Historique des signatures
            </h3>

            <div className="space-y-3 text-[11px]">
              <div className="flex items-start gap-2.5">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-cyan-500/10 text-cyan-400 shrink-0">
                  <Send className="h-3 w-3" />
                </div>
                <div>
                  <div className="font-mono text-[9px] text-zinc-500">12/05/2025 09:14</div>
                  <div className="font-bold text-white">Document envoyé à Mamadou Diop</div>
                  <div className="text-[10px] text-zinc-400">Pour signature numérique</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500/10 text-emerald-400 shrink-0">
                  <CheckCircle2 className="h-3 w-3" />
                </div>
                <div>
                  <div className="font-mono text-[9px] text-zinc-500">12/05/2025 09:14</div>
                  <div className="font-bold text-white">Signé par Adrien Maalal</div>
                  <div className="text-[10px] text-zinc-400">Signature certifiée</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
