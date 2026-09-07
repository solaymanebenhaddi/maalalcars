'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  RotateCcw,
  Car,
  Info,
} from 'lucide-react'

export default function RestoreArchivePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Fields matching Reference #38 Screen 5
  const [destination, setDestination] = useState('Stock disponible')
  const [newStatus, setNewStatus] = useState('En stock')
  const [assignedTo, setAssignedTo] = useState('Admin Maalal')
  const [notes, setNotes] = useState('Restauration demandée par le client.')
  const [isRestoring, setIsRestoring] = useState(false)

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 4) {
      setStep(step + 1)
      return
    }
    setIsRestoring(true)
    setTimeout(() => {
      router.push('/archives?tab=restorations')
    }, 600)
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto text-xs text-white">
      {/* Top Breadcrumbs */}
      <div className="flex items-center gap-2 text-zinc-400">
        <Link
          href="/archives"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour aux archives</span>
        </Link>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-300">Centre d&apos;archives</span>
        <span className="text-zinc-600">&gt;</span>
        <span className="font-semibold text-white">Restauration</span>
      </div>

      <div className="rounded-xl border border-[#222228] bg-[#121216] p-6 shadow-xl space-y-5">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-red-500" />
            <span>Restauration d&apos;un enregistrement archivé</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Réactivez un véhicule, contact ou dossier archivé en toute sécurité.
          </p>
        </div>

        {/* Stepper 4 Steps matching Reference #38 Screen 5 */}
        <div className="grid grid-cols-4 gap-2 border-b border-[#222228] pb-4">
          <div
            onClick={() => setStep(1)}
            className={`cursor-pointer flex items-center gap-2 p-2 rounded-lg border ${
              step === 1
                ? 'border-red-500 bg-red-500/10 text-white'
                : 'border-[#24242e] bg-[#16161c] text-zinc-400'
            }`}
          >
            <span
              className={`h-5 w-5 rounded-full flex items-center justify-center font-bold text-xs ${
                step === 1 ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              1
            </span>
            <span className="text-[11px] font-semibold truncate">Sélection</span>
          </div>

          <div
            onClick={() => setStep(2)}
            className={`cursor-pointer flex items-center gap-2 p-2 rounded-lg border ${
              step === 2
                ? 'border-red-500 bg-red-500/10 text-white'
                : 'border-[#24242e] bg-[#16161c] text-zinc-400'
            }`}
          >
            <span
              className={`h-5 w-5 rounded-full flex items-center justify-center font-bold text-xs ${
                step === 2 ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              2
            </span>
            <span className="text-[11px] font-semibold truncate">Vérification</span>
          </div>

          <div
            onClick={() => setStep(3)}
            className={`cursor-pointer flex items-center gap-2 p-2 rounded-lg border ${
              step === 3
                ? 'border-red-500 bg-red-500/10 text-white'
                : 'border-[#24242e] bg-[#16161c] text-zinc-400'
            }`}
          >
            <span
              className={`h-5 w-5 rounded-full flex items-center justify-center font-bold text-xs ${
                step === 3 ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              3
            </span>
            <span className="text-[11px] font-semibold truncate">Confirmation</span>
          </div>

          <div
            onClick={() => setStep(4)}
            className={`cursor-pointer flex items-center gap-2 p-2 rounded-lg border ${
              step === 4
                ? 'border-red-500 bg-red-500/10 text-white'
                : 'border-[#24242e] bg-[#16161c] text-zinc-400'
            }`}
          >
            <span
              className={`h-5 w-5 rounded-full flex items-center justify-center font-bold text-xs ${
                step === 4 ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              4
            </span>
            <span className="text-[11px] font-semibold truncate">Terminé</span>
          </div>
        </div>

        <form onSubmit={handleNext} className="space-y-4">
          {/* Step 1 & 2 layout matching Reference #38 Screen 5 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Card: Détails de l'enregistrement */}
            <div className="rounded-xl border border-[#222228] bg-[#16161c] p-4 space-y-3">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
                Détails de l&apos;enregistrement
              </h2>

              <div className="p-3 rounded-lg border border-[#262632] bg-[#121216] flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                  <Car className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-bold text-white text-xs">Toyota Land Cruiser 2021</div>
                  <div className="text-[10px] text-zinc-400">VR-R 4.0L Essence</div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400 uppercase">Plaque</span>
                  <span className="font-mono font-bold text-white">12345 | T | 2021</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400 uppercase">Année</span>
                  <span className="font-mono text-zinc-300">2021</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400 uppercase">Kilométrage</span>
                  <span className="font-mono text-zinc-300">85 400 km</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400 uppercase">Raison d&apos;archivage</span>
                  <span className="rounded bg-red-500/15 border border-red-500/30 px-2 py-0.5 text-[9px] font-bold text-red-400">
                    Vente annulée
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400 uppercase">Date d&apos;archivage</span>
                  <span className="font-mono text-zinc-400 text-[10px]">30/05/2025 18:30</span>
                </div>
              </div>
            </div>

            {/* Right Card: Informations de restauration */}
            <div className="rounded-xl border border-[#222228] bg-[#16161c] p-4 space-y-3">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
                Informations de restauration
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Restaurer vers <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#121216] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Stock disponible">Stock disponible</option>
                    <option value="En réparation">En réparation</option>
                    <option value="Réservations">Réservations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Statut après restauration <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#121216] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="En stock">En stock</option>
                    <option value="Réservé">Réservé</option>
                    <option value="En préparation">En préparation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Assigné à <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#121216] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Admin Maalal">Admin Maalal</option>
                    <option value="Youssef Maalal">Youssef Maalal</option>
                    <option value="Omar Bennis">Omar Bennis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Notes (optionnel)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-lg border border-[#282834] bg-[#121216] p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Warning Notice matching Reference #38 Screen 5 */}
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 flex items-center gap-2.5">
            <Info className="h-4 w-4 text-blue-400 shrink-0" />
            <p className="text-[11px] text-blue-300">
              En restaurant cet enregistrement, il redeviendra actif dans le système et accessible selon les permissions.
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#222228]">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white"
              >
                Précédent
              </button>
            ) : (
              <Link
                href="/archives"
                className="rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white"
              >
                Annuler
              </Link>
            )}

            <button
              type="submit"
              disabled={isRestoring}
              className="rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-lg shadow-red-950/50 transition-colors"
            >
              {step < 4 ? 'Suivant' : isRestoring ? 'Restauration...' : 'Confirmer la restauration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
