'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Hash,
  RotateCcw,
  CheckCircle2,
  History,
} from 'lucide-react'

export default function InvoiceNumberingPage() {
  const [prefix, setPrefix] = useState('FAC')
  const [yearFormat, setYearFormat] = useState('2025')
  const [separator, setSeparator] = useState('-')
  const [seqLength, setSeqLength] = useState('5')

  const [resetYearly, setResetYearly] = useState(false)
  const [preventDuplicates, setPreventDuplicates] = useState(true)
  const [lockManual, setLockManual] = useState(true)

  const previewNumber = `${prefix}${separator}${yearFormat}${separator}00046`

  return (
    <div className="space-y-4 max-w-6xl mx-auto text-xs text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/settings/invoices"
          className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour aux paramètres factures</span>
        </Link>

        <button className="flex items-center gap-1 rounded-lg border border-[#282834] bg-[#18181f] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
          <History className="h-3.5 w-3.5 text-zinc-400" />
          <span>Historique</span>
        </button>
      </div>

      {/* Main Container matching Reference #30 Screen 2 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-6 space-y-6 shadow-xl">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white">
            Numérotation des factures
          </h1>
          <p className="text-xs text-zinc-400">
            Paramètres &gt; Factures &gt; Numérotation • Définissez le format, la séquence et les règles de numérotation légale
          </p>
        </div>

        {/* Row 1: Format & Séquence actuelle */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Col 1: Format de numérotation */}
          <div className="p-4 rounded-xl bg-[#16161c] border border-[#24242e] space-y-4">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2 flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5 text-red-500" />
              <span>Format de numérotation</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Préfixe
                </label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#121216] px-3 text-xs font-mono font-bold text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Année
                </label>
                <select
                  value={yearFormat}
                  onChange={(e) => setYearFormat(e.target.value)}
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#121216] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="2025">Année en cours (2025)</option>
                  <option value="25">Année courte (25)</option>
                  <option value="">Sans année</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Séparateur
                </label>
                <select
                  value={separator}
                  onChange={(e) => setSeparator(e.target.value)}
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#121216] px-3 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                >
                  <option value="-">- (Tiret)</option>
                  <option value="/">/ (Slash)</option>
                  <option value="_">_ (Underscore)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 pb-1">
                  Séquence
                </label>
                <select
                  value={seqLength}
                  onChange={(e) => setSeqLength(e.target.value)}
                  className="h-9 w-full rounded-lg border border-[#282834] bg-[#121216] px-3 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="5">5 chiffres (00001)</option>
                  <option value="4">4 chiffres (0001)</option>
                  <option value="6">6 chiffres (000001)</option>
                </select>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#121216] border border-[#202028] flex items-center justify-between">
              <span className="text-[11px] text-zinc-400 font-semibold">Aperçu :</span>
              <span className="font-mono font-black text-cyan-400 text-sm">{previewNumber}</span>
            </div>
          </div>

          {/* Col 2: Séquence actuelle */}
          <div className="p-4 rounded-xl bg-[#16161c] border border-[#24242e] space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2 flex items-center gap-1.5">
                <RotateCcw className="h-3.5 w-3.5 text-cyan-400" />
                <span>Séquence actuelle</span>
              </h3>

              <div className="space-y-3 py-2 text-[11px]">
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#121216]">
                  <span className="text-zinc-400">Dernier numéro généré</span>
                  <span className="font-mono font-bold text-zinc-200">FAC-2025-00045</span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#121216]">
                  <span className="text-zinc-400">Prochain numéro</span>
                  <span className="font-mono font-bold text-emerald-400">FAC-2025-00046</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                className="w-full py-2 rounded-lg border border-[#282834] bg-[#121216] text-xs font-semibold text-zinc-300 hover:text-white"
              >
                Réinitialiser la séquence
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Options avancées & Exemples */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Options avancées */}
          <div className="p-4 rounded-xl bg-[#16161c] border border-[#24242e] space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Options avancées
            </h3>

            <div className="space-y-3 text-[11px]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Réinitialiser la séquence chaque année</div>
                  <div className="text-[10px] text-zinc-400">Recommencer à 00001 chaque 1er janvier</div>
                </div>
                <button
                  type="button"
                  onClick={() => setResetYearly(!resetYearly)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    resetYearly ? 'bg-emerald-500' : 'bg-zinc-700'
                  }`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    resetYearly ? 'translate-x-4' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Éviter les doublons</div>
                  <div className="text-[10px] text-zinc-400">Vérification automatique des numéros existants</div>
                </div>
                <button
                  type="button"
                  onClick={() => setPreventDuplicates(!preventDuplicates)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    preventDuplicates ? 'bg-emerald-500' : 'bg-zinc-700'
                  }`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    preventDuplicates ? 'translate-x-4' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Verrouiller la numérotation manuelle</div>
                  <div className="text-[10px] text-zinc-400">Empêcher la modification manuelle des numéros</div>
                </div>
                <button
                  type="button"
                  onClick={() => setLockManual(!lockManual)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    lockManual ? 'bg-emerald-500' : 'bg-zinc-700'
                  }`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    lockManual ? 'translate-x-4' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Exemples de numérotation */}
          <div className="p-4 rounded-xl bg-[#16161c] border border-[#24242e] space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Exemples de numérotation
            </h3>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between items-center p-2 rounded-lg bg-[#121216]">
                <span className="font-mono text-zinc-200">FAC-2025-00001</span>
                <span className="text-[10px] text-emerald-400 font-medium">Standard</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg bg-[#121216]">
                <span className="font-mono text-zinc-200">FAC-2025-01234</span>
                <span className="text-[10px] text-emerald-400 font-medium">Standard</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg bg-[#121216]">
                <span className="font-mono text-zinc-200">DEV-2025-00001</span>
                <span className="text-[10px] text-cyan-400 font-medium">Devis</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-lg bg-[#121216]">
                <span className="font-mono text-zinc-200">AVO-2025-00001</span>
                <span className="text-[10px] text-amber-400 font-medium">Avoir</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end pt-4 border-t border-[#202028]">
          <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-6 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Enregistrer les modifications</span>
          </button>
        </div>
      </div>
    </div>
  )
}
