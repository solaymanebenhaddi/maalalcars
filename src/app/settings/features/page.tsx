'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ToggleLeft,
  ToggleRight,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sliders,
} from 'lucide-react'
import { useFeatures } from '@/contexts/features.context'

interface FeatureItem {
  id: string
  key: string
  name: string
  description: string | null
  enabled: boolean
  updatedAt: string
}

export default function FeaturesSettingsPage() {
  const { refreshFeatures } = useFeatures()
  const [features, setFeatures] = useState<FeatureItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'ALL' | 'ENABLED' | 'DISABLED'>('ALL')
  const [togglingKey, setTogglingKey] = useState<string | null>(null)

  const fetchFlags = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/features')
      const data = await res.json()
      if (data.details) {
        setFeatures(data.details)
      }
    } catch (e) {
      console.error('Failed to load feature flags', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let ignore = false
    fetch('/api/features')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore && data?.details) {
          setFeatures(data.details)
          setLoading(false)
        }
      })
      .catch((e) => {
        if (!ignore) {
          console.error('Failed to load feature flags', e)
          setLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [])

  const handleToggle = async (key: string, currentStatus: boolean) => {
    setTogglingKey(key)
    try {
      const res = await fetch(`/api/features/${key}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !currentStatus }),
      })
      if (res.ok) {
        setFeatures((prev) =>
          prev.map((f) => (f.key === key ? { ...f, enabled: !currentStatus } : f))
        )
        refreshFeatures()
      }
    } catch (e) {
      console.error('Failed to toggle feature flag', e)
    } finally {
      setTogglingKey(null)
    }
  }

  const filteredFeatures = features.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.description && f.description.toLowerCase().includes(searchTerm.toLowerCase()))

    if (!matchesSearch) return false
    if (filter === 'ENABLED') return f.enabled
    if (filter === 'DISABLED') return !f.enabled
    return true
  })

  const enabledCount = features.filter((f) => f.enabled).length
  const disabledCount = features.filter((f) => !f.enabled).length

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Paramètres</span>
          </Link>
          <h1 className="text-base font-black text-white">
            Modules & Feature Flags (Gouvernance MVP)
          </h1>
        </div>

        <button
          onClick={fetchFlags}
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#16161c] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-emerald-500/20 bg-[#121216] p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-400">Modules Actifs (Périmètre MVP)</span>
            <div className="text-2xl font-black text-white font-mono mt-1">{enabledCount}</div>
          </div>
          <CheckCircle2 className="h-8 w-8 text-emerald-400 opacity-60" />
        </div>

        <div className="rounded-xl border border-zinc-800 bg-[#121216] p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-400">Modules En Veille (Désactivés)</span>
            <div className="text-2xl font-black text-zinc-300 font-mono mt-1">{disabledCount}</div>
          </div>
          <AlertCircle className="h-8 w-8 text-zinc-500 opacity-60" />
        </div>

        <div className="rounded-xl border border-[#24242c] bg-[#121216] p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-400">Total Fonctionnalités Trackées</span>
            <div className="text-2xl font-black text-cyan-400 font-mono mt-1">{features.length}</div>
          </div>
          <Sliders className="h-8 w-8 text-cyan-400 opacity-60" />
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-[#222228] bg-[#121216] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un module (clé, nom, description)..."
            className="h-9 w-full rounded-lg border border-[#282834] bg-[#16161c] pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'ALL'
                ? 'bg-red-600 text-white'
                : 'bg-[#181820] text-zinc-400 hover:text-white'
            }`}
          >
            Tous ({features.length})
          </button>
          <button
            onClick={() => setFilter('ENABLED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'ENABLED'
                ? 'bg-emerald-600 text-white'
                : 'bg-[#181820] text-zinc-400 hover:text-white'
            }`}
          >
            Actifs ({enabledCount})
          </button>
          <button
            onClick={() => setFilter('DISABLED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'DISABLED'
                ? 'bg-zinc-700 text-white'
                : 'bg-[#181820] text-zinc-400 hover:text-white'
            }`}
          >
            Désactivés ({disabledCount})
          </button>
        </div>
      </div>

      {/* Features Table */}
      <div className="rounded-2xl border border-[#222228] bg-[#121216] overflow-hidden shadow-sm">
        <div className="divide-y divide-[#1e1e24]">
          {loading ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              Chargement des drapeaux de fonctionnalités...
            </div>
          ) : filteredFeatures.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              Aucun module ne correspond aux filtres.
            </div>
          ) : (
            filteredFeatures.map((f) => (
              <div
                key={f.key}
                className="p-4 flex items-center justify-between hover:bg-[#16161c] transition-colors"
              >
                <div className="space-y-1 pr-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-white">{f.name}</span>
                    <span className="font-mono text-[10px] text-zinc-500 bg-[#1e1e26] px-2 py-0.5 rounded border border-[#282834]">
                      {f.key}
                    </span>
                    {f.enabled ? (
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                        ACTIF
                      </span>
                    ) : (
                      <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[9px] font-bold text-zinc-400">
                        DÉSACTIVÉ
                      </span>
                    )}
                  </div>
                  {f.description && (
                    <p className="text-[11px] text-zinc-400 leading-relaxed max-w-2xl">
                      {f.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleToggle(f.key, f.enabled)}
                  disabled={togglingKey === f.key}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    f.enabled
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700'
                  }`}
                >
                  {togglingKey === f.key ? (
                    <span>...</span>
                  ) : f.enabled ? (
                    <>
                      <ToggleRight className="h-4 w-4 text-emerald-400" />
                      <span>Activé</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="h-4 w-4 text-zinc-500" />
                      <span>Désactivé</span>
                    </>
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
