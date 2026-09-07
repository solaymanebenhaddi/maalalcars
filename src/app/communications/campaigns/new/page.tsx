'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Mail,
  Smartphone,
} from 'lucide-react'

export default function NewCampaignPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [channel, setChannel] = useState<'Email' | 'SMS' | 'WhatsApp'>('Email')
  const [campaignName, setCampaignName] = useState('Promotion Été 2025')
  const [objective, setObjective] = useState('Promotion')
  const [audience, setAudience] = useState('Clients actifs')
  const [subject, setSubject] = useState('Profitez de nos offres exclusives !')
  const [messageBody, setMessageBody] = useState(
    'Bonjour {first_name},\n\nProfitez de nos offres exceptionnelles d’été sur une sélection de véhicules d’occasion garantis chez MAALAL CARS.'
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 5) {
      setStep(step + 1)
      return
    }
    setIsSubmitting(true)
    setTimeout(() => {
      alert('Campagne programmée avec succès !')
      router.push('/communications')
    }, 500)
  }

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Breadcrumbs */}
      <div className="flex items-center gap-2 text-zinc-400">
        <Link
          href="/communications"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Boîte de réception</span>
        </Link>
        <span className="text-zinc-600">/</span>
        <span className="text-zinc-300">Communications</span>
        <span className="text-zinc-600">&gt;</span>
        <span className="font-semibold text-white">Nouvelle campagne</span>
      </div>

      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-4">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <Mail className="h-4 w-4 text-red-500" />
            <span>Créer une campagne de communication</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Diffusez des offres et relances ciblées par Email, SMS ou WhatsApp.
          </p>
        </div>

        {/* Stepper 5 steps matching Reference #37 Screen 3 */}
        <div className="grid grid-cols-5 gap-2 border-b border-[#222228] pb-4">
          {[
            { n: 1, label: 'Détails' },
            { n: 2, label: 'Audience' },
            { n: 3, label: 'Contenu' },
            { n: 4, label: 'Planification' },
            { n: 5, label: 'Aperçu' },
          ].map((s) => (
            <div
              key={s.n}
              onClick={() => setStep(s.n)}
              className={`cursor-pointer flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                step === s.n
                  ? 'border-red-500 bg-red-500/10 text-white font-bold'
                  : 'border-[#24242e] bg-[#16161c] text-zinc-400'
              }`}
            >
              <span
                className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step === s.n ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {s.n}
              </span>
              <span className="truncate text-[11px]">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Form and Preview Layout matching Reference #37 Screen 3 */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Settings (span-7) */}
          <div className="lg:col-span-7 rounded-xl border border-[#222228] bg-[#16161c] p-4 space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-2">
              Paramètres de la campagne
            </h2>

            {/* Canal Selector */}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5">
                Canal d&apos;envoi
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Email', 'SMS', 'WhatsApp'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setChannel(c)}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      channel === c
                        ? 'border-red-500 bg-red-600/15 text-white'
                        : 'border-[#282834] bg-[#121216] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {c === 'Email' && <Mail className="h-3.5 w-3.5 text-cyan-400" />}
                    {c === 'SMS' && <Smartphone className="h-3.5 w-3.5 text-amber-400" />}
                    {c === 'WhatsApp' && <span className="text-emerald-400 font-bold text-xs">WA</span>}
                    <span>{c}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Nom de la campagne <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="h-8 w-full rounded-lg border border-[#282834] bg-[#121216] px-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Objectif
                </label>
                <select
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#121216] px-2 text-xs text-white focus:outline-none"
                >
                  <option value="Promotion">Promotion commerciale</option>
                  <option value="Information">Information stock</option>
                  <option value="Relance">Relance devis</option>
                  <option value="Fidélisation">Fidélisation</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Audience cible
                </label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#121216] px-2 text-xs text-white focus:outline-none"
                >
                  <option value="Clients actifs">Clients actifs (1 240 contacts)</option>
                  <option value="Prospects chauds">Prospects chauds (185 contacts)</option>
                  <option value="Tous les contacts">Tous les contacts (2 850)</option>
                </select>
              </div>
            </div>

            {channel === 'Email' && (
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Objet de l&apos;email
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="h-8 w-full rounded-lg border border-[#282834] bg-[#121216] px-3 text-xs text-white focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Contenu du message
              </label>
              <textarea
                rows={4}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                className="w-full rounded-lg border border-[#282834] bg-[#121216] p-2.5 text-xs text-white focus:outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* Right: Message Live Preview matching Reference #37 Screen 3 (span-5) */}
          <div className="lg:col-span-5 rounded-xl border border-[#222228] bg-[#16161c] p-4 space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202028] pb-2">
              Aperçu du message ({channel})
            </h2>

            <div className="rounded-xl border border-[#282834] bg-[#121216] p-4 space-y-3">
              <div className="border-b border-[#202028] pb-2 text-[10px] text-zinc-400 space-y-1">
                <div>
                  <strong>Expéditeur :</strong> MAALAL CARS &lt;contact@maalalcars.ma&gt;
                </div>
                {channel === 'Email' && (
                  <div>
                    <strong>Objet :</strong> <span className="text-white font-semibold">{subject}</span>
                  </div>
                )}
              </div>

              {/* Graphic Banner for Email Campaign */}
              <div className="rounded-lg bg-gradient-to-r from-red-950 via-zinc-900 to-black p-4 border border-red-500/30 text-center space-y-1">
                <div className="text-[10px] uppercase tracking-widest text-red-400 font-black">
                  MAALAL CARS
                </div>
                <div className="text-sm font-black text-white">OFFRES EXCLUSIVES ÉTÉ 2025</div>
                <p className="text-[10px] text-zinc-400">Jusqu&apos;à 30 000 DH d&apos;avantages sur notre stock premium</p>
              </div>

              <p className="text-xs text-zinc-200 whitespace-pre-line leading-relaxed">
                {messageBody}
              </p>

              <div className="text-center pt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold text-xs shadow hover:bg-red-500"
                >
                  Découvrir les offres maintenant
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#202028]">
              <Link
                href="/communications"
                className="rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs text-zinc-300 hover:text-white"
              >
                Enregistrer brouillon
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-500 shadow-lg shadow-red-950/50 transition-colors"
              >
                {step < 5 ? 'Suivant' : isSubmitting ? 'Envoi...' : 'Lancer la campagne'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
