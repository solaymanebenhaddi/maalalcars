'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const AVAILABLE_SLOTS = [
  '08:00',
  '09:00',
  '10:30',
  '13:30',
  '15:00',
  '16:30',
]

export default function SavPlanningPage() {
  const router = useRouter()
  const [selectedDay, setSelectedDay] = useState(16)
  const [selectedSlot, setSelectedSlot] = useState('10:30')
  const [internalNotes, setInternalNotes] = useState('Prévoir contrôle complet après intervention.')
  const [confirmedToast, setConfirmedToast] = useState(false)

  const handleConfirm = () => {
    setConfirmedToast(true)
    setTimeout(() => {
      router.push('/sav')
    }, 1200)
  }

  // Days of May 2025 (May 1st was Thursday)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1)
  const emptyLeadingDays = [1, 2, 3] // Mon, Tue, Wed before Thursday

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Breadcrumb matching Reference #32 Screen 4 */}
      <div className="flex items-center gap-2 text-zinc-400">
        <Link
          href="/sav"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour au SAV</span>
        </Link>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-300">Accueil</span>
        <span className="text-zinc-600">&gt;</span>
        <span className="text-zinc-300">SAV / Support</span>
        <span className="text-zinc-600">&gt;</span>
        <span className="font-semibold text-white">Planification</span>
      </div>

      <div className="rounded-xl border border-[#222228] bg-[#121216] p-6 shadow-xl space-y-5">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-cyan-400" />
            <span>Planification intervention SAV</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Sélectionnez un créneau d&apos;atelier et assignez les ressources pour cette prise en charge.
          </p>
        </div>

        {/* 3-Column Grid matching Reference #32 Screen 4 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Informations ticket & Notes (span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-xl border border-[#222228] bg-[#16161c] p-4 space-y-3">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
                Informations ticket
              </h2>

              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-white">SAV-2025-0048</span>
                <span className="rounded bg-red-500/15 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold text-red-400">
                  Élevée
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">Client</span>
                  <div className="font-semibold text-white">Yassine Benali</div>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">Véhicule</span>
                  <div className="text-zinc-200">Toyota Land Cruiser 2023</div>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">Sujet</span>
                  <div className="text-zinc-300">Bruit anormal à l’accélération</div>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">Assigné à</span>
                  <div className="text-zinc-200 font-semibold">Sarah El Amrani</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#222228] bg-[#16161c] p-4 space-y-2">
              <label className="block text-[11px] font-bold text-white uppercase tracking-wider">
                Notes internes
              </label>
              <textarea
                rows={3}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Consignes particulières pour l'atelier..."
                className="w-full rounded-lg border border-[#282834] bg-[#18181f] p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Center Column: Calendar Date Picker (span-5) */}
          <div className="lg:col-span-5 rounded-xl border border-[#222228] bg-[#16161c] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#222228] pb-2">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Sélectionner une date et heure
              </h2>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs">Mai 2025</span>
                <div className="flex items-center gap-0.5">
                  <button className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800">
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button className="rounded p-1 text-zinc-400 hover:text-white hover:bg-zinc-800">
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center font-semibold text-[10px] text-zinc-500 uppercase">
              <span>Lu</span>
              <span>Ma</span>
              <span>Me</span>
              <span>Je</span>
              <span>Ve</span>
              <span>Sa</span>
              <span>Di</span>
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {emptyLeadingDays.map((i) => (
                <div key={`empty-${i}`} className="h-8" />
              ))}

              {daysInMonth.map((day) => {
                const isSelected = day === selectedDay
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`h-8 rounded-lg flex items-center justify-center font-mono text-xs transition-all ${
                      isSelected
                        ? 'bg-red-600 text-white font-black shadow-md shadow-red-950/60 ring-2 ring-red-500'
                        : 'text-zinc-300 hover:bg-[#202028] hover:text-white'
                    }`}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Column: Time Slots Grid (span-3) */}
          <div className="lg:col-span-3 rounded-xl border border-[#222228] bg-[#16161c] p-4 space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
              Créneaux disponibles
            </h2>
            <p className="text-[10px] text-zinc-400">
              Vendredi {selectedDay} mai 2025
            </p>

            <div className="space-y-2 pt-1">
              {AVAILABLE_SLOTS.map((slot) => {
                const isSelected = slot === selectedSlot
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all text-center ${
                      isSelected
                        ? 'bg-red-600 text-white shadow-md shadow-red-950/50'
                        : 'border border-[#282834] bg-[#18181f] text-zinc-300 hover:border-zinc-500 hover:text-white'
                    }`}
                  >
                    {slot}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Actions matching Reference #32 Screen 4 */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#222228]">
          <Link
            href="/sav"
            className="rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            Annuler
          </Link>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-lg shadow-red-950/50 transition-colors"
          >
            Confirmer la planification
          </button>
        </div>
      </div>

      {confirmedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-[#121216] px-4 py-3 text-xs text-emerald-400 shadow-2xl backdrop-blur-md">
          <CheckCircle2 className="h-4 w-4" />
          <span>Intervention planifiée pour le {selectedDay} mai 2025 à {selectedSlot} !</span>
        </div>
      )}
    </div>
  )
}
