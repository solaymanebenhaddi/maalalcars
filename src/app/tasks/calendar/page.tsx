'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  color: string
}

const EVENTS_BY_DAY: Record<number, CalendarEvent[]> = {
  12: [
    { id: 'e1', title: 'Préparer livraison Hilux', color: 'bg-red-500/20 text-red-300 border border-red-500/40' },
    { id: 'e2', title: 'Réunion équipe', color: 'bg-blue-500/20 text-blue-300 border border-blue-500/40' },
    { id: 'e3', title: 'Contrôle technique A6', color: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' },
    { id: 'e4', title: 'Relance devis Audi Q7', color: 'bg-amber-500/20 text-amber-300 border border-amber-500/40' },
    { id: 'e5', title: 'Approbation achat LC', color: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' },
  ],
  17: [
    { id: 'e6', title: 'Livraison GLC', color: 'bg-blue-500/20 text-blue-300 border border-blue-500/40' },
    { id: 'e7', title: 'Paiement fournisseur', color: 'bg-amber-500/20 text-amber-300 border border-amber-500/40' },
    { id: 'e8', title: 'Vérifier documents', color: 'bg-zinc-800 text-zinc-300 border border-zinc-700' },
    { id: 'e9', title: 'Checklist livraison Q7', color: 'bg-red-500/20 text-red-300 border border-red-500/40' },
  ],
  22: [
    { id: 'e10', title: 'Réception facture', color: 'bg-red-500/20 text-red-300 border border-red-500/40' },
  ],
  27: [
    { id: 'e11', title: 'Reporting direction', color: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' },
  ],
  31: [
    { id: 'e12', title: 'Inventaire stock', color: 'bg-zinc-800 text-zinc-300 border border-zinc-700' },
  ],
}

export default function TasksCalendarPage() {
  const [viewMode, setViewMode] = useState<'Jour' | 'Semaine' | 'Mois' | 'Liste'>('Mois')
  const daysOfWeek = ['Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.', 'Dim.']

  // Calendar for May 2025 (Starts on Thursday May 1)
  // Leading empty days: 3 (Mon 28 Apr, Tue 29 Apr, Wed 30 Apr)
  const calendarDays = []
  for (let i = 28; i <= 30; i++) {
    calendarDays.push({ dayNumber: i, isCurrentMonth: false })
  }
  for (let i = 1; i <= 31; i++) {
    calendarDays.push({ dayNumber: i, isCurrentMonth: true })
  }
  for (let i = 1; i <= 8; i++) {
    calendarDays.push({ dayNumber: i, isCurrentMonth: false })
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-xs text-white">
      {/* Top Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-zinc-400">
          <Link
            href="/tasks"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Vue Kanban</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-300">Tâches</span>
          <span className="text-zinc-600">&gt;</span>
          <span className="font-semibold text-white">Calendrier</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/tasks/new"
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Nouvelle tâche</span>
          </Link>
        </div>
      </div>

      {/* Calendar Controls matching Reference #36 Screen 5 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#282834] bg-[#18181f] text-zinc-300 hover:text-white">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#282834] bg-[#18181f] text-zinc-300 hover:text-white">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <span className="text-sm font-bold text-white font-mono">Mai 2025</span>
          <button className="text-[11px] text-zinc-400 hover:text-white border border-[#282834] bg-[#18181f] px-2 py-0.5 rounded">
            Aujourd&apos;hui
          </button>
        </div>

        <div className="flex items-center gap-1 bg-[#18181f] p-1 rounded-lg border border-[#282834]">
          {(['Jour', 'Semaine', 'Mois', 'Liste'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
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

      {/* Calendar Grid matching Reference #36 Screen 5 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 shadow-xl">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-[#202028] pb-2 text-center text-[11px] font-bold text-zinc-400 uppercase">
          {daysOfWeek.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Month Days Grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-[#202028] border-b border-r border-[#202028]">
          {calendarDays.map((cd, index) => {
            const events = cd.isCurrentMonth ? EVENTS_BY_DAY[cd.dayNumber] || [] : []
            return (
              <div
                key={index}
                className={`min-h-[105px] p-2 flex flex-col justify-between transition-colors ${
                  cd.isCurrentMonth ? 'bg-[#121216] hover:bg-[#16161c]' : 'bg-[#0f0f13] text-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-xs font-bold ${
                      cd.isCurrentMonth
                        ? cd.dayNumber === 15
                          ? 'h-5 w-5 rounded-full bg-red-600 text-white flex items-center justify-center'
                          : 'text-zinc-300'
                        : 'text-zinc-600'
                    }`}
                  >
                    {cd.dayNumber}
                  </span>
                </div>

                <div className="space-y-1 my-1">
                  {events.map((ev) => (
                    <div
                      key={ev.id}
                      className={`text-[9px] font-semibold px-1.5 py-0.5 rounded truncate ${ev.color}`}
                      title={ev.title}
                    >
                      {ev.title}
                    </div>
                  ))}
                </div>

                <div />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
