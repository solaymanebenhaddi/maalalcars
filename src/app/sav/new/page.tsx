'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  UploadCloud,
  FileText,
  User,
  Wrench,
} from 'lucide-react'

export default function NewSavTicketPage() {
  const router = useRouter()
  const [client, setClient] = useState('Yassine Benali')
  const [vehicle, setVehicle] = useState('Toyota Land Cruiser 2023')
  const [vinKm, setVinKm] = useState('VIN: JTMHV02J804567890 — 12 450 km')
  const [description, setDescription] = useState(
    'Le client signale un bruit métallique lors de l’accélération entre 60 et 80 km/h. Le problème apparaît à chaud et disparaît au ralenti.'
  )
  const [category, setCategory] = useState('Mécanique')
  const [priority, setPriority] = useState('Élevée')
  const [subject, setSubject] = useState('Bruit anormal à l’accélération')
  const [assignedTo, setAssignedTo] = useState('Sarah El Amrani')
  const [desiredDate, setDesiredDate] = useState('2025-05-16')
  const [desiredTime, setDesiredTime] = useState('09:00')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      router.push('/sav')
    }, 600)
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto text-xs text-white">
      {/* Top Breadcrumbs matching Reference #32 Screen 2 */}
      <div className="flex items-center gap-2 text-zinc-400">
        <Link
          href="/sav"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour au tableau de bord SAV</span>
        </Link>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-300">Accueil</span>
        <span className="text-zinc-600">&gt;</span>
        <span className="text-zinc-300">SAV / Support</span>
        <span className="text-zinc-600">&gt;</span>
        <span className="font-semibold text-white">Nouveau ticket</span>
      </div>

      <div className="rounded-xl border border-[#222228] bg-[#121216] p-6 shadow-xl space-y-5">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <Wrench className="h-4 w-4 text-red-500" />
            <span>Nouveau ticket SAV</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Renseignez les détails du ticket d&apos;assistance, le véhicule concerné et l&apos;affectation d&apos;équipe.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1: Client, Véhicule & Description */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-[#222228] bg-[#16161c] space-y-3">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-[#222228] pb-2">
                  <User className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Informations client et véhicule</span>
                </h2>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Client <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Yassine Benali">Yassine Benali (06 12 34 56 78)</option>
                    <option value="Imane Zahiri">Imane Zahiri (06 98 76 54 32)</option>
                    <option value="Omar Bennis">Omar Bennis (06 77 88 99 00)</option>
                    <option value="Sarah El Amrani">Sarah El Amrani (06 55 66 77 88)</option>
                    <option value="Mehdi Lahlou">Mehdi Lahlou (06 33 44 55 66)</option>
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
                    <option value="Toyota Land Cruiser 2023">Toyota Land Cruiser 2023 (12345-A-26)</option>
                    <option value="Mercedes-Benz GLC 2022">Mercedes-Benz GLC 2022 (54321-B-6)</option>
                    <option value="Audi Q7 2021">Audi Q7 2021 (99887-D-1)</option>
                    <option value="BMW X5 2022">BMW X5 2022 (11223-A-7)</option>
                    <option value="Toyota Hilux 2020">Toyota Hilux 2020 (44556-H-26)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    VIN / Kilométrage
                  </label>
                  <input
                    type="text"
                    value={vinKm}
                    onChange={(e) => setVinKm(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-zinc-300 font-mono focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Description détaillée <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez précisément les symptômes observés, les conditions d'apparition..."
                  className="w-full rounded-lg border border-[#282834] bg-[#18181f] p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Pièces jointes
                </label>
                <div className="border-2 border-dashed border-[#282834] hover:border-red-500/50 rounded-xl p-5 text-center bg-[#16161c] transition-colors cursor-pointer">
                  <UploadCloud className="mx-auto h-6 w-6 text-zinc-400 mb-1" />
                  <p className="text-xs text-zinc-300">
                    Glisser-déposer des fichiers ici ou <span className="text-red-400 font-semibold underline">Parcourir</span>
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    Formats acceptés : JPG, PNG, PDF (Max. 10 Mo)
                  </p>
                </div>
              </div>
            </div>

            {/* Column 2: Ticket metadata & assignation */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-[#222228] bg-[#16161c] space-y-3">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-[#222228] pb-2">
                  <FileText className="h-3.5 w-3.5 text-amber-400" />
                  <span>Informations du ticket</span>
                </h2>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Catégorie <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Mécanique">Mécanique</option>
                    <option value="Électrique">Électrique</option>
                    <option value="Carrosserie">Carrosserie</option>
                    <option value="Électronique">Électronique</option>
                    <option value="Climatisation">Climatisation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Priorité <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Élevée">Élevée (Urgence - Véhicule immobilisé)</option>
                    <option value="Moyenne">Moyenne (Problème de confort / intermittent)</option>
                    <option value="Basse">Basse (Simple vérification / cosmétique)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Sujet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Ex: Bruit anormal, Voyant moteur allumé..."
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#222228] bg-[#16161c] space-y-3">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-[#222228] pb-2">
                  <User className="h-3.5 w-3.5 text-purple-400" />
                  <span>Assignation &amp; Planification</span>
                </h2>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Assigné à <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Sarah El Amrani">Sarah El Amrani (Technicienne SAV)</option>
                    <option value="Mehdi Lahlou">Mehdi Lahlou (Chef d&apos;atelier)</option>
                    <option value="Kanza Bennani">Kanza Bennani (Conseillère Clientèle)</option>
                    <option value="Youssef El Idrissi">Youssef El Idrissi (Électromécanicien)</option>
                    <option value="Ayoub M'rabet">Ayoub M&apos;rabet (Diagnosticien)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                      Date souhaitée
                    </label>
                    <input
                      type="date"
                      value={desiredDate}
                      onChange={(e) => setDesiredDate(e.target.value)}
                      className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                      Heure souhaitée
                    </label>
                    <input
                      type="time"
                      value={desiredTime}
                      onChange={(e) => setDesiredTime(e.target.value)}
                      className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#222228]">
            <Link
              href="/sav"
              className="rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-lg shadow-red-950/50 transition-colors"
            >
              {isSubmitting ? 'Création en cours...' : 'Créer le ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
