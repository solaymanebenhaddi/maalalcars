'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Calendar as CalendarIcon,
  CalendarRange,
  Clock,
  CalendarX,
  Plus,
  RotateCcw,
  Search,
  Phone,
  MessageSquare,
  Mail,
  ChevronLeft,
  ChevronRight,
  Bell,
  SlidersHorizontal,
} from 'lucide-react'
import { AppointmentOccupationGauge } from './appointment-occupation-gauge'

export interface AppointmentItem {
  id: string
  code: string
  title: string
  serviceType: string
  startTime: string
  endTime: string
  status: string
  workshopBay: string
  reminderMin: number
  notes?: string | null
  clientName: string
  clientPhone: string
  clientEmail?: string | null
  vehicleName: string
  licensePlate: string
  vin: string
  mileage?: number | null
  advisorName: string
  source: string
  duration: string
}

interface Props {
  initialAppointments: AppointmentItem[]
}

const RAPPELS_ITEMS: { time: string; service: string; vehicle: string; badge: string; badgeClass: string }[] = []

export function AppointmentsDashboardClient({ initialAppointments }: Props) {
  const [viewMode, setViewMode] = useState('Jour')
  const [statusFilter, setStatusFilter] = useState('Tous')
  const [bayFilter, setBayFilter] = useState('Tous')
  const [advisorFilter, setAdvisorFilter] = useState('Tous')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAppointments = initialAppointments.filter((apt) => {
    if (statusFilter !== 'Tous' && apt.status !== statusFilter) return false
    if (bayFilter !== 'Tous' && !apt.workshopBay.includes(bayFilter)) return false
    if (advisorFilter !== 'Tous' && apt.advisorName !== advisorFilter) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const match =
        apt.clientName.toLowerCase().includes(q) ||
        apt.vehicleName.toLowerCase().includes(q) ||
        apt.serviceType.toLowerCase().includes(q) ||
        apt.licensePlate.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })

  return (
    <div className="space-y-5 text-xs text-white">
      {/* Top Header matching Reference #11 Screen 28 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
            AGENDA / RENDEZ-VOUS — CALENDRIER
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Planifiez, organisez et suivez vos rendez-vous en toute simplicité et efficacité.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            href="/appointments/availability"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-cyan-400" />
            <span>Disponibilités</span>
          </Link>

          <Link
            href="/appointments/reminders"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <Bell className="h-3.5 w-3.5 text-amber-400" />
            <span>Rappels</span>
          </Link>

          <Link
            href="/appointments/new"
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ Nouveau rendez-vous</span>
          </Link>
        </div>
      </div>

      {/* 5 Top KPI Cards matching Reference #11 Screen 28 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* KPI 1: Rendez-vous aujourd'hui */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Rendez-vous aujourd’hui</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <CalendarIcon className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">0</div>
          <div className="text-[10px] font-semibold text-emerald-400">↗ 0% vs hier</div>
        </div>

        {/* KPI 2: Rendez-vous cette semaine */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Rendez-vous cette semaine</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <CalendarRange className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">0</div>
          <div className="text-[10px] font-semibold text-emerald-400">↗ 0% vs semaine dernière</div>
        </div>

        {/* KPI 3: Taux d'occupation */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Taux d’occupation</span>
            <AppointmentOccupationGauge percentage={0} />
          </div>
          <div className="text-2xl font-black text-white font-mono">0 %</div>
          <div className="text-[10px] font-semibold text-emerald-400">↗ 0% vs semaine dernière</div>
        </div>

        {/* KPI 4: En attente de confirmation */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">En attente de confirmation</span>
            <div className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
              <Clock className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">0</div>
          <div className="text-[10px] font-semibold text-emerald-400">↗ 0 vs hier</div>
        </div>

        {/* KPI 5: Annulations */}
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Annulations</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <CalendarX className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">0</div>
          <div className="text-[10px] font-semibold text-red-400">↘ 0 vs semaine dernière</div>
        </div>
      </div>

      {/* Middle 3-Column Widgets matching Reference #11 Screen 28 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Widget 1: Rappels du jour (4 cols) */}
        <div className="lg:col-span-4 rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
            Rappels du jour
          </h2>
          <div className="space-y-3">
            {RAPPELS_ITEMS.map((r, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1a1a24] border border-[#282834] text-zinc-400">
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-[11px]">{r.time}</span>
                      <span className="font-semibold text-zinc-200 text-xs truncate">{r.service}</span>
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate">{r.vehicle}</div>
                  </div>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${r.badgeClass}`}>
                  {r.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 2: Prochains rendez-vous (4 cols) */}
        <div className="lg:col-span-4 rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#222228] pb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Prochains rendez-vous
            </h2>
            <Link href="/appointments" className="text-[11px] text-zinc-400 hover:text-white">
              Voir tout
            </Link>
          </div>
          <div className="space-y-2.5">
            {initialAppointments.slice(0, 5).map((apt) => (
              <div key={apt.id} className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono font-bold text-zinc-400 text-[11px] shrink-0">
                    {new Date(apt.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600/20 text-red-400 text-[10px] font-bold">
                    {apt.clientName[0]}
                  </div>
                  <div className="min-w-0">
                    <Link href={`/appointments/${apt.code}`} className="font-semibold text-white text-xs block truncate hover:text-cyan-400">
                      {apt.clientName}
                    </Link>
                    <span className="text-[10px] text-zinc-400 truncate block">{apt.serviceType}</span>
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold ${
                    apt.status === 'CONFIRMED'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {apt.status === 'CONFIRMED' ? 'Confirmé' : 'En attente'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 3: Recherche avancée (4 cols) */}
        <div className="lg:col-span-4 rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
            Recherche avancée
          </h2>
          <div className="space-y-2 text-xs">
            <div>
              <label className="block text-[10px] text-zinc-400 mb-0.5">Client</label>
              <input
                type="text"
                placeholder="Nom, téléphone, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-7 w-full rounded border border-[#282834] bg-[#18181f] px-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] text-zinc-400 mb-0.5">Véhicule</label>
              <input
                type="text"
                placeholder="Marque, modèle, plaque, VIN..."
                className="h-7 w-full rounded border border-[#282834] bg-[#18181f] px-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] text-zinc-400 mb-0.5">Service / Motif</label>
              <select className="h-7 w-full rounded border border-[#282834] bg-[#18181f] px-2 text-xs text-white focus:outline-none">
                <option>Sélectionner un service... ⌄</option>
                <option>Entretien 20 000 km</option>
                <option>Contrôle technique</option>
                <option>Révision complète</option>
                <option>Diagnostic électronique</option>
                <option>Vidange + Filtres</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-zinc-400 mb-0.5">Période</label>
              <input
                type="text"
                defaultValue="28/05/2025 → 04/06/2025"
                className="h-7 w-full rounded border border-[#282834] bg-[#18181f] px-2 text-[10px] text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setSearchQuery('')}
                className="h-7 flex-1 rounded border border-[#282834] bg-[#18181f] text-[10px] font-semibold text-zinc-300 hover:text-white flex items-center justify-center gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Réinitialiser</span>
              </button>
              <button className="h-7 flex-1 rounded bg-red-600 text-[10px] font-bold text-white shadow-md hover:bg-red-500 flex items-center justify-center gap-1">
                <Search className="h-3 w-3" />
                <span>Rechercher</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Planning — Mercredi 28 Mai 2025 matching Reference #11 Screen 28 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222228] pb-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
              Planning — Mercredi 28 Mai 2025
            </h2>
            <div className="flex items-center rounded-lg border border-[#282834] bg-[#18181f] p-0.5 text-xs">
              {['Jour', 'Semaine', 'Mois'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`rounded px-2.5 py-0.5 text-[11px] font-bold transition-all ${
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

          <div className="flex flex-wrap items-center gap-2">
            <button className="rounded border border-[#282834] bg-[#18181f] px-2.5 py-1 text-[10px] text-zinc-300 hover:text-white">
              Aujourd’hui
            </button>
            <div className="flex items-center gap-1">
              <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
                <ChevronLeft className="h-3 w-3" />
              </button>
              <button className="flex h-6 w-6 items-center justify-center rounded border border-[#282834] bg-[#18181f] text-zinc-400 hover:text-white">
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-7 rounded border border-[#282834] bg-[#18181f] px-2 text-[10px] text-white focus:outline-none"
            >
              <option value="Tous">Tous les statuts ⌄</option>
              <option value="CONFIRMED">Confirmé</option>
              <option value="PENDING">En attente</option>
            </select>

            <select
              value={bayFilter}
              onChange={(e) => setBayFilter(e.target.value)}
              className="h-7 rounded border border-[#282834] bg-[#18181f] px-2 text-[10px] text-white focus:outline-none"
            >
              <option value="Tous">Tous les ateliers ⌄</option>
              <option value="">-- Atelier --</option>
            </select>

            <select
              value={advisorFilter}
              onChange={(e) => setAdvisorFilter(e.target.value)}
              className="h-7 rounded border border-[#282834] bg-[#18181f] px-2 text-[10px] text-white focus:outline-none"
            >
              <option value="Tous">Tous les conseillers ⌄</option>
              <option value="">-- Conseiller --</option>
            </select>
          </div>
        </div>

        {/* Planning Schedule Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#222228] text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="pb-2.5">Heure</th>
                <th className="pb-2.5">Client</th>
                <th className="pb-2.5">Véhicule</th>
                <th className="pb-2.5">Service / Motif</th>
                <th className="pb-2.5">Atelier</th>
                <th className="pb-2.5">Conseiller</th>
                <th className="pb-2.5 text-center">Statut</th>
                <th className="pb-2.5 text-center">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-[#18181f] transition-colors group">
                  <td className="py-3 font-mono font-bold text-white text-xs">
                    {new Date(apt.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-600/20 text-red-400 text-xs font-bold">
                        {apt.clientName[0]}
                      </div>
                      <div>
                        <Link href={`/appointments/${apt.code}`} className="font-bold text-white block hover:text-red-400">
                          {apt.clientName}
                        </Link>
                        <span className="font-mono text-zinc-400 text-[10px]">{apt.clientPhone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="font-semibold text-zinc-200">{apt.vehicleName} — {apt.licensePlate}</div>
                    <div className="font-mono text-zinc-500 text-[10px]">VIN: {apt.vin}</div>
                  </td>
                  <td className="py-3">
                    <div className="font-semibold text-white">{apt.serviceType}</div>
                    <div className="text-[10px] text-zinc-400">{apt.notes}</div>
                  </td>
                  <td className="py-3 text-zinc-300">
                    <span className="font-semibold block">{apt.workshopBay}</span>
                  </td>
                  <td className="py-3 text-zinc-300">{apt.advisorName}</td>
                  <td className="py-3 text-center">
                    <span
                      className={`rounded px-2.5 py-0.5 text-[10px] font-bold ${
                        apt.status === 'CONFIRMED'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {apt.status === 'CONFIRMED' ? 'Confirmé' : 'En attente'}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <div className="flex items-center justify-center gap-2 text-zinc-400">
                      <button className="p-1 rounded hover:bg-[#22222a] hover:text-cyan-400" title="Appeler">
                        <Phone className="h-3.5 w-3.5" />
                      </button>
                      <button className="p-1 rounded hover:bg-[#22222a] hover:text-emerald-400" title="WhatsApp">
                        <MessageSquare className="h-3.5 w-3.5" />
                      </button>
                      <button className="p-1 rounded hover:bg-[#22222a] hover:text-white" title="Email">
                        <Mail className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
