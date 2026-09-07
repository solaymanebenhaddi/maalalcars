'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  FileCheck2,
  UploadCloud,
} from 'lucide-react'

export default function NewRegistrationPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Step 1: Form Fields matching Reference #35 Screen 2
  const [client, setClient] = useState('Yassine Benali')
  const [phone, setPhone] = useState('06 12 34 56 78')
  const [email, setEmail] = useState('ybenali@email.com')

  const [vehicle, setVehicle] = useState('Toyota Land Cruiser VR-R 4.0L Essence')
  const [vin, setVin] = useState('JTMHV02J804567890')
  const [year, setYear] = useState('2023')

  const [dossierType, setDossierType] = useState('Première immatriculation')
  const [region, setRegion] = useState('Casablanca-Settat')
  const [prefecture, setPrefecture] = useState('Aïn Chock')
  const [usage, setUsage] = useState('Personnel')
  const [notes, setNotes] = useState('Notes internes sur le dossier (optionnel)')

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 4) {
      setStep(step + 1)
      return
    }
    setIsSubmitting(true)
    setTimeout(() => {
      router.push('/registrations')
    }, 600)
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto text-xs text-white">
      {/* Top Breadcrumbs */}
      <div className="flex items-center gap-2 text-zinc-400">
        <Link
          href="/registrations"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour aux immatriculations</span>
        </Link>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-300">Immatriculations</span>
        <span className="text-zinc-600">&gt;</span>
        <span className="font-semibold text-white">Nouveau dossier</span>
      </div>

      <div className="rounded-xl border border-[#222228] bg-[#121216] p-6 shadow-xl space-y-5">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <FileCheck2 className="h-4 w-4 text-red-500" />
            <span>Nouveau dossier d&apos;immatriculation</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Création rapide d&apos;un dossier d&apos;immatriculation complet.
          </p>
        </div>

        {/* Stepper 4 Steps matching Reference #35 Screen 2 */}
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
            <span className="text-[11px] font-semibold truncate">Informations</span>
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
            <span className="text-[11px] font-semibold truncate">Documents</span>
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
            <span className="text-[11px] font-semibold truncate">Frais</span>
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
            <span className="text-[11px] font-semibold truncate">Validation</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Informations principales
              </h2>

              {/* Client row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Client <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Vehicle row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Véhicule <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    VIN / N° de châssis
                  </label>
                  <input
                    type="text"
                    value={vin}
                    onChange={(e) => setVin(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Année <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Administration row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Type de dossier <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={dossierType}
                    onChange={(e) => setDossierType(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Première immatriculation">Première immatriculation</option>
                    <option value="Mutation / Changement titulaire">Mutation / Changement titulaire</option>
                    <option value="Duplicata carte grise">Duplicata carte grise</option>
                    <option value="Importation WW">Importation WW</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Région <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Préfecture <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={prefecture}
                    onChange={(e) => setPrefecture(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Usage
                  </label>
                  <select
                    value={usage}
                    onChange={(e) => setUsage(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Personnel">Personnel</option>
                    <option value="Professionnel">Professionnel</option>
                    <option value="Transport public">Transport public</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-lg border border-[#282834] bg-[#18181f] p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Pièces justificatives obligatoires
              </h2>
              <div className="border-2 border-dashed border-[#282834] hover:border-red-500/50 rounded-xl p-8 text-center bg-[#16161c] transition-colors cursor-pointer">
                <UploadCloud className="mx-auto h-8 w-8 text-zinc-400 mb-2" />
                <p className="text-xs text-zinc-300">
                  Déposez la CNI du client, la facture d&apos;achat et la carte grise originale
                </p>
                <p className="text-[10px] text-zinc-500 mt-1">
                  Formats acceptés : PDF, JPG, PNG (Max 15 Mo par document)
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Frais d&apos;immatriculation et taxes préfectorales
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border border-[#24242e] bg-[#16161c] space-y-1">
                  <span className="text-[10px] text-zinc-400 uppercase">Droits de timbre &amp; Taxe CG</span>
                  <div className="font-mono font-bold text-white text-sm">750 DH</div>
                </div>
                <div className="p-3 rounded-lg border border-[#24242e] bg-[#16161c] space-y-1">
                  <span className="text-[10px] text-zinc-400 uppercase">Frais de dossier / Démarches</span>
                  <div className="font-mono font-bold text-emerald-400 text-sm">200 DH</div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Récapitulatif avant enregistrement
              </h2>
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl border border-[#24242e] bg-[#16161c]">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Client</span>
                  <div className="font-bold text-white text-xs">{client} ({phone})</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Véhicule</span>
                  <div className="font-bold text-white text-xs">{vehicle}</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Préfecture</span>
                  <div className="text-zinc-300">{prefecture} ({region})</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Total Frais HT</span>
                  <div className="font-mono font-bold text-emerald-400 text-xs">950 DH</div>
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
                href="/registrations"
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
              {step < 4 ? 'Suivant' : isSubmitting ? 'Enregistrement...' : 'Créer le dossier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
