'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  FileText,
  Download,
  Calendar,
  ChevronDown,
  Building,
} from 'lucide-react'

export default function ContractDetailPage() {
  const params = useParams()
  const code = (params?.id as string) || 'CTR-2025-00128'

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/contracts"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour aux contrats</span>
        </Link>
      </div>

      {/* Main Container matching Reference #24 Screen 4 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-5 shadow-xl">
        {/* Contract Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222228] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white">
                Contrat de maintenance flotte
              </h1>
              <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                Actif
              </span>
            </div>
            <p className="font-mono text-[11px] text-zinc-400">
              Référence : {code}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/contracts/${code}/preview`}
              className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
            >
              <FileText className="h-3.5 w-3.5 text-cyan-400" />
              <span>Aperçu &amp; Signature</span>
            </Link>

            <button className="flex items-center gap-1 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors">
              <span>Actions</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs overflow-x-auto">
          <button className="font-bold text-white relative pb-1 shrink-0">
            <span>Résumé</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Informations</button>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Parties</button>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Conditions</button>
          <button className="text-zinc-400 hover:text-white font-semibold shrink-0">Documents</button>
          <Link href={`/contracts/${code}/history`} className="text-zinc-400 hover:text-white font-semibold shrink-0">
            Historique
          </Link>
        </div>

        {/* 2 Main Panels: Informations générales + Parties */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Informations générales */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Informations générales
            </h3>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-zinc-400">Type de contrat</span>
                <span className="text-white font-medium">Maintenance</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Statut</span>
                <span className="font-bold text-emerald-400">Actif</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Date de début</span>
                <span className="font-mono text-zinc-200">01/05/2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Date de fin</span>
                <span className="font-mono text-zinc-200">30/04/2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Durée</span>
                <span className="text-zinc-200">12 mois</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Montant HT</span>
                <span className="font-mono font-black text-white text-xs">48 500,00 €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Devise</span>
                <span className="text-zinc-300">EUR - Euro</span>
              </div>
              <div className="flex justify-between border-t border-[#202028] pt-2">
                <span className="text-zinc-400">Créé le</span>
                <span className="font-mono text-zinc-400">28/04/2025 par Admin Maalal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Dernière maj.</span>
                <span className="font-mono text-zinc-400">12/05/2025 par Admin Maalal</span>
              </div>
              <div className="space-y-1 border-t border-[#202028] pt-2">
                <span className="text-zinc-400 block text-[10px]">Description</span>
                <p className="text-zinc-300">
                  Contrat de maintenance préventive et corrective pour la flotte de véhicules.
                </p>
              </div>
            </div>
          </div>

          {/* Parties */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Parties
            </h3>

            {/* MAALAL CARS */}
            <div className="p-3 rounded-lg bg-[#121216] border border-[#22222c] space-y-1 text-[11px]">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Building className="h-3.5 w-3.5 text-red-500" />
                <span>MAALAL CARS</span>
              </div>
              <div className="text-zinc-400">123, Route du Boulevard, Casablanca, Maroc</div>
              <div className="text-zinc-400">NINEA : 0123456789</div>
              <div className="text-zinc-300 font-medium pt-1">Représentant : Admin Maalal</div>
            </div>

            {/* GROUPE TRANSLOG */}
            <div className="p-3 rounded-lg bg-[#121216] border border-[#22222c] space-y-1 text-[11px]">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Building className="h-3.5 w-3.5 text-cyan-400" />
                <span>GROUPE TRANSLOG</span>
              </div>
              <div className="text-zinc-400">55, Avenue Cheikh Anta Diop, Casablanca, Maroc</div>
              <div className="text-zinc-400">NINEA : 9876543210</div>
              <div className="text-zinc-300 font-medium pt-1">Représentant : Mamadou Diop</div>
            </div>
          </div>
        </div>

        {/* Bottom 2 Boxes: Documents liés & Rappels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Documents liés */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Documents liés (2)
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#121216] border border-[#22222c]">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-red-500" />
                  <div>
                    <div className="font-bold text-white text-[11px]">Contrat_Maintenance_Flotte.pdf</div>
                    <div className="text-[10px] text-zinc-500">PDF • 425 KB • 12/05/2025</div>
                  </div>
                </div>
                <button className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800">
                  <Download className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#121216] border border-[#22222c]">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-red-500" />
                  <div>
                    <div className="font-bold text-white text-[11px]">Annexe_Tarifs_2025.pdf</div>
                    <div className="text-[10px] text-zinc-500">PDF • 310 KB • 12/05/2025</div>
                  </div>
                </div>
                <button className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800">
                  <Download className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Rappels */}
          <div className="rounded-xl border border-[#24242e] bg-[#16161c] p-4 space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Rappels
            </h3>

            <div className="space-y-3 text-[11px]">
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#121216] border border-[#22222c]">
                <Calendar className="h-4 w-4 text-amber-400 shrink-0" />
                <div>
                  <div className="font-bold text-white">Fin du contrat</div>
                  <div className="text-[10px] text-amber-400 font-semibold">Dans 354 jours (30/04/2026)</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#121216] border border-[#22222c]">
                <Calendar className="h-4 w-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="font-bold text-white">Prochaine révision</div>
                  <div className="text-[10px] text-zinc-400">01/02/2026</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
