'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'

interface TechUser {
  id: string
  name: string
  initials: string
  utilization: number
  utilColor: string
}

const TECHNICIANS: TechUser[] = [
  { id: '1', name: 'Yassine Benali', initials: 'YB', utilization: 92, utilColor: 'text-red-400' },
  { id: '2', name: 'Mehdi Kacem', initials: 'MK', utilization: 78, utilColor: 'text-emerald-400' },
  { id: '3', name: 'Karim Zahid', initials: 'KZ', utilization: 65, utilColor: 'text-amber-400' },
  { id: '4', name: 'Sofiane Hadid', initials: 'SH', utilization: 55, utilColor: 'text-amber-400' },
  { id: '5', name: 'Rachid Amine', initials: 'RA', utilization: 40, utilColor: 'text-cyan-400' },
]

const DAYS = ['Lun 19/05', 'Mar 20/05', 'Mer 21/05', 'Jeu 22/05', 'Ven 23/05', 'Sam 24/05']

const BLOCKS = [
  { day: 0, time: '08:00 - 10:00', code: 'OT-0123', label: 'Révision', bg: 'bg-blue-600/30 border-blue-500/50 text-blue-300' },
  { day: 1, time: '08:00 - 10:00', code: 'OT-0124', label: 'Freins AV', bg: 'bg-blue-600/30 border-blue-500/50 text-blue-300' },
  { day: 2, time: '08:00 - 10:00', code: 'OT-0124', label: 'Vidange', bg: 'bg-red-600/30 border-red-500/50 text-red-300' },
  { day: 3, time: '08:00 - 10:00', code: 'OT-0128', label: 'Diagnostic', bg: 'bg-red-600/30 border-red-500/50 text-red-300' },
  { day: 4, time: '08:00 - 10:00', code: 'OT-0123', label: 'Distribution', bg: 'bg-amber-600/30 border-amber-500/50 text-amber-300' },

  { day: 0, time: '10:00 - 12:00', code: 'OT-0126', label: 'Diagnostic', bg: 'bg-amber-600/30 border-amber-500/50 text-amber-300' },
  { day: 1, time: '10:00 - 12:00', code: 'OT-0125', label: 'Freins AV', bg: 'bg-emerald-600/30 border-emerald-500/50 text-emerald-300' },
  { day: 2, time: '10:00 - 12:00', code: 'OT-0131', label: 'Distribution', bg: 'bg-blue-600/30 border-blue-500/50 text-blue-300' },
  { day: 3, time: '10:00 - 12:00', code: 'OT-0127', label: 'Pneus', bg: 'bg-blue-600/30 border-blue-500/50 text-blue-300' },
  { day: 4, time: '10:00 - 12:00', code: 'OT-0125', label: 'Électronique', bg: 'bg-purple-600/30 border-purple-500/50 text-purple-300' },

  { day: 0, time: '12:00 - 14:00', code: 'OT-0131', label: 'Diagnostic', bg: 'bg-cyan-600/30 border-cyan-500/50 text-cyan-300' },
  { day: 1, time: '12:00 - 14:00', code: 'OT-0128', label: 'Diagnostic', bg: 'bg-purple-600/30 border-purple-500/50 text-purple-300' },
  { day: 3, time: '12:00 - 14:00', code: 'OT-0123', label: 'Direction', bg: 'bg-red-600/30 border-red-500/50 text-red-300' },
  { day: 4, time: '12:00 - 14:00', code: 'OT-0129', label: 'Embrayage', bg: 'bg-purple-600/30 border-purple-500/50 text-purple-300' },

  { day: 2, time: '14:00 - 16:00', code: 'OT-0129', label: 'Distribution', bg: 'bg-blue-600/30 border-blue-500/50 text-blue-300' },
  { day: 3, time: '14:00 - 16:00', code: 'OT-0130', label: 'Climatisation', bg: 'bg-blue-600/30 border-blue-500/50 text-blue-300' },

  { day: 0, time: '16:00 - 18:00', code: 'OT-0130', label: 'Pneus', bg: 'bg-cyan-600/30 border-cyan-500/50 text-cyan-300' },
  { day: 4, time: '16:00 - 18:00', code: 'OT-0131', label: 'Pneus', bg: 'bg-cyan-600/30 border-cyan-500/50 text-cyan-300' },
]

