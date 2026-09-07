'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  Eye,
  ArrowUpRight,
  Share2,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const emptySubscribe = () => () => {}
function useMounted() {
  return React.useSyncExternalStore(emptySubscribe, () => true, () => false)
}

const STATUS_DATA = [
  { name: 'Actives', value: 86, color: '#10b981' },
  { name: 'En attente', value: 12, color: '#f59e0b' },
  { name: 'Désactivées', value: 18, color: '#71717a' },
  { name: 'Expirées', value: 12, color: '#ef4444' },
]

const LEADS_TREND = [
  { day: '1', leads: 4 },
  { day: '5', leads: 12 },
  { day: '10', leads: 22 },
  { day: '15', leads: 45 },
  { day: '20', leads: 62 },
  { day: '25', leads: 85 },
  { day: '30', leads: 120 },
]

interface ListingItem {
  id: string
  title: string
  version: string
  price: number
  status: 'Active' | 'En attente' | 'Désactivée'
  platforms: string[]
  views: number
  leads: number
  createdAt: string
  thumb: string
}

const DEFAULT_LISTINGS: ListingItem[] = [
  {
    id: '1',
    title: 'Toyota Land Cruiser 2023',
    version: 'VR-R 4.0L Essence',
    price: 865000,
    status: 'Active',
    platforms: ['Avito.ma', 'Moteur.ma', 'Auto24', '+2'],
    views: 1245,
    leads: 28,
    createdAt: '15 mai 2025',
    thumb: '🚗',
  },
  {
    id: '2',
    title: 'BMW X5 2022',
    version: 'xDrive30d M Sport',
    price: 629000,
    status: 'Active',
    platforms: ['Avito.ma', 'Moteur.ma', 'Auto24', '+3'],
    views: 962,
    leads: 21,
    createdAt: '14 mai 2025',
    thumb: '🚙',
  },
  {
    id: '3',
    title: 'Mercedes-Benz GLC 2021',
    version: '220d 4MATIC',
    price: 428000,
    status: 'En attente',
    platforms: ['Avito.ma', 'Moteur.ma', 'Auto24', '+3'],
    views: 0,
    leads: 0,
    createdAt: '13 mai 2025',
    thumb: '🚘',
  },
  {
    id: '4',
    title: 'Audi Q7 2022',
    version: '45 TDI Quattro',
    price: 589000,
    status: 'Active',
    platforms: ['Avito.ma', 'Moteur.ma', 'Auto24', '+2'],
    views: 756,
    leads: 16,
    createdAt: '12 mai 2025',
    thumb: '🏎️',
  },
  {
    id: '5',
    title: 'Peugeot 3008 2021',
    version: 'BlueHDi 130 GT Line',
    price: 299000,
    status: 'Désactivée',
    platforms: ['Avito.ma', 'Moteur.ma', 'Auto24', '+3'],
    views: 320,
    leads: 5,
    createdAt: '10 mai 2025',
    thumb: '🚗',
  },
]

