'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ShieldCheck,
  UploadCloud,
  FileText,
  Trash2,
} from 'lucide-react'

export default function NewWarrantyPage() {
  const router = useRouter()
  const [client, setClient] = useState('Yassine Benali')
  const [vehicle, setVehicle] = useState('Toyota Land Cruiser VR-R 4.0L Essence')
  const [warrantyType, setWarrantyType] = useState('Garantie constructeur')
  const [supplier, setSupplier] = useState('Toyota Maroc')
  const [startDate, setStartDate] = useState('2025-05-15')
  const [endDate, setEndDate] = useState('2027-05-15')
  const [mileageCovered, setMileageCovered] = useState('120 000')
  const [ceilingAmount, setCeilingAmount] = useState('15 000')
  const [deductible, setDeductible] = useState('150')

  // Coverage checkboxes
  const [coverageOptions, setCoverageOptions] = useState({
    moteur: true,
    boiteDeVitesses: true,
    electronique: true,
    climatisation: true,
    suspension: true,
    freinage: true,
  })

  // Attached files
  const [files, setFiles] = useState([
    { id: '1', name: 'Conditions_garantie.pdf', size: '245 Ko' },
    { id: '2', name: 'Facture_vehicule.pdf', size: '180 Ko' },
  ])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      router.push('/warranties')
    }, 600)
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Breadcrumb matching Reference #33 Sub-screen 1 */}
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
        <span className="font-semibold text-white">Nouvelle garantie</span>
      </div>

      <div className="rounded-xl border border-[#222228] bg-[#121216] p-6 shadow-xl space-y-6">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-red-500" />
            <span>Nouvelle garantie</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Souscrivez ou enregistrez une garantie constructeur ou extension pour un véhicule.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section 1: Informations générales */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
              Informations générales
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Client <span className="text-red-500">*</span>
                </label>
                <select
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="Yassine Benali">Yassine Benali</option>
                  <option value="Imane Zahiri">Imane Zahiri</option>
                  <option value="Omar Bennis">Omar Bennis</option>
                  <option value="Sarah Benali">Sarah Benali</option>
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
                  <option value="Toyota Land Cruiser VR-R 4.0L Essence">Toyota Land Cruiser VR-R 4.0L Essence</option>
                  <option value="Mercedes-Benz GLC 2022">Mercedes-Benz GLC 2022</option>
                  <option value="BMW X5 2022">BMW X5 2022</option>
                  <option value="Audi Q7 2021">Audi Q7 2021</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Type de garantie <span className="text-red-500">*</span>
                </label>
                <select
                  value={warrantyType}
                  onChange={(e) => setWarrantyType(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="Garantie constructeur">Garantie constructeur</option>
                  <option value="Extension garantie">Extension garantie</option>
                  <option value="Garantie occasion certifiée">Garantie occasion certifiée</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Fournisseur / Concessionnaire <span className="text-red-500">*</span>
                </label>
                <select
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="Toyota Maroc">Toyota Maroc</option>
                  <option value="BMW Group">BMW Group</option>
                  <option value="Auto Nejma">Auto Nejma</option>
                  <option value="CAC Volkswagen">CAC Volkswagen</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Date de début <span className="text-red-500">*</span>
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
                  Date de fin <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Kilométrage couvert (km)
                </label>
                <input
                  type="text"
                  value={mileageCovered}
                  onChange={(e) => setMileageCovered(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Plafond de couverture (DH) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={ceilingAmount}
                  onChange={(e) => setCeilingAmount(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Franchise (DH) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={deductible}
                  onChange={(e) => setDeductible(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Options de couverture */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
              Options de couverture
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { key: 'moteur', label: 'Moteur' },
                { key: 'boiteDeVitesses', label: 'Boîte de vitesses' },
                { key: 'electronique', label: 'Électronique' },
                { key: 'climatisation', label: 'Climatisation' },
                { key: 'suspension', label: 'Suspension' },
                { key: 'freinage', label: 'Freinage' },
              ].map((opt) => (
                <label
                  key={opt.key}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-[#24242e] bg-[#16161c] cursor-pointer hover:bg-[#1a1a20]"
                >
                  <input
                    type="checkbox"
                    checked={coverageOptions[opt.key as keyof typeof coverageOptions]}
                    onChange={() =>
                      setCoverageOptions({
                        ...coverageOptions,
                        [opt.key as keyof typeof coverageOptions]:
                          !coverageOptions[opt.key as keyof typeof coverageOptions],
                      })
                    }
                    className="rounded accent-red-600 h-4 w-4"
                  />
                  <span className="font-semibold text-white text-[11px]">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 3: Documents */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#222228] pb-2">
              Documents
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-[#282834] hover:border-red-500/50 rounded-xl p-6 text-center bg-[#16161c] transition-colors cursor-pointer flex flex-col items-center justify-center">
                <UploadCloud className="h-6 w-6 text-zinc-400 mb-1" />
                <p className="text-xs text-zinc-300">
                  Glissez-déposez les fichiers ici ou <span className="text-red-400 font-semibold underline">Parcourir</span>
                </p>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  PDF, JPG, PNG — Max 10 Mo
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase">Documents ajoutés</span>
                {files.map((f) => (
                  <div key={f.id} className="flex items-center justify-between p-2.5 rounded-lg border border-[#24242e] bg-[#16161c]">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-cyan-400" />
                      <div>
                        <div className="font-semibold text-white text-xs">{f.name}</div>
                        <div className="text-[10px] text-zinc-400">{f.size}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFiles(files.filter((item) => item.id !== f.id))}
                      className="p-1 rounded text-zinc-400 hover:text-red-400 hover:bg-zinc-800"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#222228]">
            <Link
              href="/warranties"
              className="rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-lg shadow-red-950/50 transition-colors"
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer la garantie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
