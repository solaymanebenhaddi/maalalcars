'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Mail,
  Smartphone,
  Phone,
  Filter,
} from 'lucide-react'

interface HistoryItem {
  id: string
  date: string
  channel: 'Email' | 'SMS' | 'WhatsApp' | 'Appel'
  title: string
  preview: string
}

const HISTORY_ITEMS: HistoryItem[] = [
  {
    id: '1',
    date: '15/05/2025 10:32',
    channel: 'Email',
    title: 'Essai Audi Q7',
    preview: 'Parfait, je serai présent vendredi à 10h.',
  },
  {
    id: '2',
    date: '11/05/2025 16:45',
    channel: 'SMS',
    title: 'Confirmation rendez-vous',
    preview: 'Votre rendez-vous du 15/05 à 10h est confirmé.',
  },
  {
    id: '3',
    date: '14/05/2025 14:20',
    channel: 'Appel',
    title: 'Appel sortant',
    preview: 'Durée : 00:02:45 — Entretien commercial avec Omar Tazi.',
  },
  {
    id: '4',
    date: '14/05/2025 14:20',
    channel: 'WhatsApp',
    title: 'Rappel test drive',
    preview: 'N’oubliez pas votre essai demain à 10h au showroom MAALAL CARS.',
  },
  {
    id: '5',
    date: '13/05/2025 11:10',
    channel: 'Email',
    title: 'Devis Audi Q7',
    preview: 'Voici le devis demandé pour Audi Q7 45 TDI Quattro (589 000 DH).',
  },
]

export default function CommunicationHistoryPage() {
  const [activeTab, setActiveTab] = useState<'Tous' | 'Email' | 'SMS' | 'WhatsApp' | 'Appel'>('Tous')

  const filtered = HISTORY_ITEMS.filter((item) => {
    if (activeTab === 'Tous') return true
    return item.channel === activeTab
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
          <span className="font-semibold text-white">Historique par client</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <Filter className="h-3.5 w-3.5 text-zinc-400" />
            <span>Filtrer</span>
          </button>
        </div>
      </div>

      {/* Client Header Card matching Reference #37 Screen 5 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-600/15 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 text-sm">
            O
          </div>
          <div>
            <h1 className="text-base font-black text-white">Omar Tazi</h1>
            <div className="text-[11px] text-zinc-400 font-mono">
              omar.tazi@email.com · +212 6 55 66 77 88 · Client depuis 10/01/2025
            </div>
          </div>
        </div>

        <span className="rounded bg-zinc-800 px-3 py-1 text-[11px] font-mono text-zinc-300 border border-zinc-700">
          24 échanges au total
        </span>
      </div>

      {/* Tabs Filter matching Reference #37 Screen 5 */}
      <div className="flex items-center gap-1.5 border-b border-[#222228] pb-1">
        {[
          { id: 'Tous', label: 'Tous (24)' },
          { id: 'Email', label: 'Emails (12)' },
          { id: 'SMS', label: 'SMS (6)' },
          { id: 'WhatsApp', label: 'WhatsApp (4)' },
          { id: 'Appel', label: 'Appels (2)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-3 py-1.5 rounded-t-lg font-semibold text-xs transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-red-500 text-white bg-[#141418]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Timeline List matching Reference #37 Screen 5 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-3">
        <div className="space-y-2.5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl border border-[#222228] bg-[#16161c] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                    item.channel === 'WhatsApp'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : item.channel === 'Email'
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      : item.channel === 'SMS'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  }`}
                >
                  {item.channel === 'WhatsApp' && <span className="font-bold text-xs">WA</span>}
                  {item.channel === 'Email' && <Mail className="h-4 w-4" />}
                  {item.channel === 'SMS' && <Smartphone className="h-4 w-4" />}
                  {item.channel === 'Appel' && <Phone className="h-4 w-4" />}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{item.title}</span>
                    <span className="font-mono text-[10px] text-zinc-400">{item.date}</span>
                  </div>
                  <p className="text-xs text-zinc-300">{item.preview}</p>
                </div>
              </div>

              <span className="font-mono text-[10px] text-zinc-400 shrink-0 self-end sm:self-auto">
                Canal : {item.channel}
              </span>
            </div>
          ))}
        </div>

        {/* Footer Pagination */}
        <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-3 border-t border-[#202028]">
          <span>Affichage de 1 à {filtered.length} sur 24 communications</span>
          <div className="flex items-center gap-1">
            <button className="h-6 w-6 rounded border border-[#282834] bg-[#18181f] text-zinc-400">&lt;</button>
            <button className="h-6 w-6 rounded bg-red-600 text-white font-bold">1</button>
            <button className="h-6 w-6 rounded border border-[#282834] bg-[#18181f] text-zinc-400">2</button>
            <button className="h-6 w-6 rounded border border-[#282834] bg-[#18181f] text-zinc-400">3</button>
            <button className="h-6 w-6 rounded border border-[#282834] bg-[#18181f] text-zinc-400">4</button>
            <button className="h-6 w-6 rounded border border-[#282834] bg-[#18181f] text-zinc-400">5</button>
            <button className="h-6 w-6 rounded border border-[#282834] bg-[#18181f] text-zinc-400">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  )
}
