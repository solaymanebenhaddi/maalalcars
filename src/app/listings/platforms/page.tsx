'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Share2,
  Sparkles,
} from 'lucide-react'

interface Platform {
  id: string
  name: string
  url: string
  traffic: string
  enabled: boolean
}

export default function MultiPlatformPublishPage() {
  const router = useRouter()

  const [platforms, setPlatforms] = useState<Platform[]>([
    { id: '1', name: 'Avito.ma', url: 'avito.ma', traffic: '1.6M+ visites/mois', enabled: true },
    { id: '2', name: 'Moteur.ma', url: 'moteur.ma', traffic: '6M+ visites/mois', enabled: true },
    { id: '3', name: 'Auto24.ma', url: 'auto24.ma', traffic: '2M+ visites/mois', enabled: true },
    { id: '4', name: 'Facebook Marketplace', url: 'facebook.com/marketplace', traffic: '8M+ utilisateurs', enabled: true },
    { id: '5', name: 'Instagram Shopping', url: 'instagram.com', traffic: '10M+ utilisateurs', enabled: true },
    { id: '6', name: 'DabaDoc Auto Maroc', url: 'dabadoc.ma/auto', traffic: '300K+ visites/mois', enabled: true },
    { id: '7', name: 'Google Ads Auto', url: 'google.com/ads', traffic: '10M+ impressions', enabled: true },
  ])

  const [publishPrice, setPublishPrice] = useState('865 000')
  const [duration, setDuration] = useState('30 jours')
  const [autoRenew, setAutoRenew] = useState(true)
  const [boostOption, setBoostOption] = useState(true)
  const [isPublishing, setIsPublishing] = useState(false)

  const togglePlatform = (id: string) => {
    setPlatforms(
      platforms.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    )
  }

  const activeCount = platforms.filter((p) => p.enabled).length

  const handlePublishAll = (e: React.FormEvent) => {
    e.preventDefault()
    setIsPublishing(true)
    setTimeout(() => {
      alert(`Annonce publiée avec succès sur ${activeCount} plateformes !`)
      router.push('/listings')
    }, 600)
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Breadcrumbs */}
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
        <span className="font-semibold text-white">Diffusion multi-plateformes</span>
      </div>

      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <Share2 className="h-4 w-4 text-red-500" />
            <span>Publication multi-plateformes</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Sélectionnez les portails de diffusion et configurez vos options de mise en avant.
          </p>
        </div>

        <form onSubmit={handlePublishAll} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Plateformes disponibles (span-7) */}
          <div className="lg:col-span-7 rounded-xl border border-[#222228] bg-[#16161c] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#202028] pb-2">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Plateformes disponibles ({activeCount} actives)
              </h2>
              <span className="text-[10px] text-zinc-400">Synchronisation API en direct</span>
            </div>

            <div className="space-y-2">
              {platforms.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-lg border border-[#202028] bg-[#121216] flex items-center justify-between hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500 font-bold text-xs">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">{p.name}</div>
                      <div className="text-[10px] text-zinc-400 font-mono">
                        {p.url} · <span className="text-zinc-500">{p.traffic}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        p.enabled
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                      }`}
                    >
                      {p.enabled ? 'Actif' : 'Désactivé'}
                    </span>

                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => togglePlatform(p.id)}
                      className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                        p.enabled ? 'bg-emerald-600' : 'bg-zinc-800'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          p.enabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[10px] text-zinc-500 text-center pt-2">
              + 3 autres plateformes régionales disponibles sur demande
            </div>
          </div>

          {/* Right: Options de publication (span-5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-xl border border-[#222228] bg-[#16161c] p-4 space-y-3">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-2">
                Options de publication
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Prix à publier (DH) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={publishPrice}
                    onChange={(e) => setPublishPrice(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#121216] px-3 text-xs text-white font-mono font-bold focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Durée de publication
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#121216] px-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="15 jours">15 jours</option>
                    <option value="30 jours">30 jours (Recommandé)</option>
                    <option value="60 jours">60 jours</option>
                    <option value="Jusqu'à la vente">Jusqu&apos;à la vente du véhicule</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-[#202028] flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white text-xs">Renouvellement automatique</div>
                    <div className="text-[10px] text-zinc-400">Relancer automatiquement à expiration</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoRenew(!autoRenew)}
                    className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                      autoRenew ? 'bg-emerald-600' : 'bg-zinc-800'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        autoRenew ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Boost Recommandé */}
                <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Boost recommandé</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setBoostOption(!boostOption)}
                      className={`w-8 h-4 flex items-center rounded-full p-0.5 transition-colors ${
                        boostOption ? 'bg-amber-500' : 'bg-zinc-800'
                      }`}
                    >
                      <div
                        className={`bg-white w-3 h-3 rounded-full shadow transform transition-transform ${
                          boostOption ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-300 leading-relaxed">
                    <strong>Mettre en avant l&apos;annonce :</strong> Multipliez les contacts par 3 grâce aux emplacements premium sur Avito et Moteur.ma.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPublishing || activeCount === 0}
              className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>
                {isPublishing
                  ? 'Publication en cours...'
                  : `Publier sur les ${activeCount} plateformes sélectionnées`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
