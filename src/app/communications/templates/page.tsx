'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  FileText,
  Plus,
  Search,
  Edit2,
  Copy,
} from 'lucide-react'

interface MessageTemplate {
  id: string
  name: string
  channel: 'Email' | 'SMS' | 'WhatsApp'
  category: string
  updatedAt: string
}

const TEMPLATES: MessageTemplate[] = [
  { id: '1', name: 'Bienvenue client', channel: 'Email', category: 'Accueil', updatedAt: '10/05/2025' },
  { id: '2', name: 'Relance devis', channel: 'Email', category: 'Relance', updatedAt: '08/05/2025' },
  { id: '3', name: 'Confirmation rendez-vous', channel: 'SMS', category: 'Rendez-vous', updatedAt: '07/05/2025' },
  { id: '4', name: 'Remerciement achat véhicule', channel: 'Email', category: 'Fidélisation', updatedAt: '05/05/2025' },
  { id: '5', name: 'Offre spéciale destockage', channel: 'Email', category: 'Promotion', updatedAt: '03/05/2025' },
  { id: '6', name: 'Rappel entretien technique', channel: 'SMS', category: 'Service', updatedAt: '01/05/2025' },
  { id: '7', name: 'Demande avis client / Google', channel: 'Email', category: 'Satisfaction', updatedAt: '29/04/2025' },
  { id: '8', name: 'Nouveau véhicule disponible', channel: 'WhatsApp', category: 'Information', updatedAt: '27/04/2025' },
]

export default function MessageTemplatesPage() {
  const [search, setSearch] = useState('')

  const filtered = TEMPLATES.filter((t) => {
    if (search.trim()) {
      const q = search.toLowerCase()
      return t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-zinc-400">
          <Link
            href="/communications"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Boîte de réception</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300">Communications</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="font-semibold text-white">Modèles de messages</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 transition-colors">
            <Plus className="h-3.5 w-3.5" />
            <span>+ Nouveau modèle</span>
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="border-b border-[#222228] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-red-500" />
            <span>Modèles de messages prêts à l&apos;emploi</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Standardisez et accélérez vos réponses avec des modèles personnalisables.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un modèle..."
            className="h-8 w-full rounded-lg border border-[#282834] bg-[#141418] pl-8 pr-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Table matching Reference #37 Screen 4 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase">
                <th className="py-2.5 px-3">Nom du modèle</th>
                <th className="py-2.5 px-3">Canal</th>
                <th className="py-2.5 px-3">Catégorie</th>
                <th className="py-2.5 px-3 font-mono">Dernière modif.</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24] text-[11px]">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-2.5 px-3 font-bold text-white">{item.name}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[9px] font-bold ${
                        item.channel === 'WhatsApp'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : item.channel === 'Email'
                          ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {item.channel}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-zinc-300 font-medium">{item.category}</td>
                  <td className="py-2.5 px-3 font-mono text-zinc-400 text-[10px]">{item.updatedAt}</td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800" title="Copier">
                        <Copy className="h-3 w-3" />
                      </button>
                      <button className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800" title="Modifier">
                        <Edit2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2">
          <span>Affichage de 1 à {filtered.length} sur 35 modèles</span>
          <div className="flex items-center gap-1">
            <button className="h-6 w-6 rounded border border-[#282834] bg-[#18181f] text-zinc-400">&lt;</button>
            <button className="h-6 w-6 rounded bg-red-600 text-white font-bold">1</button>
            <button className="h-6 w-6 rounded border border-[#282834] bg-[#18181f] text-zinc-400">2</button>
            <button className="h-6 w-6 rounded border border-[#282834] bg-[#18181f] text-zinc-400">3</button>
            <button className="h-6 w-6 rounded border border-[#282834] bg-[#18181f] text-zinc-400">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  )
}
