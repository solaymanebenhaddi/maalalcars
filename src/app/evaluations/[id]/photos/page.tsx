'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Plus,
  Camera,
} from 'lucide-react'

interface InspectionPhoto {
  id: number
  title: string
  category: 'Extérieur' | 'Intérieur' | 'Mécanique'
  status: 'Conforme' | 'Mineur' | 'À revoir'
  color: string
}

const PHOTOS: InspectionPhoto[] = [
  { id: 1, title: 'Vue avant 3/4 face', category: 'Extérieur', status: 'Conforme', color: 'from-zinc-800 to-zinc-950' },
  { id: 2, title: 'Profil latéral gauche', category: 'Extérieur', status: 'Conforme', color: 'from-zinc-800 to-zinc-950' },
  { id: 3, title: 'Arrière & Optiques', category: 'Extérieur', status: 'Mineur', color: 'from-zinc-800 to-zinc-950' },
  { id: 4, title: 'Poste de conduite & Volant', category: 'Intérieur', status: 'Conforme', color: 'from-zinc-800 to-zinc-950' },
  { id: 5, title: 'Siège conducteur cuir', category: 'Intérieur', status: 'Conforme', color: 'from-zinc-800 to-zinc-950' },
  { id: 6, title: 'Banquette arrière', category: 'Intérieur', status: 'Conforme', color: 'from-zinc-800 to-zinc-950' },
  { id: 7, title: 'Bloc moteur turbo', category: 'Mécanique', status: 'Conforme', color: 'from-zinc-800 to-zinc-950' },
  { id: 8, title: 'Jante alliage avant droite', category: 'Extérieur', status: 'À revoir', color: 'from-zinc-800 to-zinc-950' },
  { id: 9, title: 'Pneumatique AR gauche', category: 'Mécanique', status: 'À revoir', color: 'from-zinc-800 to-zinc-950' },
  { id: 10, title: 'Pare-brise & Capteurs', category: 'Extérieur', status: 'Conforme', color: 'from-zinc-800 to-zinc-950' },
  { id: 11, title: 'Console centrale & Écran', category: 'Intérieur', status: 'Conforme', color: 'from-zinc-800 to-zinc-950' },
  { id: 12, title: 'Coffre à bagages', category: 'Intérieur', status: 'Conforme', color: 'from-zinc-800 to-zinc-950' },
]

export default function EvaluationPhotosPage() {
  const params = useParams()
  const code = (params?.id as string) || 'EVAL-2025-0128'
  const [filter, setFilter] = useState<'Toutes' | 'Extérieur' | 'Intérieur' | 'Mécanique'>('Toutes')

  const filteredPhotos = PHOTOS.filter((p) => filter === 'Toutes' || p.category === filter)

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

        <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors">
          <Plus className="h-3.5 w-3.5" />
          <span>Ajouter des photos</span>
        </button>
      </div>

      {/* Main Container matching Reference #25 Screen 25C */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#222228] pb-3">
          <div>
            <h1 className="text-base sm:text-lg font-black text-white">
              Photos &amp; Dommages <span className="text-zinc-500 font-mono text-sm">(18)</span>
            </h1>
            <p className="text-xs text-zinc-400">
              Galerie d&apos;inspection visuelle HD et repérage des anomalies
            </p>
          </div>
        </div>

        {/* Primary Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs">
          <button className="font-bold text-white relative pb-1">
            <span>Photos</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold">Dommages</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Pièces</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Annotations</button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 text-xs">
          {(['Toutes', 'Extérieur', 'Intérieur', 'Mécanique'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                filter === cat
                  ? 'bg-red-600 text-white'
                  : 'bg-[#18181f] text-zinc-400 hover:text-white border border-[#282834]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 12-Card Inspection Photos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group rounded-xl border border-[#24242e] bg-[#16161c] overflow-hidden flex flex-col justify-between hover:border-zinc-500 transition-colors shadow-sm"
            >
              <div className="relative h-32 w-full bg-gradient-to-br from-zinc-800 to-zinc-950 flex flex-col items-center justify-center p-3 text-center">
                <Camera className="h-8 w-8 text-zinc-600 group-hover:text-red-400 transition-colors mb-1" />
                <span className="text-[10px] text-zinc-400 font-medium">{photo.title}</span>
                <span
                  className={`absolute top-2 right-2 rounded px-1.5 py-0.5 text-[8px] font-bold ${
                    photo.status === 'Conforme'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : photo.status === 'Mineur'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {photo.status}
                </span>
              </div>

              <div className="p-2.5 bg-[#121216] border-t border-[#202028] flex items-center justify-between text-[10px]">
                <span className="text-zinc-400">{photo.category}</span>
                <span className="text-zinc-500 font-mono">#0{photo.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
