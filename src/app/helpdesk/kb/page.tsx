'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  BookOpen,
  Plus,
  Search,
  Folder,
  ArrowUpRight,
} from 'lucide-react'

interface KbArticle {
  id: string
  title: string
  category: string
  views: number
  helpfulPct: string
  updatedAt: string
}

const ARTICLES: KbArticle[] = [
  {
    id: '1',
    title: 'Comment suivre ma commande ?',
    category: 'Commandes',
    views: 156,
    helpfulPct: '94%',
    updatedAt: '12/06/2025',
  },
  {
    id: '2',
    title: 'Quels sont les délais de livraison ?',
    category: 'Livraison',
    views: 98,
    helpfulPct: '91%',
    updatedAt: '10/06/2025',
  },
  {
    id: '3',
    title: 'Comment effectuer un retour ?',
    category: 'Retours',
    views: 74,
    helpfulPct: '88%',
    updatedAt: '09/06/2025',
  },
  {
    id: '4',
    title: 'Quels sont les modes de paiement acceptés ?',
    category: 'Paiements',
    views: 58,
    helpfulPct: '92%',
    updatedAt: '07/06/2025',
  },
  {
    id: '5',
    title: 'Comment changer mes informations personnelles ?',
    category: 'Compte & profil',
    views: 42,
    helpfulPct: '87%',
    updatedAt: '05/06/2025',
  },
]

const CATEGORIES = [
  { name: 'Toutes les catégories', count: 86 },
  { name: 'Commandes', count: 18 },
  { name: 'Livraison', count: 12 },
  { name: 'Paiements', count: 16 },
  { name: 'Retours & remboursements', count: 14 },
  { name: 'Produits', count: 16 },
  { name: 'Compte & profil', count: 10 },
]

export default function KnowledgeBasePage() {
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('Toutes les catégories')

  const filtered = ARTICLES.filter((art) => {
    if (selectedCat !== 'Toutes les catégories' && art.category !== selectedCat) {
      return false
    }
    if (search.trim()) {
      return art.title.toLowerCase().includes(search.toLowerCase())
    }
    return true
  })

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Top Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-zinc-400">
          <Link
            href="/helpdesk"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Tableau de bord</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300">Support</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="font-semibold text-white">Base de connaissances</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/helpdesk/kb/new"
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Nouvel article</span>
          </Link>
        </div>
      </div>

      {/* Header Banner */}
      <div className="border-b border-[#222228] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-red-500" />
            <span>Base de connaissances</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Articles, guides pratiques et foire aux questions pour les clients et conseillers.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un article..."
            className="h-8 w-full rounded-lg border border-[#282834] bg-[#141418] pl-8 pr-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* 4 KPI Cards matching Reference #39 Screen 2 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Articles publiés</span>
          <div className="text-xl font-black font-mono text-white mt-1">86</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 12 ce mois</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Vues d&apos;articles</span>
          <div className="text-xl font-black font-mono text-cyan-400 mt-1">356</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 26,4%</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Recherches</span>
          <div className="text-xl font-black font-mono text-amber-400 mt-1">242</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 18,1%</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-3.5 flex flex-col justify-between">
          <span className="text-[10px] text-zinc-400 font-semibold">Utilité moyenne</span>
          <div className="text-xl font-black font-mono text-emerald-400 mt-1">89%</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>+ 6%</span>
          </div>
        </div>
      </div>

      {/* Layout matching Reference #39 Screen 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Catégories (span-4) */}
        <div className="lg:col-span-4 rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-2">
            Catégories
          </h2>

          <div className="space-y-1">
            {CATEGORIES.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCat(cat.name)}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                  selectedCat === cat.name
                    ? 'bg-red-600/15 border border-red-500/40 text-white font-bold'
                    : 'text-zinc-300 hover:bg-[#16161c] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Folder className={`h-3.5 w-3.5 ${selectedCat === cat.name ? 'text-red-400' : 'text-zinc-500'}`} />
                  <span>{cat.name}</span>
                </div>
                <span className="font-mono text-[10px] text-zinc-400">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Articles récents (span-8) */}
        <div className="lg:col-span-8 rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#202028] pb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Articles récents · {selectedCat}
            </h2>
            <span className="text-[10px] text-zinc-400">{filtered.length} articles trouvés</span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#202028]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase">
                  <th className="py-2.5 px-3">Article</th>
                  <th className="py-2.5 px-3">Catégorie</th>
                  <th className="py-2.5 px-3 font-mono text-center">Vues</th>
                  <th className="py-2.5 px-3 font-mono text-center">Utilité</th>
                  <th className="py-2.5 px-3 font-mono text-right">MàJ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24] text-[11px]">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#18181f] transition-colors">
                    <td className="py-2.5 px-3">
                      <Link href={`/helpdesk/kb/new`} className="font-semibold text-white hover:text-red-400 hover:underline">
                        {item.title}
                      </Link>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="rounded bg-zinc-800 border border-zinc-700 px-2 py-0.5 text-[10px] text-zinc-300">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-zinc-200 text-center font-semibold">
                      {item.views}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-emerald-400 text-center font-bold">
                      {item.helpfulPct}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-zinc-400 text-[10px] text-right">
                      {item.updatedAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center pt-2">
            <button className="text-[11px] text-zinc-400 hover:text-white border border-[#282834] bg-[#141418] px-4 py-1.5 rounded-lg">
              Voir tous les articles
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
