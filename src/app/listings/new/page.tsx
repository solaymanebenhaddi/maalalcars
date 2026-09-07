'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Megaphone,
  UploadCloud,
} from 'lucide-react'

export default function NewListingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Fields matching Reference #38 Screen 2
  const [brand, setBrand] = useState('Toyota')
  const [model, setModel] = useState('Land Cruiser')
  const [version, setVersion] = useState('VR-R 4.0L Essence')
  const [year, setYear] = useState('2023')
  const [fuel, setFuel] = useState('Essence')
  const [transmission, setTransmission] = useState('Automatique')
  const [mileage, setMileage] = useState('17 450')
  const [exteriorColor, setExteriorColor] = useState('Blanc Nacré')
  const [interiorColor, setInteriorColor] = useState('Beige')
  const [seats, setSeats] = useState('7')
  const [vin, setVin] = useState('JTMHV02J804567890')
  const [price, setPrice] = useState('865 000')
  const [description, setDescription] = useState(
    'Toyota Land Cruiser VR-R 4.0L Essence — 7 places, Toit ouvrant, Cuir, Caméra 360°, JBL Premium Sound.'
  )

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 4) {
      setStep(step + 1)
      return
    }
    setIsSubmitting(true)
    setTimeout(() => {
      router.push('/listings')
    }, 600)
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto text-xs text-white">
      {/* Top Breadcrumbs */}
      <div className="flex items-center gap-2 text-zinc-400">
        <Link
          href="/listings"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour aux annonces</span>
        </Link>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-300">Annonces</span>
        <span className="text-zinc-600">&gt;</span>
        <span className="font-semibold text-white">Créer une annonce</span>
      </div>

      <div className="rounded-xl border border-[#222228] bg-[#121216] p-6 shadow-xl space-y-5">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-red-500" />
            <span>Créer une annonce véhicule</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Renseignez les détails du véhicule avant publication multi-plateformes.
          </p>
        </div>

        {/* Stepper 4 Steps matching Reference #38 Screen 2 */}
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
            <span className="text-[11px] font-semibold truncate">Informations véhicule</span>
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
            <span className="text-[11px] font-semibold truncate">Détails &amp; équipements</span>
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
            <span className="text-[11px] font-semibold truncate">Média &amp; Photos</span>
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
            <span className="text-[11px] font-semibold truncate">Publication</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Informations véhicule
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Marque <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Modèle <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Version
                  </label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none"
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
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Carburant <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={fuel}
                    onChange={(e) => setFuel(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Essence">Essence</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybride">Hybride</option>
                    <option value="Électrique">Électrique</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Transmission <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Automatique">Automatique</option>
                    <option value="Manuelle">Manuelle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Kilométrage (km) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Prix de vente (DH) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono font-bold focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Couleur extérieure
                  </label>
                  <input
                    type="text"
                    value={exteriorColor}
                    onChange={(e) => setExteriorColor(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Couleur intérieure
                  </label>
                  <input
                    type="text"
                    value={interiorColor}
                    onChange={(e) => setInteriorColor(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Nombre de places
                  </label>
                  <input
                    type="text"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    VIN / N° Châssis
                  </label>
                  <input
                    type="text"
                    value={vin}
                    onChange={(e) => setVin(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Description de l&apos;annonce
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-[#282834] bg-[#18181f] p-2.5 text-xs text-white focus:outline-none focus:border-red-500 leading-relaxed"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Équipements et options du véhicule
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  'Toit ouvrant panoramique',
                  'Caméra 360°',
                  'Sellerie cuir nappa',
                  'Système son JBL Premium',
                  'Climatisation quadri-zone',
                  'Cockpit digital',
                  'Jantes alliage 20 pouces',
                  'Régulateur adaptatif',
                  'Hayon électrique mains libres',
                ].map((eq, i) => (
                  <label key={i} className="flex items-center gap-2 p-2.5 rounded-lg border border-[#282834] bg-[#16161c] cursor-pointer hover:border-zinc-600">
                    <input type="checkbox" defaultChecked className="accent-red-600" />
                    <span className="text-xs text-zinc-200">{eq}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Galerie photos (Recommandé : au moins 5 photos HD)
              </h2>
              <div className="border-2 border-dashed border-[#282834] hover:border-red-500/50 rounded-xl p-8 text-center bg-[#16161c] transition-colors cursor-pointer">
                <UploadCloud className="mx-auto h-8 w-8 text-zinc-400 mb-2" />
                <p className="text-xs text-zinc-300">
                  Glissez-déposez les photos du véhicule (Vue avant, 3/4, arrière, intérieur, tableau de bord)
                </p>
                <p className="text-[10px] text-zinc-500 mt-1">
                  Formats acceptés : JPG, PNG, WEBP (Max 10 Mo par photo)
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Récapitulatif avant diffusion
              </h2>
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl border border-[#24242e] bg-[#16161c]">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Véhicule</span>
                  <div className="font-bold text-white text-xs">{brand} {model} {version} ({year})</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Prix affiché</span>
                  <div className="font-mono font-bold text-emerald-400 text-xs">{price} DH</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Kilométrage</span>
                  <div className="font-mono text-zinc-200">{mileage} km · {fuel} · {transmission}</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Diffusion prévue</span>
                  <div className="text-cyan-400 font-semibold">Avito.ma, Moteur.ma, Auto24 +5</div>
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
                href="/listings"
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
              {step < 4 ? 'Suivant' : isSubmitting ? 'Publication...' : 'Publier l’annonce'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
