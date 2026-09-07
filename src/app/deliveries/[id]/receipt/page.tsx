'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Download,
  Printer,
  Mail,
} from 'lucide-react'

export default function DeliveryReceiptPage() {
  const params = useParams()
  const code = (params?.id as string) || 'LDV-2025-0056'

  return (
    <div className="space-y-4 max-w-4xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/deliveries/${code}/checklist`}
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour à la checklist</span>
        </Link>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <Download className="h-3.5 w-3.5 text-zinc-400" />
            <span>Télécharger (PDF)</span>
          </button>

          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <Printer className="h-3.5 w-3.5 text-zinc-400" />
            <span>Imprimer</span>
          </button>

          <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors">
            <Mail className="h-3.5 w-3.5" />
            <span>Envoyer par email</span>
          </button>
        </div>
      </div>

      {/* Main Document Layout matching Reference #26 Screen 26C */}
      <div className="rounded-xl border border-[#222228] bg-[#0f0f13] p-8 space-y-6 shadow-2xl text-zinc-300">
        {/* Document Header */}
        <div className="flex items-start justify-between border-b border-[#222228] pb-4">
          <div>
            <span className="font-mono text-xs text-red-500 font-bold uppercase tracking-wider">MAALAL CARS</span>
            <h1 className="text-base sm:text-lg font-black text-white uppercase tracking-tight mt-1">
              BON DE LIVRAISON
            </h1>
          </div>

          <div className="text-right text-[11px] space-y-0.5 font-mono">
            <div><span className="text-zinc-500">N° Bon :</span> <span className="font-bold text-white">{code}</span></div>
            <div><span className="text-zinc-500">Date :</span> <span className="text-zinc-200">20/05/2025</span></div>
            <div><span className="text-zinc-500">Heure :</span> <span className="text-zinc-200">10:30</span></div>
          </div>
        </div>

        {/* Client & Vehicle Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px]">
          {/* Client Box */}
          <div className="rounded-lg border border-[#202028] bg-[#141418] p-4 space-y-1.5">
            <span className="font-bold text-zinc-400 uppercase text-[10px] tracking-wider block">Client</span>
            <div className="font-bold text-white text-xs">Sophie Martin</div>
            <div className="text-zinc-400">12, rue des Lilas, 20000 Casablanca, Maroc</div>
            <div className="font-mono text-zinc-400">Tél : +212 6 12 34 56 78</div>
            <div className="text-zinc-400">Email : sophie.martin@email.com</div>
          </div>

          {/* Vehicle Box */}
          <div className="rounded-lg border border-[#202028] bg-[#141418] p-4 space-y-1.5">
            <span className="font-bold text-zinc-400 uppercase text-[10px] tracking-wider block">Véhicule</span>
            <div className="font-bold text-white text-xs">Mercedes GLE 53 AMG</div>
            <div className="flex justify-between"><span className="text-zinc-500">Immatriculation :</span> <span className="font-mono font-bold text-zinc-200">WW-325-KL</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">VIN :</span> <span className="font-mono text-zinc-300">W1N12345678123456</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Kilométrage :</span> <span className="font-mono text-zinc-200">13 450 km</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Couleur :</span> <span className="text-zinc-300">Noir Obsidienne</span></div>
          </div>
        </div>

        {/* Legal Text */}
        <p className="text-[11px] leading-relaxed text-zinc-400 p-3 rounded-lg bg-[#141418] border border-[#202028]">
          Je soussigné(e) <strong>Sophie Martin</strong>, reconnais avoir reçu le véhicule désigné ci-dessus en parfait état de fonctionnement ainsi que l&apos;ensemble des documents et accessoires afférents.
        </p>

        {/* Signatures */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#202028]">
          <div className="p-4 rounded-lg bg-[#141418] border border-[#202028] space-y-3">
            <div className="text-[10px] font-bold text-zinc-400 uppercase">Remise effectuée par</div>
            <div className="font-semibold text-white">Yassine Benali</div>
            <div className="text-[10px] text-emerald-400 font-medium">Conseiller Commercial MAALAL CARS</div>
          </div>

          <div className="p-4 rounded-lg bg-[#141418] border border-[#202028] space-y-2">
            <div className="text-[10px] font-bold text-zinc-400 uppercase">Signature du client</div>
            <div className="h-10 flex items-center">
              <span className="font-serif italic text-emerald-400 text-lg tracking-widest">
                Sophie Martin
              </span>
            </div>
            <div className="text-[9px] text-zinc-500 font-mono">Certifié le 20/05/2025 à 10:35</div>
          </div>
        </div>
      </div>
    </div>
  )
}
