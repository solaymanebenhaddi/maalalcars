'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Plus,
  Search,
  Download,
  Edit2,
  Trash2,
} from 'lucide-react'

interface ModelItem {
  id: number
  name: string
  brand: string
  type: string
  years: string
  status: 'Actif' | 'Inactif'
  vehiclesCount: number
  createdAt: string
}

const MODELS_DATA: ModelItem[] = [
  { id: 1, name: 'Corolla', brand: 'Toyota', type: 'Berline', years: '2010 - 2025', status: 'Actif', vehiclesCount: 8, createdAt: '15/01/2024' },
  { id: 2, name: 'RAV4', brand: 'Toyota', type: 'SUV', years: '2010 - 2025', status: 'Actif', vehiclesCount: 7, createdAt: '15/01/2024' },
  { id: 3, name: 'Land Cruiser', brand: 'Toyota', type: 'SUV', years: '2000 - 2025', status: 'Actif', vehiclesCount: 9, createdAt: '15/01/2024' },
  { id: 4, name: 'X5', brand: 'BMW', type: 'SUV', years: '2007 - 2025', status: 'Actif', vehiclesCount: 6, createdAt: '15/01/2024' },
  { id: 5, name: 'Série 3', brand: 'BMW', type: 'Berline', years: '2012 - 2025', status: 'Actif', vehiclesCount: 5, createdAt: '15/01/2024' },
  { id: 6, name: 'C-Class', brand: 'Mercedes-Benz', type: 'Berline', years: '2011 - 2025', status: 'Actif', vehiclesCount: 7, createdAt: '15/01/2024' },
  { id: 7, name: 'E-Class', brand: 'Mercedes-Benz', type: 'Berline', years: '2010 - 2025', status: 'Actif', vehiclesCount: 6, createdAt: '15/01/2024' },
  { id: 8, name: 'Q7', brand: 'Audi', type: 'SUV', years: '2010 - 2025', status: 'Actif', vehiclesCount: 4, createdAt: '15/01/2024' },
]

export default function ModelsSettingsPage() {
  const [search, setSearch] = useState('')
  const [brandFilter, setBrandFilter] = useState('Toutes')

  const filtered = MODELS_DATA.filter((m) => {
    if (brandFilter !== 'Toutes' && m.brand !== brandFilter) return false
    return (
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.brand.toLowerCase().includes(search.toLowerCase()) ||
      m.type.toLowerCase().includes(search.toLowerCase())
    )
  })

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/settings/vehicles"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour aux paramètres véhicules</span>
        </Link>
      </div>

      {/* Main Container matching Reference #31 Screen 2 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
          <div>
            <h1 className="text-base sm:text-lg font-black text-white">
              Liste des modèles
            </h1>
            <p className="text-xs text-zinc-400">
              Gérez les modèles par marque et catégories de carrosserie.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
              <Download className="h-3.5 w-3.5 text-zinc-400" />
              <span>Exporter</span>
            </button>

            <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors">
              <Plus className="h-3.5 w-3.5" />
              <span>Ajouter un modèle</span>
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] font-semibold text-zinc-400 mb-1">Marque</label>
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
            >
              <option value="Toutes">Toutes les marques</option>
              <option value="Toyota">Toyota</option>
              <option value="BMW">BMW</option>
              <option value="Mercedes-Benz">Mercedes-Benz</option>
              <option value="Audi">Audi</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-zinc-400 mb-1">Statut</label>
            <select className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none">
              <option>Tous les statuts</option>
              <option>Actif</option>
              <option>Inactif</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-zinc-400 mb-1">Recherche</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un modèle..."
                className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] pl-8 pr-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* 8-row Models Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3 font-mono">#</th>
                <th className="py-2.5 px-3">Modèle</th>
                <th className="py-2.5 px-3">Marque</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 font-mono">Années</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3 text-center font-mono">Véhicules</th>
                <th className="py-2.5 px-3 font-mono">Date création</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24] text-[11px]">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-2.5 px-3 font-mono text-zinc-500">{m.id}</td>
                  <td className="py-2.5 px-3 font-bold text-white">{m.name}</td>
                  <td className="py-2.5 px-3 text-zinc-300">{m.brand}</td>
                  <td className="py-2.5 px-3">
                    <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-300 border border-zinc-700">
                      {m.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-zinc-400">{m.years}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      {m.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-cyan-400">{m.vehiclesCount}</td>
                  <td className="py-2.5 px-3 font-mono text-zinc-400 text-[10px]">{m.createdAt}</td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button className="rounded p-1 text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800">
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button className="rounded p-1 text-zinc-400 hover:text-red-400 hover:bg-zinc-800">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="flex items-center justify-between pt-2 text-[11px] text-zinc-400">
          <span>Afficher 1 à 8 sur 142 modèles</span>
          <div className="flex items-center gap-1">
            <button className="flex h-6 w-6 items-center justify-center rounded bg-red-600 text-white font-bold text-xs">
              1
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              2
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              3
            </button>
            <span className="text-zinc-600 px-1">...</span>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              18
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
