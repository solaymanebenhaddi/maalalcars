'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Search,
  Filter,
  ArrowUpDown,
  Kanban,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'

const STAGES = [
  {
    id: 'SUBMITTED',
    title: 'Soumis',
    count: 32,
    border: 'border-t-4 border-blue-500',
    headerBg: 'bg-blue-500/10 text-blue-400',
    cards: [
      { id: '1', code: 'FIN-2025-00570', clientName: 'Sara Martin', amount: '24 500 DH', partner: 'Wafasalaf', date: '31/05/2025' },
      { id: '2', code: 'FIN-2025-00564', clientName: 'Mehdi Amrani', amount: '31 200 DH', partner: 'Wafasalaf', date: '30/05/2025' },
    ],
  },
  {
    id: 'IN_ANALYSIS',
    title: 'En analyse',
    count: 28,
    border: 'border-t-4 border-amber-500',
    headerBg: 'bg-amber-500/10 text-amber-400',
    cards: [
      { id: '3', code: 'FIN-2025-00568', clientName: 'Yassine Benali', amount: '32 500 DH', partner: 'CIM Finance', date: '31/05/2025' },
      { id: '4', code: 'FIN-2025-00571', clientName: 'Salma Mansouri', amount: '27 100 DH', partner: 'Eqdom', date: '29/05/2025' },
    ],
  },
  {
    id: 'VERIFICATION',
    title: 'Vérification',
    count: 21,
    border: 'border-t-4 border-purple-500',
    headerBg: 'bg-purple-500/10 text-purple-400',
    cards: [
      { id: '5', code: 'FIN-2025-00567', clientName: 'Sara Martin', amount: '33 900 DH', partner: 'Wafasalaf', date: '31/05/2025' },
      { id: '6', code: 'FIN-2025-00572', clientName: 'Leila Haddad', amount: '27 900 DH', partner: 'Saham Assurance', date: '28/05/2025' },
    ],
  },
  {
    id: 'APPROVED',
    title: 'Approbation',
    count: 36,
    border: 'border-t-4 border-emerald-500',
    headerBg: 'bg-emerald-500/10 text-emerald-400',
    cards: [
      { id: '7', code: 'FIN-2025-00566', clientName: 'Karim Lahlou', amount: '28 300 DH', partner: 'CIM Finance', date: '31/05/2025' },
      { id: '8', code: 'FIN-2025-00573', clientName: 'Omar El Idrissi', amount: '22 900 DH', partner: 'Salafin', date: '27/05/2025' },
    ],
  },
  {
    id: 'CONTRACT',
    title: 'Contrat',
    count: 8,
    border: 'border-t-4 border-cyan-500',
    headerBg: 'bg-cyan-500/10 text-cyan-400',
    cards: [
      { id: '9', code: 'FIN-2025-00565', clientName: 'Imane Zahra', amount: '21 900 DH', partner: 'Saham Assurance', date: '30/05/2025' },
      { id: '10', code: 'FIN-2025-00574', clientName: 'Omar Daoudi', amount: '27 100 DH', partner: 'CIM Finance', date: '26/05/2025' },
    ],
  },
  {
    id: 'DISBURSED',
    title: 'Décaissé',
    count: 3,
    border: 'border-t-4 border-lime-500',
    headerBg: 'bg-lime-500/10 text-lime-400',
    cards: [
      { id: '11', code: 'FIN-2025-00569', clientName: 'Brahim Tazi', amount: '27 800 DH', partner: 'Eqdom', date: '25/05/2025' },
      { id: '12', code: 'FIN-2025-00575', clientName: 'Omar Idrissi', amount: '25 100 DH', partner: 'Wafasalaf', date: '24/05/2025' },
    ],
  },
]

export default function FinancingPipelinePage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-5 text-xs text-white">
      <PageHeader
        title="Suivi d’Approbation des Financements"
        subtitle="Pipeline Kanban en temps réel des dossiers de crédit et LLD par étape de validation"
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Financement', href: '/financing' },
          { label: 'Suivi d’approbation' },
        ]}
        actions={
          <Link
            href="/financing"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour</span>
          </Link>
        }
      />

      {/* Top Filter Bar matching Reference #09 Screen 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#222228] bg-[#121216] p-3">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-cyan-400">
            <Kanban className="h-3.5 w-3.5" />
            <span>Vue Kanban</span>
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <ArrowUpDown className="h-3.5 w-3.5 text-zinc-500" />
            <span>Trier par date ⌄</span>
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <Filter className="h-3.5 w-3.5 text-zinc-500" />
            <span>Filtre ⌄</span>
          </button>
        </div>

        <div className="relative flex items-center max-w-xs w-full">
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] pl-8 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none"
          />
        </div>
      </div>

      {/* 6-Column Kanban Board matching Reference #09 Screen 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {STAGES.map((col) => (
          <div
            key={col.id}
            className={`rounded-2xl border border-[#222228] bg-[#121216] p-3 flex flex-col justify-between ${col.border} min-h-[500px] shadow-sm`}
          >
            {/* Column Header */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#222228]">
                <span className="font-bold text-xs text-white">{col.title}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-black ${col.headerBg}`}>
                  {col.count}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-2.5">
                {col.cards.map((card) => (
                  <Link
                    key={card.id}
                    href={`/financing/${card.code}`}
                    className="block rounded-xl border border-[#262632] bg-[#18181f] p-3 space-y-2 hover:border-zinc-400 hover:bg-[#1e1e26] transition-all group"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-white group-hover:text-cyan-400">
                        {card.code}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">{card.date}</span>
                    </div>

                    <div className="text-xs font-semibold text-zinc-200">
                      {card.clientName}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#22222a] text-[11px]">
                      <span className="font-mono font-black text-emerald-400">
                        {card.amount}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-medium">
                        {card.partner}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer Add */}
            <div className="pt-3 border-t border-[#222228]">
              <Link
                href="/financing/new"
                className="block text-center py-1.5 rounded-lg border border-dashed border-[#333340] text-zinc-400 hover:text-white hover:border-zinc-400 transition-colors text-[11px]"
              >
                + Nouveau
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
