'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Shield,
  UploadCloud,
} from 'lucide-react'

export default function NewInsurancePolicyPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Step 1 Form fields
  const [insurer, setInsurer] = useState('AXA Assurance')
  const [contractType, setContractType] = useState('Tous risques')
  const [vehicle, setVehicle] = useState('Toyota Land Cruiser 2023')
  const [client, setClient] = useState('Yassine Benali')
  const [startDate, setStartDate] = useState('2025-01-15')
  const [expiryDate, setExpiryDate] = useState('2026-01-15')
  const [usage, setUsage] = useState('Usage privé')
  const [annualMileage, setAnnualMileage] = useState('12 000')
  const [location, setLocation] = useState('Casablanca, Maroc')
  const annualPremium = '1 250'

  // Step 2 Guarantees checkboxes
  const [guarantees, setGuarantees] = useState({
    responsabiliteCivile: true,
    defenseRecours: true,
    dommagesCollision: true,
    volIncendie: true,
    brisDeGlace: true,
    assistance247: true,
    conducteurProtege: true,
  })

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
      {/* Top Breadcrumb matching Reference #34 Sub-screen 1 */}
      <div className="flex items-center gap-2 text-zinc-400">
        <Link
          href="/insurances"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour au tableau de bord assurances</span>
        </Link>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-300">Accueil</span>
        <span className="text-zinc-600">&gt;</span>
        <span className="text-zinc-300">Assurances</span>
        <span className="text-zinc-600">&gt;</span>
        <span className="font-semibold text-white">Nouvelle police</span>
      </div>

      <div className="rounded-xl border border-[#222228] bg-[#121216] p-6 shadow-xl space-y-5">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <Shield className="h-4 w-4 text-red-500" />
            <span>Nouvelle police d&apos;assurance</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Enregistrez une couverture d&apos;assurance pour un véhicule de la flotte ou d&apos;un client.
          </p>
        </div>

        {/* Stepper 4 Steps matching Reference #34 Sub-screen 1 */}
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
            <span className="text-[11px] font-semibold truncate">Garanties &amp; options</span>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Assureur <span className="text-red-500">*</span>
                </label>
                <select
                  value={insurer}
                  onChange={(e) => setInsurer(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="AXA Assurance">AXA Assurance</option>
                  <option value="Allianz">Allianz</option>
                  <option value="MAAF">MAAF</option>
                  <option value="Groupama">Groupama</option>
                  <option value="RMA Watanya">RMA Watanya</option>
                  <option value="Saham Assurance">Saham Assurance</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Type de contrat <span className="text-red-500">*</span>
                </label>
                <select
                  value={contractType}
                  onChange={(e) => setContractType(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="Tous risques">Tous risques (Formule intégrale)</option>
                  <option value="Tiers étendu">Tiers étendu (Vol, incendie, bris de glace)</option>
                  <option value="Tiers simple">Tiers simple (Responsabilité Civile seule)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Véhicule <span className="text-red-500">*</span>
                </label>
                <select
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="Toyota Land Cruiser 2023">Toyota Land Cruiser 2023</option>
                  <option value="Mercedes-Benz GLC 2022">Mercedes-Benz GLC 2022</option>
                  <option value="Audi Q7 2021">Audi Q7 2021</option>
                  <option value="BMW X5 2022">BMW X5 2022</option>
                  <option value="Toyota Hilux 2020">Toyota Hilux 2020</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Client / Souscripteur <span className="text-red-500">*</span>
                </label>
                <select
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="Yassine Benali">Yassine Benali</option>
                  <option value="Sarah El Amrani">Sarah El Amrani</option>
                  <option value="Imane Kabbaj">Imane Kabbaj</option>
                  <option value="Omar Tazi">Omar Tazi</option>
                  <option value="Salma Zahtouni">Salma Zahtouni</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Date d&apos;effet <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Date d&apos;échéance <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Usage
                </label>
                <input
                  type="text"
                  value={usage}
                  onChange={(e) => setUsage(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Kilométrage annuel (km)
                </label>
                <input
                  type="text"
                  value={annualMileage}
                  onChange={(e) => setAnnualMileage(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Localisation
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Garanties incluses et options
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(guarantees).map(([key, val]) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 p-3 rounded-lg border border-[#24242e] bg-[#16161c] cursor-pointer hover:bg-[#1a1a20]"
                  >
                    <input
                      type="checkbox"
                      checked={val}
                      onChange={() =>
                        setGuarantees({ ...guarantees, [key as keyof typeof guarantees]: !val })
                      }
                      className="rounded accent-red-600 h-4 w-4 cursor-pointer"
                    />
                    <span className="font-semibold text-white capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Documents contractuels (Attestation, Carte verte, Relevé d&apos;information)
              </h3>
              <div className="border-2 border-dashed border-[#282834] hover:border-red-500/50 rounded-xl p-8 text-center bg-[#16161c] transition-colors cursor-pointer">
                <UploadCloud className="mx-auto h-8 w-8 text-zinc-400 mb-2" />
                <p className="text-xs text-zinc-300">
                  Glisser-déposer les pièces justificatives ou <span className="text-red-400 font-semibold underline">Parcourir</span>
                </p>
                <p className="text-[10px] text-zinc-500 mt-1">
                  Attestation d&apos;assurance, Carte verte, Police signée (PDF, JPG - Max 10 Mo)
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Récapitulatif de la police
              </h3>
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl border border-[#24242e] bg-[#16161c]">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Assureur &amp; Formule</span>
                  <div className="font-bold text-white text-xs">{insurer} · {contractType}</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Véhicule couvert</span>
                  <div className="font-bold text-white text-xs">{vehicle}</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Souscripteur</span>
                  <div className="text-zinc-200">{client}</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Période de couverture</span>
                  <div className="font-mono text-zinc-200">{startDate} &rarr; {expiryDate}</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Prime annuelle</span>
                  <div className="font-mono font-bold text-emerald-400 text-sm">{annualPremium} DH / an</div>
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
              {step < 4 ? 'Suivant' : isSubmitting ? 'Enregistrement...' : 'Enregistrer la police'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
