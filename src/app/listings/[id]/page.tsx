'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Share2,
  Edit2,
  Car,
} from 'lucide-react'

function ListingPreviewContent() {
  const router = useRouter()
  const params = useParams()
  const rawId = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : '1'
  const listingId = decodeURIComponent(rawId)

  const [isPublishing, setIsPublishing] = useState(false)

  const handlePublish = () => {
    setIsPublishing(true)
    setTimeout(() => {
      router.push('/listings/platforms')
    }, 500)
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-zinc-400">
          <Link
            href="/listings"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour aux annonces</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300">Annonces</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="font-semibold text-white">Aperçu #{listingId}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/listings/new"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <Edit2 className="h-3 w-3 text-zinc-400" />
            <span>Éditer</span>
          </Link>

          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>{isPublishing ? 'Diffusion...' : 'Publier maintenant'}</span>
          </button>
        </div>
      </div>

      {/* Header Banner matching Reference #38 Screen 3 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-black text-white">Toyota Land Cruiser 2023</h1>
            <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              Prête à publier
            </span>
          </div>
          <div className="text-xs text-zinc-400">
            VR-R 4.0L Essence · Réf. <strong className="text-white font-mono">ANN-2025-0042</strong>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-zinc-400 uppercase">Prix affiché</span>
          <div className="font-mono font-black text-emerald-400 text-xl">865 000 DH</div>
        </div>
      </div>

      {/* Main Content Layout matching Reference #38 Screen 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Gallery & Equipments (span-7) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Photo Card */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-3">
            <div className="aspect-[16/9] w-full rounded-lg bg-[#16161c] border border-[#262632] flex flex-col items-center justify-center relative overflow-hidden">
              <div className="h-20 w-20 rounded-full bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-2">
                <Car className="h-10 w-10" />
              </div>
              <span className="text-xs font-bold text-white">Toyota Land Cruiser 2023 VR-R</span>
              <span className="text-[10px] text-zinc-400 font-mono">Blanc Nacré · Vue 3/4 Avant</span>
              <span className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-0.5 text-[9px] font-mono text-zinc-300">
                Photo 1 / 6
              </span>
            </div>

            {/* 5 Thumbnails */}
            <div className="grid grid-cols-5 gap-2">
              {['Face avant', 'Profil gauche', 'Arrière', 'Cockpit', 'Sellerie 7 pl.'].map((label, idx) => (
                <div
                  key={idx}
                  className={`aspect-[4/3] rounded-lg border p-1 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                    idx === 0 ? 'border-red-500 bg-red-500/10' : 'border-[#282834] bg-[#16161c] hover:border-zinc-500'
                  }`}
                >
                  <Car className="h-4 w-4 text-zinc-400 mb-0.5" />
                  <span className="text-[8px] text-zinc-300 truncate w-full">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Équipements principaux */}
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-2">
              Équipements principaux
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                'Toit ouvrant',
                'Caméra 360°',
                'Cuir nappa',
                'JBL Premium Sound',
                'Climatisation auto',
                'Navigation GPS',
                '7 places',
                'Hayon électrique',
                'Jantes 20"',
              ].map((eq, i) => (
                <span
                  key={i}
                  className="rounded-lg border border-[#282834] bg-[#16161c] px-2.5 py-1 text-[11px] text-zinc-200 font-medium"
                >
                  {eq}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Technical Specs & Description (span-5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-2">
              Détails de l&apos;annonce
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 uppercase">Prix</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">865 000 DH</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 uppercase">Kilométrage</span>
                <span className="font-mono text-white">17 450 km</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 uppercase">Année</span>
                <span className="font-mono text-white">2023</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 uppercase">Carburant</span>
                <span className="text-white">Essence</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 uppercase">Transmission</span>
                <span className="text-white">Automatique</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 uppercase">Puissance fiscale</span>
                <span className="font-mono text-zinc-300">15 CV</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 uppercase">Couleur</span>
                <span className="text-zinc-300">Blanc Nacré / Int. Beige</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 uppercase">Nombre de places</span>
                <span className="font-mono text-white">7</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 uppercase">VIN</span>
                <span className="font-mono text-zinc-400 text-[10px]">JTMHV02J804567890</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-2.5">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-2">
              Description de l&apos;annonce
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Toyota Land Cruiser VR-R 4.0L Essence — 7 places, Toit ouvrant, Cuir, Caméra 360°, JBL Premium Sound. État neuf, révisions concessionnaire à jour, disponible immédiatement chez MAALAL CARS Casablanca.
            </p>
          </div>

          <Link
            href="/listings/platforms"
            className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 transition-colors block text-center"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Diffuser sur les plateformes partenaires &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ListingDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-500">Chargement de l&apos;annonce...</div>}>
      <ListingPreviewContent />
    </Suspense>
  )
}
