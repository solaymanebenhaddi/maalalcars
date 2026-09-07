'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  CheckSquare,
  UploadCloud,
} from 'lucide-react'

export default function NewTaskPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Fields matching Reference #36 Screen 2
  const [title, setTitle] = useState('Préparer livraison Toyota Hilux')
  const [category, setCategory] = useState('Livraison')
  const [description, setDescription] = useState(
    'Checklist de livraison et vérification du véhicule avant remise au client...'
  )
  const [dueDate, setDueDate] = useState('2025-05-22')
  const [reminder, setReminder] = useState('1 jour avant')
  const [priority, setPriority] = useState<'Haute' | 'Moyenne' | 'Basse'>('Haute')
  const [projectRef, setProjectRef] = useState('Dossier V-2025-0048')
  const [assignee, setAssignee] = useState('Mehdi Lahlou')

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 4) {
      setStep(step + 1)
      return
    }
    setIsSubmitting(true)
    setTimeout(() => {
      router.push('/tasks')
    }, 600)
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto text-xs text-white">
      {/* Top Breadcrumbs */}
      <div className="flex items-center gap-2 text-zinc-400">
        <Link
          href="/tasks"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour aux tâches</span>
        </Link>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-300">Tâches</span>
        <span className="text-zinc-600">&gt;</span>
        <span className="font-semibold text-white">Nouvelle tâche</span>
      </div>

      <div className="rounded-xl border border-[#222228] bg-[#121216] p-6 shadow-xl space-y-5">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-red-500" />
            <span>Nouvelle tâche opérationnelle</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Création d&apos;une tâche, d&apos;une checklist ou d&apos;une demande d&apos;approbation.
          </p>
        </div>

        {/* Stepper 4 Steps matching Reference #36 Screen 2 */}
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
            <span className="text-[11px] font-semibold truncate">Assignation</span>
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
            <span className="text-[11px] font-semibold truncate">Détails</span>
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
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Informations générales
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Titre de la tâche <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Catégorie <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="Livraison">Livraison</option>
                    <option value="Vente">Vente</option>
                    <option value="Administratif">Administratif</option>
                    <option value="Atelier">Atelier</option>
                    <option value="Finance">Finance / Approbation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-[#282834] bg-[#18181f] p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Échéance <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
                  >
                  </input>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Rappel
                  </label>
                  <select
                    value={reminder}
                    onChange={(e) => setReminder(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Le jour même">Le jour même</option>
                    <option value="1 jour avant">1 jour avant</option>
                    <option value="2 jours avant">2 jours avant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Priorité <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-1.5 h-8">
                    {(['Haute', 'Moyenne', 'Basse'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`flex-1 rounded-lg text-xs font-semibold border ${
                          priority === p
                            ? p === 'Haute'
                              ? 'bg-red-600 text-white border-red-500'
                              : p === 'Moyenne'
                              ? 'bg-amber-600 text-white border-amber-500'
                              : 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-[#18181f] text-zinc-400 border-[#282834]'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Assignation &amp; Rattachement
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Responsable assigné <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="Mehdi Lahlou">Mehdi Lahlou</option>
                    <option value="Omar Bennis">Omar Bennis</option>
                    <option value="Imane Zahiri">Imane Zahiri</option>
                    <option value="Youssef El Hariri">Youssef El Hariri</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                    Projet / Référence rattachée
                  </label>
                  <input
                    type="text"
                    value={projectRef}
                    onChange={(e) => setProjectRef(e.target.value)}
                    className="h-8 w-full rounded-lg border border-[#282834] bg-[#18181f] px-3 text-xs text-white font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Pièces jointes &amp; Checklists
              </h2>

              <div className="border-2 border-dashed border-[#282834] hover:border-red-500/50 rounded-xl p-8 text-center bg-[#16161c] transition-colors cursor-pointer">
                <UploadCloud className="mx-auto h-8 w-8 text-zinc-400 mb-2" />
                <p className="text-xs text-zinc-300">
                  Glissez-déposez vos documents (PDF, JPG, PNG, DOCX)
                </p>
                <p className="text-[10px] text-zinc-500 mt-1">
                  Max 15 Mo par fichier
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Récapitulatif de la tâche
              </h2>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl border border-[#24242e] bg-[#16161c]">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Titre</span>
                  <div className="font-bold text-white text-xs">{title}</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Catégorie &amp; Priorité</span>
                  <div className="text-zinc-300">{category} · {priority}</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Assigné à</span>
                  <div className="font-bold text-white text-xs">{assignee}</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Échéance</span>
                  <div className="font-mono text-cyan-400">{dueDate}</div>
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
                href="/tasks"
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
              {step < 4 ? 'Suivant' : isSubmitting ? 'Création...' : 'Créer la tâche'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