export default function ListingsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tous')
  const [platformFilter, setPlatformFilter] = useState('Toutes')
  const [listings] = useState<ListingItem[]>(DEFAULT_LISTINGS)
  const isMounted = useMounted()

  const filtered = listings.filter((item) => {
    if (statusFilter !== 'Tous' && item.status !== statusFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return item.title.toLowerCase().includes(q) || item.version.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Top Header matching Reference #38 Screen 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
        <div>
          <h1 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-red-500" />
            <span>Annonces — Publication &amp; Multi-diffusion</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Gérez, publiez et suivez toutes vos annonces véhicules sur les portails automobiles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/listings/platforms"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <Share2 className="h-3.5 w-3.5 text-zinc-400" />
            <span>Multi-plateformes</span>
          </Link>

          <Link
            href="/listings/performance"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <span>Performance &amp; Leads</span>
          </Link>

          <Link
            href="/listings/new"
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Créer une annonce</span>
          </Link>
        </div>
      </div>

      {/* 5 KPI Cards matching Reference #38 Screen 1 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* KPI 1 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Annonces totales</span>
          <div className="text-xl font-black font-mono text-white mt-1">128</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 12,5% ce mois</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Annonces actives</span>
          <div className="text-xl font-black font-mono text-emerald-400 mt-1">86</div>
          <div className="text-[10px] text-zinc-400 mt-1">67,2% du total</div>
        </div>

        {/* KPI 3 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">En attente de publication</span>
          <div className="text-xl font-black font-mono text-amber-400 mt-1">12</div>
          <div className="text-[10px] text-zinc-400 mt-1">9,4% du total</div>
        </div>

        {/* KPI 4 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Désactivées</span>
          <div className="text-xl font-black font-mono text-zinc-400 mt-1">18</div>
          <div className="text-[10px] text-zinc-400 mt-1">14,1% du total</div>
        </div>

        {/* KPI 5 */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Leads générés</span>
          <div className="text-xl font-black font-mono text-cyan-400 mt-1">245</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 18,7% ce mois</span>
          </div>
        </div>
      </div>

      {/* 3 Middle Cards matching Reference #38 Screen 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Card 1: Aperçu rapide - Répartition par statut (Donut Chart) */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between shadow-md">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-2">
            Aperçu rapide · Répartition par statut
          </h2>

          <div className="flex items-center justify-between my-2">
            <div className="relative h-28 w-28 shrink-0">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={STATUS_DATA}
                      innerRadius={36}
                      outerRadius={48}
                      dataKey="value"
                    >
                      {STATUS_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-mono font-bold text-xs text-white">128</span>
                <span className="text-[8px] text-zinc-400">Annonces</span>
              </div>
            </div>

            <div className="space-y-1 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-zinc-300">Actives</span>
                <span className="font-mono font-bold text-white ml-auto">86 (67,2%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-zinc-300">En attente</span>
                <span className="font-mono font-bold text-white ml-auto">12 (9,4%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-zinc-500" />
                <span className="text-zinc-300">Désactivées</span>
                <span className="font-mono font-bold text-white ml-auto">18 (14,1%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-zinc-300">Expirées</span>
                <span className="font-mono font-bold text-white ml-auto">12 (9,4%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Plateformes connectées */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between shadow-md space-y-2">
          <div className="flex items-center justify-between border-b border-[#202028] pb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Plateformes connectées
            </h2>
            <Link href="/listings/platforms" className="text-[10px] text-red-400 hover:underline">
              Gérer
            </Link>
          </div>

          <div className="space-y-1.5 text-[11px]">
            {[
              { name: 'Avito.ma', status: 'Actif', ok: true },
              { name: 'Moteur.ma', status: 'Actif', ok: true },
              { name: 'Auto24.ma', status: 'Actif', ok: true },
              { name: 'Facebook Marketplace', status: 'Actif', ok: true },
              { name: 'Instagram Shopping', status: 'Actif', ok: true },
            ].map((p, idx) => (
              <div key={idx} className="flex items-center justify-between p-1.5 rounded bg-[#16161c] border border-[#202028]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-white">{p.name}</span>
                </div>
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/30">
                  {p.status}
                </span>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-zinc-400 text-center pt-1">
            +5 autres plateformes partenaires actives
          </div>
        </div>

        {/* Card 3: Leads ce mois (Line Chart) */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 flex flex-col justify-between shadow-md space-y-2">
          <div className="flex items-center justify-between border-b border-[#202028] pb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Leads ce mois
            </h2>
            <span className="font-mono font-bold text-cyan-400 text-xs">245 Total leads</span>
          </div>

          <div className="h-28 w-full">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={LEADS_TREND} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#71717a" fontSize={9} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={9} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#141418',
                      borderColor: '#282834',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: '#fff',
                    }}
                  />
                  <Line type="monotone" dataKey="leads" stroke="#ef4444" strokeWidth={2} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid grid-cols-3 gap-1 text-center text-[9px] pt-1 border-t border-[#202028]">
            <div>
              <div className="font-bold text-white">168 (68,6%)</div>
              <div className="text-zinc-400">Nouveaux</div>
            </div>
            <div>
              <div className="font-bold text-cyan-400">53 (21,7%)</div>
              <div className="text-zinc-400">Contactés</div>
            </div>
            <div>
              <div className="font-bold text-emerald-400">24 (10,7%)</div>
              <div className="text-zinc-400">Convertis</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar matching Reference #38 Screen 1 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-3 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5 items-center">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une annonce, véhicule..."
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] pl-8 pr-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none"
            >
              <option value="Tous">Statut : Tous</option>
              <option value="Active">Active</option>
              <option value="En attente">En attente</option>
              <option value="Désactivée">Désactivée</option>
            </select>
          </div>

          <div>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-zinc-300 focus:outline-none"
            >
              <option value="Toutes">Plateforme : Toutes</option>
              <option value="Avito">Avito.ma</option>
              <option value="Moteur">Moteur.ma</option>
              <option value="Auto24">Auto24</option>
              <option value="Facebook">Facebook Marketplace</option>
            </select>
          </div>

          <div>
            <input
              type="text"
              placeholder="Prix max (DH)"
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>

          <div>
            <button
              onClick={() => {
                setSearch('')
                setStatusFilter('Tous')
                setPlatformFilter('Toutes')
              }}
              className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] text-[11px] font-semibold text-zinc-300 hover:text-white flex items-center justify-center gap-1"
            >
              <Filter className="h-3 w-3 text-zinc-400" />
              <span>Réinitialiser</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table matching Reference #38 Screen 1 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase">
                <th className="py-2.5 px-3">Véhicule / Titre</th>
                <th className="py-2.5 px-3 font-mono text-right">Prix</th>
                <th className="py-2.5 px-3 text-center">Statut</th>
                <th className="py-2.5 px-3">Plateformes</th>
                <th className="py-2.5 px-3 font-mono text-center">Vues</th>
                <th className="py-2.5 px-3 font-mono text-center">Leads</th>
                <th className="py-2.5 px-3 font-mono">Créée le</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24] text-[11px]">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{item.thumb}</span>
                      <div>
                        <Link href={`/listings/${item.id}`} className="font-bold text-white hover:text-red-400 hover:underline">
                          {item.title}
                        </Link>
                        <div className="text-[10px] text-zinc-400">{item.version}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-white text-right">
                    {item.price.toLocaleString('fr-FR')} DH
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[9px] font-bold ${
                        item.status === 'Active'
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                          : item.status === 'En attente'
                          ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1">
                      {item.platforms.map((pl, i) => (
                        <span key={i} className="rounded bg-zinc-800 border border-zinc-700 px-1.5 py-0.2 text-[9px] text-zinc-300">
                          {pl}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-zinc-200 text-center font-semibold">
                    {item.views.toLocaleString('fr-FR')}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-cyan-400 text-center">
                    {item.leads}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-zinc-400 text-[10px]">
                    {item.createdAt}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Link
                        href={`/listings/${item.id}`}
                        className="p-1 rounded text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800"
                        title="Prévisualiser"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/listings/platforms`}
                        className="p-1 rounded text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800"
                        title="Diffuser"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination matching Reference #38 Screen 1 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-[11px] text-zinc-400">
          <span>Affichage de 1 à {filtered.length} sur 128 annonces</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
                &lt;
              </button>
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
              <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
                5
              </button>
              <span className="text-zinc-600 px-1">...</span>
              <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
                26
              </button>
              <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
