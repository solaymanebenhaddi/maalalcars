'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'

interface BayAvailability {
  name: string
  sub: string
  rates: {
    lun: { val: string; type: 'green' | 'amber' | 'red' | 'closed' }
    mar: { val: string; type: 'green' | 'amber' | 'red' | 'closed' }
    mer: { val: string; type: 'green' | 'amber' | 'red' | 'closed' }
    jeu: { val: string; type: 'green' | 'amber' | 'red' | 'closed' }
    ven: { val: string; type: 'green' | 'amber' | 'red' | 'closed' }
    sam: { val: string; type: 'none' | 'closed' }
    dim: { val: string; type: 'closed' }
  }
}

const BAYS: BayAvailability[] = [
  {
    name: 'Atelier 1',
    sub: 'Mécanique',
    rates: {
      lun: { val: '20%', type: 'green' },
      mar: { val: '40%', type: 'green' },
      mer: { val: '45%', type: 'green' },
      jeu: { val: '35%', type: 'green' },
      ven: { val: '10%', type: 'amber' },
      sam: { val: '—', type: 'none' },
      dim: { val: 'Fermé', type: 'closed' },
    },
  },
  {
    name: 'Atelier 2',
    sub: 'Électricité',
    rates: {
      lun: { val: '25%', type: 'amber' },
      mar: { val: '18%', type: 'red' },
      mer: { val: '40%', type: 'green' },
      jeu: { val: '25%', type: 'amber' },
      ven: { val: '35%', type: 'green' },
      sam: { val: '—', type: 'none' },
      dim: { val: 'Fermé', type: 'closed' },
    },
  },
  {
    name: 'Atelier 3',
    sub: 'Diagnostic',
    rates: {
      lun: { val: '30%', type: 'amber' },
      mar: { val: '20%', type: 'amber' },
      mer: { val: '10%', type: 'red' },
      jeu: { val: '25%', type: 'amber' },
      ven: { val: '20%', type: 'amber' },
      sam: { val: '—', type: 'none' },
      dim: { val: 'Fermé', type: 'closed' },
    },
  },
  {
    name: 'Carrosserie',
    sub: '',
    rates: {
      lun: { val: '20%', type: 'amber' },
      mar: { val: '10%', type: 'red' },
      mer: { val: '10%', type: 'red' },
      jeu: { val: '30%', type: 'amber' },
      ven: { val: '35%', type: 'green' },
      sam: { val: '—', type: 'none' },
      dim: { val: 'Fermé', type: 'closed' },
    },
  },
  {
    name: 'Pneumatiques',
    sub: '',
    rates: {
      lun: { val: '30%', type: 'amber' },
      mar: { val: '15%', type: 'red' },
      mer: { val: '10%', type: 'red' },
      jeu: { val: '15%', type: 'red' },
      ven: { val: '20%', type: 'amber' },
      sam: { val: '—', type: 'none' },
      dim: { val: 'Fermé', type: 'closed' },
    },
  },
]

const TYPE_STYLES = {
  green: 'text-emerald-400 font-bold',
  amber: 'text-amber-400 font-bold',
  red: 'text-red-400 font-bold',
  none: 'text-zinc-600',
  closed: 'text-zinc-500 font-medium',
}

export default function AppointmentAvailabilityPage() {
  const [viewMode, setViewMode] = useState('Semaine')

  return (
    <div className="space-y-5 max-w-5xl mx-auto text-xs text-white">
      <PageHeader
        title="Disponibilités des ateliers"
        subtitle="Visualisez la charge et les créneaux disponibles par baie d’atelier."
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Agenda & RDV', href: '/appointments' },
          { label: 'Disponibilités' },
        ]}
        actions={
          <Link
            href="/appointments"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Retour agenda</span>
          </Link>
        }
      />

      {/* Main Grid Container matching Reference #11 Screen 28C */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-4 shadow-xl">
        {/* Controls Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-xs">Disponibilités des ateliers</span>
            <div className="flex items-center gap-1.5 rounded bg-[#18181f] border border-[#282834] px-2.5 py-0.5 text-[11px] text-zinc-300">
              <Calendar className="h-3 w-3 text-zinc-400" />
              <span>26 mai 2025 – 01 juin 2025</span>
            </div>
          </div>

          <div className="flex items-center rounded-lg border border-[#282834] bg-[#18181f] p-0.5 text-xs">
            {['Jour', 'Semaine', 'Mois'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`rounded px-3 py-1 font-bold transition-all ${
                  viewMode === mode
                    ? 'bg-red-600 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs">
            <thead>
              <tr className="border-b border-[#222228] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="pb-3 text-left">Atelier</th>
                <th className="pb-3">Lun 26</th>
                <th className="pb-3">Mar 27</th>
                <th className="pb-3">Mer 28</th>
                <th className="pb-3">Jeu 29</th>
                <th className="pb-3">Ven 30</th>
                <th className="pb-3">Sam 31</th>
                <th className="pb-3">Dim 01</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {BAYS.map((bay) => (
                <tr key={bay.name} className="hover:bg-[#18181f] transition-colors">
                  <td className="py-3.5 text-left">
                    <div className="font-bold text-white text-xs">{bay.name}</div>
                    {bay.sub && <div className="text-[10px] text-zinc-400">{bay.sub}</div>}
                  </td>
                  <td className={`py-3.5 font-mono ${TYPE_STYLES[bay.rates.lun.type]}`}>
                    {bay.rates.lun.val}
                  </td>
                  <td className={`py-3.5 font-mono ${TYPE_STYLES[bay.rates.mar.type]}`}>
                    {bay.rates.mar.val}
                  </td>
                  <td className={`py-3.5 font-mono ${TYPE_STYLES[bay.rates.mer.type]}`}>
                    {bay.rates.mer.val}
                  </td>
                  <td className={`py-3.5 font-mono ${TYPE_STYLES[bay.rates.jeu.type]}`}>
                    {bay.rates.jeu.val}
                  </td>
                  <td className={`py-3.5 font-mono ${TYPE_STYLES[bay.rates.ven.type]}`}>
                    {bay.rates.ven.val}
                  </td>
                  <td className={`py-3.5 font-mono ${TYPE_STYLES[bay.rates.sam.type]}`}>
                    {bay.rates.sam.val}
                  </td>
                  <td className={`py-3.5 font-mono ${TYPE_STYLES[bay.rates.dim.type]}`}>
                    {bay.rates.dim.val}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend Footer matching Reference #11 Screen 28C */}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-[#222228] text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
            <span className="text-zinc-300 font-medium">Disponible (&gt; 40%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block" />
            <span className="text-zinc-300 font-medium">Moyen (20% – 40%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 inline-block" />
            <span className="text-zinc-300 font-medium">Faible (&lt; 20%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-950 border border-red-700 inline-block" />
            <span className="text-zinc-300 font-medium">Complet (0%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-600 inline-block" />
            <span className="text-zinc-300 font-medium">Fermé</span>
          </div>
        </div>
      </div>
    </div>
  )
}
