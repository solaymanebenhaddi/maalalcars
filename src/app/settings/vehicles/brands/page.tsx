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

interface BrandItem {
  id: number
  name: string
  logoText: string
  country: string
  status: 'Actif' | 'Inactif'
  vehiclesCount: number
  createdAt: string
}

const BRANDS_DATA: BrandItem[] = [
  { id: 1, name: 'Toyota', logoText: 'TY', country: '🇯🇵 Japon', status: 'Actif', vehiclesCount: 18, createdAt: '12/01/2024' },
  { id: 2, name: 'BMW', logoText: 'BM', country: '🇩🇪 Allemagne', status: 'Actif', vehiclesCount: 15, createdAt: '12/01/2024' },
  { id: 3, name: 'Mercedes-Benz', logoText: 'MB', country: '🇩🇪 Allemagne', status: 'Actif', vehiclesCount: 17, createdAt: '12/01/2024' },
  { id: 4, name: 'Audi', logoText: 'AU', country: '🇩🇪 Allemagne', status: 'Actif', vehiclesCount: 11, createdAt: '12/01/2024' },
  { id: 5, name: 'Hyundai', logoText: 'HY', country: '🇰🇷 Corée du Sud', status: 'Actif', vehiclesCount: 13, createdAt: '12/01/2024' },
  { id: 6, name: 'Renault', logoText: 'RN', country: '🇫🇷 France', status: 'Actif', vehiclesCount: 9, createdAt: '12/01/2024' },
  { id: 7, name: 'Peugeot', logoText: 'PG', country: '🇫🇷 France', status: 'Actif', vehiclesCount: 8, createdAt: '12/01/2024' },
  { id: 8, name: 'Dacia', logoText: 'DC', country: '🇷🇴 Roumanie', status: 'Actif', vehiclesCount: 6, createdAt: '12/01/2024' },
]

export default function BrandsSettingsPage() {
  const [search, setSearch] = useState('')

  const filtered = BRANDS_DATA.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.country.toLowerCase().includes(search.toLowerCase())
  )

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

      {/* Main Container matching Reference #31 Screen 1 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
          <div>
            <h1 className="text-base sm:text-lg font-black text-white">
              Liste des marques
            </h1>
            <p className="text-xs text-zinc-400">
              Gérez les marques de véhicules disponibles sur la plateforme.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-56">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une marque..."
                className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <button className="flex items-center gap-1 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
              <Download className="h-3.5 w-3.5 text-zinc-400" />
              <span>Exporter</span>
            </button>

            <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors">
              <Plus className="h-3.5 w-3.5" />
              <span>Ajouter une marque</span>
            </button>
          </div>
        </div>

        {/* 8-row Brands Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3 font-mono">#</th>
                <th className="py-2.5 px-3">Logo</th>
                <th className="py-2.5 px-3">Marque</th>
                <th className="py-2.5 px-3">Pays d&apos;origine</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3 text-center font-mono">Véhicules</th>
                <th className="py-2.5 px-3 font-mono">Date création</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24] text-[11px]">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-2.5 px-3 font-mono text-zinc-500">{b.id}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 font-bold text-white text-[10px]">
                      {b.logoText}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-white">{b.name}</td>
                  <td className="py-2.5 px-3 text-zinc-300">{b.country}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      {b.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-cyan-400">{b.vehiclesCount}</td>
                  <td className="py-2.5 px-3 font-mono text-zinc-400 text-[10px]">{b.createdAt}</td>
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
          <span>Afficher 1 à 8 sur 28 marques</span>
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
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              4
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