export default function WorkshopPlanningPage() {
  const [viewMode, setViewMode] = useState('Semaine')

  return (
    <div className="space-y-5 text-xs text-white">
      <PageHeader
        title="Planning atelier"
        subtitle="Planifiez et visualisez la charge de travail de l’atelier."
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Atelier', href: '/workshop' },
          { label: 'Planning' },
        ]}
        actions={
          <Link
            href="/workshop"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Tableau de bord</span>
          </Link>
        }
      />

      {/* Planning Controls Bar matching Reference #10 Screen 5 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#222228] bg-[#121216] p-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Picker Range */}
          <div className="flex items-center gap-2 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-white">
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            <span>19/05/2025 – 25/05/2025 ⌄</span>
          </div>

          {/* View Switcher */}
          <div className="flex items-center rounded-lg border border-[#282834] bg-[#18181f] p-0.5 text-xs">
            {['Jour', 'Semaine', 'Mois'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`rounded px-3 py-1 font-bold transition-all ${
                  viewMode === mode
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Technician Select */}
          <select className="h-8 rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none">
            <option>Tous les techniciens ⌄</option>
            <option>Yassine Benali</option>
            <option>Mehdi Kacem</option>
            <option>Karim Zahid</option>
          </select>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            Aujourd’hui
          </button>
          <div className="flex items-center gap-1">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Schedule & Technician Grid matching Reference #10 Screen 5 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-4 shadow-sm overflow-x-auto">
        <div className="min-w-[900px] grid grid-cols-12 gap-3">
          {/* Left Col: Technicians List (3 cols) */}
          <div className="col-span-3 border-r border-[#222228] pr-3 space-y-3">
            <div className="flex justify-between text-[11px] font-bold text-zinc-400 pb-2 border-b border-[#222228]">
              <span>Techniciens</span>
              <span>Utilisation</span>
            </div>

            <div className="space-y-4 pt-1">
              {TECHNICIANS.map((tech) => (
                <div key={tech.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600/20 text-red-400 font-bold text-xs border border-red-500/30">
                      {tech.initials}
                    </div>
                    <span className="font-semibold text-white text-xs">{tech.name}</span>
                  </div>
                  <span className={`font-mono font-bold text-xs ${tech.utilColor}`}>
                    {tech.utilization}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Col: Days Calendar Grid (9 cols) */}
          <div className="col-span-9 space-y-3">
            {/* Header Days */}
            <div className="grid grid-cols-6 gap-2 text-center text-xs font-bold text-zinc-300 pb-2 border-b border-[#222228]">
              {DAYS.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            {/* Time Slot Rows with Intervention Cards */}
            <div className="space-y-2 relative">
              {['08:00', '10:00', '12:00', '14:00', '16:00'].map((timeSlot) => (
                <div key={timeSlot} className="grid grid-cols-6 gap-2 min-h-[64px] items-stretch">
                  {DAYS.map((_, dayIdx) => {
                    const block = BLOCKS.find((b) => b.day === dayIdx && b.time.startsWith(timeSlot))
                    return (
                      <div
                        key={dayIdx}
                        className="rounded-lg border border-[#1f1f28] bg-[#141419] p-1.5 flex flex-col justify-between"
                      >
                        {block ? (
                          <Link
                            href={`/workshop/${block.code}`}
                            className={`block h-full rounded-md border p-1.5 ${block.bg} transition-transform hover:scale-[1.02] shadow-sm`}
                          >
                            <span className="font-mono font-bold text-[10px] block leading-tight">
                              {block.code}
                            </span>
                            <span className="text-[10px] font-medium block truncate mt-0.5">
                              {block.label}
                            </span>
                          </Link>
                        ) : (
                          <div className="h-full flex items-center justify-center text-[10px] text-zinc-700">
                            —
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend Footer matching Reference #10 Screen 5 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#222228] text-[11px]">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <span className="h-2.5 w-2.5 rounded-sm bg-blue-500 inline-block" />
              <span>Entretien</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <span className="h-2.5 w-2.5 rounded-sm bg-cyan-500 inline-block" />
              <span>Mécanique</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500 inline-block" />
              <span>Électronique</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <span className="h-2.5 w-2.5 rounded-sm bg-amber-500 inline-block" />
              <span>Carrosserie</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <span className="h-2.5 w-2.5 rounded-sm bg-purple-500 inline-block" />
              <span>Autres</span>
            </div>
          </div>

          <span className="text-zinc-500 text-[10px] italic">
            Glisser-déposer pour déplacer un O.T.
          </span>
        </div>
      </div>
    </div>
  )
}
