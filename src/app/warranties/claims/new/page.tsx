'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  AlertTriangle,
  UploadCloud,
} from 'lucide-react'

export default function NewWarrantyClaimPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  const [warranty, setWarranty] = useState('GAR-2025-0050 — Toyota Land Cruiser VR-R 4.0L')
  const [claimType, setClaimType] = useState('Panne mécanique')
  const [incidentDate, setIncidentDate] = useState('2025-05-28')
  const [currentKm, setCurrentKm] = useState('98 450')
  const [city, setCity] = useState('Casablanca')

  const [description, setDescription] = useState(
    'Le véhicule présente une perte de puissance et un témoin moteur allumé. Des claquements sont entendus au niveau du moteur lors de l’accélération.'
  )
  const [alreadyRepaired, setAlreadyRepaired] = useState(true)
  const [workshop, setWorkshop] = useState('AutoPro Services Casablanca')
  const [invoicedAmount, setInvoicedAmount] = useState('4 800')

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 4) {
      setStep(step + 1)
      return
    }
    setIsSubmitting(true)
    setTimeout(() => {
      router.push('/warranties')
    }, 600)
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto text-xs text-white">
      {/* Top Breadcrumbs matching Reference #33 Sub-screen 2 */}
      <div className="flex items-center gap-2 text-zinc-400">
        <Link
          href="/warranties"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour aux garanties</span>
        </Link>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-300">Garanties</span>
        <span className="text-zinc-600">&gt;</span>
        <span className="font-semibold text-white">Déclarer un sinistre</span>
      </div>

      <div className="rounded-xl border border-[#222228] bg-[#121216] p-6 shadow-xl space-y-5">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span>Déclaration de sinistre / Panne sous garantie</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Déclarez une avarie pour prise en charge auprès de l&apos;assureur ou du constructeur.
          </p>
        </div>

        {/* Stepper 4 Steps matching Reference #33 Sub-screen 2 */}
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
            <span className="text-[11px] font-semibold truncate">Informations générales</span>
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
            <span className="text-[11px] font-semibold truncate">Détails techniques</span>
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
            <span className="text-[11px] font-semibold truncate">Documents &amp; preuves</span>
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
            <span className="text-[11px] font-semibold truncate">Confirmation &amp; envoi</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Dossier de garantie concerné <span className="text-red-500">*</span>
                </label>
                <select
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="GAR-2025-0050 — Toyota Land Cruiser VR-R 4.0L">
                    GAR-2025-0050 — Toyota Land Cruiser VR-R 4.0L (Toyota Maroc)
                  </option>
                  <option value="GAR-2025-0051 — Mercedes-Benz GLC">
                    GAR-2025-0051 — Mercedes-Benz GLC (Auto Nejma)
                  </option>
                  <option value="GAR-2025-0049 — BMW X5">
                    GAR-2025-0049 — BMW X5 (Smeia BMW)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Type de panne <span className="text-red-500">*</span>
                </label>
                <select
                  value={claimType}
                  onChange={(e) => setClaimType(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="Panne mécanique">Panne mécanique (Moteur / Boîte)</option>
                  <option value="Panne électronique">Panne électronique</option>
                  <option value="Système de freinage">Système de freinage</option>
                  <option value="Suspension">Suspension &amp; trains roulants</option>
                  <option value="Climatisation">Climatisation &amp; chauffage</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Kilométrage au moment de la panne (km) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={currentKm}
                  onChange={(e) => setCurrentKm(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Date de l&apos;incident <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Lieu / Ville <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Description précise des symptômes et constatations <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-[#282834] bg-[#18181f] p-3 text-xs text-white focus:outline-none focus:border-red-500 leading-relaxed"
                />
              </div>

              <div className="p-4 rounded-xl border border-[#222228] bg-[#16161c] space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Intervention atelier &amp; Réparation
                </h3>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-zinc-300">Le véhicule a-t-il été réparé ?</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="repaired"
                      checked={alreadyRepaired}
                      onChange={() => setAlreadyRepaired(true)}
                      className="accent-red-600"
                    />
                    <span className="text-xs text-white">Oui</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="repaired"
                      checked={!alreadyRepaired}
                      onChange={() => setAlreadyRepaired(false)}
                      className="accent-red-600"
                    />
                    <span className="text-xs text-white">Non</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                      Garage / Atelier
                    </label>
                    <input
                      type="text"
                      value={workshop}
                      onChange={(e) => setWorkshop(e.target.value)}
                      className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                      Montant devis ou facture (TTC en DH)
                    </label>
                    <input
                      type="text"
                      value={invoicedAmount}
                      onChange={(e) => setInvoicedAmount(e.target.value)}
                      className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Justificatifs et rapports techniques (Devis, Diagnostic valise, Facture)
              </h3>
              <div className="border-2 border-dashed border-[#282834] hover:border-red-500/50 rounded-xl p-8 text-center bg-[#16161c] transition-colors cursor-pointer">
                <UploadCloud className="mx-auto h-8 w-8 text-zinc-400 mb-2" />
                <p className="text-xs text-zinc-300">
                  Glissez-déposez le rapport de diagnostic valise et les photos des organes en panne
                </p>
                <p className="text-[10px] text-zinc-500 mt-1">
                  Formats acceptés : PDF, JPG, PNG, ZIP (Max 25 Mo)
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Récapitulatif avant soumission au service garantie
              </h3>
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl border border-[#24242e] bg-[#16161c]">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Garantie</span>
                  <div className="font-bold text-white text-xs">{warranty}</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Avarie déclarée</span>
                  <div className="font-bold text-red-400 text-xs">{claimType}</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Kilométrage &amp; Date</span>
                  <div className="text-zinc-200">{currentKm} km · {incidentDate}</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Montant estimé</span>
                  <div className="font-mono font-bold text-emerald-400 text-xs">{invoicedAmount} DH TTC</div>
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
                href="/warranties"
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
              {step < 4 ? 'Suivant' : isSubmitting ? 'Envoi...' : 'Soumettre le dossier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
