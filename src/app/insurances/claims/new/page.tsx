'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  AlertTriangle,
  UploadCloud,
} from 'lucide-react'

export default function NewInsuranceClaimPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  const [policy, setPolicy] = useState('ASS-2025-0048 — Toyota Land Cruiser 2023')
  const [claimDate, setClaimDate] = useState('2025-05-13')
  const [claimTime, setClaimTime] = useState('14:30')
  const [location, setLocation] = useState('Casablanca, Maroc')
  const [claimType, setClaimType] = useState('Dégâts carrosserie')
  const [circumstances, setCircumstances] = useState('Accrochage à un feu rouge')
  const [description, setDescription] = useState(
    'Choc arrière côté droit. Pare-chocs et feu endommagés lors d’un ralentissement en ville.'
  )
  const [thirdPartyInvolved, setThirdPartyInvolved] = useState(true)
  const [constatSigne, setConstatSigne] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 4) {
      setStep(step + 1)
      return
    }
    setIsSubmitting(true)
    setTimeout(() => {
      router.push('/insurances')
    }, 600)
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto text-xs text-white">
      {/* Top Breadcrumb matching Reference #34 Sub-screen 2 */}
      <div className="flex items-center gap-2 text-zinc-400">
        <Link
          href="/insurances"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour aux assurances</span>
        </Link>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-300">Accueil</span>
        <span className="text-zinc-600">&gt;</span>
        <span className="text-zinc-300">Assurances</span>
        <span className="text-zinc-600">&gt;</span>
        <span className="font-semibold text-white">Déclaration de sinistre</span>
      </div>

      <div className="rounded-xl border border-[#222228] bg-[#121216] p-6 shadow-xl space-y-5">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span>Déclaration de sinistre</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Ouvrez un dossier de sinistre auprès de la compagnie d&apos;assurance et transmettez les pièces.
          </p>
        </div>

        {/* Stepper 4 Steps matching Reference #34 Sub-screen 2 */}
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
            <span className="text-[11px] font-semibold truncate">Informations sinistre</span>
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
            <span className="text-[11px] font-semibold truncate">Détails</span>
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
            <span className="text-[11px] font-semibold truncate">Documents</span>
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
            <span className="text-[11px] font-semibold truncate">Récapitulatif</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Police d&apos;assurance concernée <span className="text-red-500">*</span>
                </label>
                <select
                  value={policy}
                  onChange={(e) => setPolicy(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="ASS-2025-0048 — Toyota Land Cruiser 2023">
                    ASS-2025-0048 — Toyota Land Cruiser 2023 (AXA Assurance)
                  </option>
                  <option value="ASS-2025-0032 — BMW X5 2022">
                    ASS-2025-0032 — BMW X5 2022 (Allianz)
                  </option>
                  <option value="ASS-2025-0027 — Audi Q7 2021">
                    ASS-2025-0027 — Audi Q7 2021 (MAAF)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Date du sinistre <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={claimDate}
                  onChange={(e) => setClaimDate(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Heure du sinistre
                </label>
                <input
                  type="time"
                  value={claimTime}
                  onChange={(e) => setClaimTime(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Lieu du sinistre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Type de sinistre <span className="text-red-500">*</span>
                </label>
                <select
                  value={claimType}
                  onChange={(e) => setClaimType(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="Dégâts carrosserie">Dégâts carrosserie</option>
                  <option value="Bris de glace">Bris de glace</option>
                  <option value="Vol & tentative de vol">Vol &amp; tentative de vol</option>
                  <option value="Incendie">Incendie</option>
                  <option value="Vandalisme">Vandalisme</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Circonstances de l&apos;accident
                </label>
                <input
                  type="text"
                  value={circumstances}
                  onChange={(e) => setCircumstances(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Description détaillée des dommages <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-[#282834] bg-[#18181f] p-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2 p-3 rounded-lg border border-[#24242e] bg-[#16161c] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={thirdPartyInvolved}
                    onChange={(e) => setThirdPartyInvolved(e.target.checked)}
                    className="rounded accent-red-600 h-4 w-4"
                  />
                  <span className="font-semibold text-white">Tiers identifié impliqué</span>
                </label>
                <label className="flex items-center gap-2 p-3 rounded-lg border border-[#24242e] bg-[#16161c] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={constatSigne}
                    onChange={(e) => setConstatSigne(e.target.checked)}
                    className="rounded accent-red-600 h-4 w-4"
                  />
                  <span className="font-semibold text-white">Constat amiable signé</span>
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Preuves et pièces justificatives (Constat, Photos, Devis)
              </h3>
              <div className="border-2 border-dashed border-[#282834] hover:border-red-500/50 rounded-xl p-8 text-center bg-[#16161c] transition-colors cursor-pointer">
                <UploadCloud className="mx-auto h-8 w-8 text-zinc-400 mb-2" />
                <p className="text-xs text-zinc-300">
                  Glisser-déposer le constat amiable numérisé et les photos des dommages
                </p>
                <p className="text-[10px] text-zinc-500 mt-1">
                  Formats acceptés : PDF, JPG, PNG (Max 15 Mo)
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Récapitulatif de la déclaration de sinistre
              </h3>
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl border border-[#24242e] bg-[#16161c]">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Police liée</span>
                  <div className="font-bold text-white text-xs">{policy}</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Nature du dommage</span>
                  <div className="font-bold text-red-400 text-xs">{claimType}</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Date &amp; Lieu</span>
                  <div className="text-zinc-200">{claimDate} à {claimTime} ({location})</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Circonstances</span>
                  <div className="text-zinc-200">{circumstances}</div>
                </div>
              </div>
            </div>
          )}

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
                href="/insurances"
                className="rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white"
              >
                Annuler
              </Link>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-lg shadow-red-950/50 transition-colors"
            >
              {step < 4 ? 'Suivant' : isSubmitting ? 'Transmission...' : 'Envoyer la déclaration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
