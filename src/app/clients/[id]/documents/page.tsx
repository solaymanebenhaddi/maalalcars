'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  FileText,
  Download,
  Eye,
  Plus,
  MoreHorizontal,
} from 'lucide-react'

interface ClientDocument {
  id: number
  name: string
  category: string
  type: string
  date: string
  size: string
}

const CLIENT_DOCS: ClientDocument[] = [
  { id: 1, name: 'Contrat de vente BMW X3', category: 'Contrats', type: 'PDF', date: '12/05/2025', size: '1,2 MB' },
  { id: 2, name: 'Facture d\'achat', category: 'Factures', type: 'PDF', date: '12/05/2025', size: '892 KB' },
  { id: 3, name: 'Carte d\'identité', category: 'Pièces d\'identité', type: 'PDF', date: '15/03/2024', size: '756 KB' },
  { id: 4, name: 'Justificatif de domicile', category: 'Pièces d\'identité', type: 'PDF', date: '15/03/2024', size: '632 KB' },
  { id: 5, name: 'Attestation d\'assurance', category: 'Assurances', type: 'PDF', date: '20/03/2025', size: '1,1 MB' },
]

export default function ClientDocumentsPage() {
  const params = useParams()
  const code = (params?.id as string) || 'CLT-001'
  const [activeCategory, setActiveCategory] = useState('Tous les documents')

  const categories = ['Tous les documents', 'Contrats', 'Factures', 'Pièces d\'identité', 'Assurances', 'Autres']

  const filteredDocs = CLIENT_DOCS.filter(
    (d) => activeCategory === 'Tous les documents' || d.category === activeCategory
  )

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/clients/${code}`}
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour Sarah Martin</span>
        </Link>
      </div>

      {/* Main Container matching Reference #21 Screen 5 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#2e2e3a] bg-[#1a1a24]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/avatars/sarah-martin.jpg"
                alt="Sarah Martin"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-white">
                Sarah Martin
              </h1>
              <p className="text-[10px] text-zinc-400">
                Client depuis le 12 mars 2024
              </p>
            </div>
          </div>

          <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-sm transition-colors">
            <Plus className="h-3.5 w-3.5" />
            <span>Ajouter un document</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-red-600 text-white'
                  : 'border border-[#282834] bg-[#18181f] text-zinc-300 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Documents Table */}
        <div className="overflow-x-auto rounded-lg border border-[#202028]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#202028] bg-[#16161c] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Document</th>
                <th className="py-2.5 px-3">Catégorie</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 font-mono">Date</th>
                <th className="py-2.5 px-3 font-mono text-right">Taille</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-red-500 shrink-0" />
                      <span>{doc.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-zinc-300">{doc.category}</td>
                  <td className="py-3 px-3 font-mono text-zinc-400">{doc.type}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-zinc-400">{doc.date}</td>
                  <td className="py-3 px-3 font-mono text-right text-zinc-400">{doc.size}</td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800" title="Télécharger">
                        <Download className="h-3.5 w-3.5" />
                      </button>
                      <button className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800" title="Aperçu">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800" title="Plus">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 text-[11px] text-zinc-400">
          <span>Affichage 1 à 5 sur 5 documents</span>
          <div className="flex items-center gap-1">
            <button className="flex h-6 w-6 items-center justify-center rounded bg-red-600 text-white font-bold text-xs">
              1
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              2
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
