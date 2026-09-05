'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Calendar,
  Clock,
  UserPlus,
  Car,
  FileText,
  Bell,
  RotateCcw,
  Check,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'

const todayDate = new Date().toISOString().split('T')[0]

export default function NewAppointmentPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      router.push('/appointments')
    }, 600)
  }

  return (
    <div className="space-y-5 max-w-4xl mx-auto text-xs text-white">
      <PageHeader
        title="Nouveau rendez-vous"
        subtitle="Créer et planifier un nouveau créneau client ou atelier."
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Agenda & RDV', href: '/appointments' },
          { label: 'Nouveau rendez-vous' },
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

      {/* Main Form matching Reference #11 Screen 28A */}
      <form onSubmit={handleSubmit} className="rounded-xl border border-[#222228] bg-[#121216] p-5 space-y-6 shadow-xl">
        {/* Section 1: Informations client */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#222228] pb-2">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Informations client</span>
            </h2>
            <button
              type="button"
              className="flex items-center gap-1 rounded bg-red-600/10 border border-red-500/20 px-2.5 py-1 text-[11px] font-bold text-red-400 hover:bg-red-600/20"
            >
              <UserPlus className="h-3 w-3" />
              <span>+ Nouveau client</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-medium text-zinc-400 mb-1">
                Client <span className="text-red-500">*</span>
              </label>
              <select
                defaultValue=""
                className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="">-- Sélectionner un client --</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-zinc-400 mb-1">Téléphone</label>
              <input
                type="text"
                defaultValue=""
                className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium text-zinc-400 mb-1">Email</label>
              <input
                type="email"
                defaultValue=""
                className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Informations véhicule */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2 flex items-center gap-1.5">
            <Car className="h-3.5 w-3.5 text-zinc-400" />
            <span>Informations véhicule</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-medium text-zinc-400 mb-1">
                Véhicule <span className="text-red-500">*</span>
              </label>
              <select
                defaultValue=""
                className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="">-- Sélectionner un véhicule --</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-zinc-400 mb-1">
                Immatriculation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue=""
                className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs font-mono text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium text-zinc-400 mb-1">
                VIN <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue=""
                className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs font-mono text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Détails du rendez-vous */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-zinc-400" />
            <span>Détails du rendez-vous</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-medium text-zinc-400 mb-1">
                Service / Motif <span className="text-red-500">*</span>
              </label>
              <select
                defaultValue="Entretien 20 000 km"
                className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="Entretien 20 000 km">Entretien 20 000 km</option>
                <option value="Contrôle technique">Contrôle technique</option>
                <option value="Révision complète">Révision complète</option>
                <option value="Diagnostic électronique">Diagnostic électronique</option>
                <option value="Vidange + Filtres">Vidange + Filtres</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-zinc-400 mb-1">
                Atelier <span className="text-red-500">*</span>
              </label>
              <select
                defaultValue="Atelier 1 – Mécanique"
                className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="Atelier 1 – Mécanique">Atelier 1 – Mécanique</option>
                <option value="Atelier 2 – Électricité">Atelier 2 – Électricité</option>
                <option value="Atelier 3 – Diagnostic">Atelier 3 – Diagnostic</option>
                <option value="Carrosserie">Carrosserie</option>
                <option value="Pneumatiques">Pneumatiques</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-zinc-400 mb-1">
                Conseiller <span className="text-red-500">*</span>
              </label>
              <select
                defaultValue=""
                className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="">-- Sélectionner un conseiller --</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-medium text-zinc-400 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Calendar className="absolute left-2.5 h-3.5 w-3.5 text-zinc-500" />
                <input
                  type="date"
                  defaultValue={todayDate}
                  className="h-8 w-full rounded border border-[#282834] bg-[#18181f] pl-8 pr-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-zinc-400 mb-1">
                Heure <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Clock className="absolute left-2.5 h-3.5 w-3.5 text-zinc-500" />
                <input
                  type="time"
                  defaultValue=""
                  className="h-8 w-full rounded border border-[#282834] bg-[#18181f] pl-8 pr-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-zinc-400 mb-1">
                Durée <span className="text-red-500">*</span>
              </label>
              <select
                defaultValue=""
                className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="00:30">00:30</option>
                <option value="00:45">00:45</option>
                <option value="01:00">01:00</option>
                <option value="01:30">01:30</option>
                <option value="02:00">02:00</option>
                <option value="03:00">03:00</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-zinc-400 mb-1">Notes</label>
            <textarea
              rows={2}
              placeholder="Notes additionnelles (facultatif)..."
              defaultValue=""
              className="w-full rounded border border-[#282834] bg-[#18181f] p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[10px] font-medium text-zinc-400 mb-1 flex items-center gap-1">
                <Bell className="h-3 w-3 text-zinc-500" />
                <span>Rappel automatique</span>
              </label>
              <select
                defaultValue="15 min avant"
                className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
              >
                <option value="15 min avant">15 min avant</option>
                <option value="1 heure avant">1 heure avant</option>
                <option value="2 heures avant">2 heures avant</option>
                <option value="1 jour avant">1 jour avant</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-zinc-400 mb-1 flex items-center gap-1">
                <RotateCcw className="h-3 w-3 text-zinc-500" />
                <span>Répéter</span>
              </label>
              <select
                defaultValue="Ne pas répéter"
                className="h-8 w-full rounded border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
              >
                <option value="Ne pas répéter">Ne pas répéter</option>
                <option value="Tous les 6 mois">Tous les 6 mois</option>
                <option value="Tous les ans">Tous les ans</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom Actions matching Reference #11 Screen 28A */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222228]">
          <Link
            href="/appointments"
            className="rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-red-950/50 hover:bg-red-500 disabled:opacity-50"
          >
            <Check className="h-3.5 w-3.5" />
            <span>{isSubmitting ? 'Enregistrement...' : 'Enregistrer'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
