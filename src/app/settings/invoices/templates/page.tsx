'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Eye,
  CheckCircle2,
  FileText,
  Sparkles,
} from 'lucide-react'

export default function InvoiceTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('premium')
  const [logoPosition, setLogoPosition] = useState<'left' | 'center' | 'right'>('left')

  const [elements, setElements] = useState({
    logo: true,
    clientInfo: true,
    itemsTable: true,
    vatIce: true,
    legalMentions: true,
    terms: true,
    footer: true,
    qrCode: true,
  })

  const toggleElement = (key: keyof typeof elements) => {
    setElements(prev => ({ ...prev, [key]: !prev[key] }))
  }

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
      </div>

      {/* Main Container matching Reference #30 Screen 3 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-6 space-y-6 shadow-xl">
        <div className="border-b border-[#222228] pb-3">
          <h1 className="text-base sm:text-lg font-black text-white">
            Personnalisation du modèle de facture
          </h1>
          <p className="text-xs text-zinc-400">
            Paramètres &gt; Factures &gt; Modèle • Choisissez un modèle et personnalisez sa mise en page
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#222228] pb-2 text-xs">
          <button className="font-bold text-white relative pb-1">
            <span>Modèle</span>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
          </button>
          <button className="text-zinc-400 hover:text-white font-semibold">Mise en page</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Couleurs</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Typographie</button>
          <button className="text-zinc-400 hover:text-white font-semibold">Éléments</button>
        </div>

        {/* Choisir un modèle (3 Cards) */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white">
            Choisir un modèle
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Modèle Standard */}
            <div
              onClick={() => setSelectedTemplate('standard')}
              className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between h-40 transition-all ${
                selectedTemplate === 'standard'
                  ? 'border-red-500 bg-red-500/10 shadow-sm'
                  : 'border-[#24242e] bg-[#16161c] hover:border-zinc-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <FileText className="h-6 w-6 text-zinc-400" />
                {selectedTemplate === 'standard' && (
                  <CheckCircle2 className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div>
                <div className="font-bold text-white text-xs">Modèle Standard</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Simple et épuré</div>
              </div>
            </div>

            {/* Modèle Premium */}
            <div
              onClick={() => setSelectedTemplate('premium')}
              className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between h-40 transition-all ${
                selectedTemplate === 'premium'
                  ? 'border-red-500 bg-red-500/10 shadow-sm ring-1 ring-red-500/30'
                  : 'border-[#24242e] bg-[#16161c] hover:border-zinc-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <Sparkles className="h-6 w-6 text-red-500" />
                {selectedTemplate === 'premium' && (
                  <CheckCircle2 className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div>
                <div className="font-bold text-white text-xs">Modèle Premium</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Moderne et professionnel</div>
              </div>
            </div>

            {/* Modèle Classique */}
            <div
              onClick={() => setSelectedTemplate('classic')}
              className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between h-40 transition-all ${
                selectedTemplate === 'classic'
                  ? 'border-red-500 bg-red-500/10 shadow-sm'
                  : 'border-[#24242e] bg-[#16161c] hover:border-zinc-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <FileText className="h-6 w-6 text-zinc-400" />
                {selectedTemplate === 'classic' && (
                  <CheckCircle2 className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div>
                <div className="font-bold text-white text-xs">Modèle Classique</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Traditionnel et formel</div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Éléments affichés & Disposition du logo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Éléments affichés */}
          <div className="p-4 rounded-xl bg-[#16161c] border border-[#24242e] space-y-3">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Éléments affichés
            </h3>

            <div className="grid grid-cols-2 gap-2.5 text-[11px]">
              <label onClick={() => toggleElement('logo')} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={elements.logo} readOnly className="h-4 w-4 rounded bg-zinc-800 border-zinc-600 text-red-600 focus:ring-0" />
                <span className="text-zinc-300">Logo de l&apos;entreprise</span>
              </label>

              <label onClick={() => toggleElement('legalMentions')} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={elements.legalMentions} readOnly className="h-4 w-4 rounded bg-zinc-800 border-zinc-600 text-red-600 focus:ring-0" />
                <span className="text-zinc-300">Mentions légales</span>
              </label>

              <label onClick={() => toggleElement('clientInfo')} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={elements.clientInfo} readOnly className="h-4 w-4 rounded bg-zinc-800 border-zinc-600 text-red-600 focus:ring-0" />
                <span className="text-zinc-300">Informations client</span>
              </label>

              <label onClick={() => toggleElement('terms')} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={elements.terms} readOnly className="h-4 w-4 rounded bg-zinc-800 border-zinc-600 text-red-600 focus:ring-0" />
                <span className="text-zinc-300">Conditions générales</span>
              </label>

              <label onClick={() => toggleElement('itemsTable')} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={elements.itemsTable} readOnly className="h-4 w-4 rounded bg-zinc-800 border-zinc-600 text-red-600 focus:ring-0" />
                <span className="text-zinc-300">Tableau des articles</span>
              </label>

              <label onClick={() => toggleElement('footer')} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={elements.footer} readOnly className="h-4 w-4 rounded bg-zinc-800 border-zinc-600 text-red-600 focus:ring-0" />
                <span className="text-zinc-300">Pied de page</span>
              </label>

              <label onClick={() => toggleElement('vatIce')} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={elements.vatIce} readOnly className="h-4 w-4 rounded bg-zinc-800 border-zinc-600 text-red-600 focus:ring-0" />
                <span className="text-zinc-300">TVA / ICE</span>
              </label>

              <label onClick={() => toggleElement('qrCode')} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={elements.qrCode} readOnly className="h-4 w-4 rounded bg-zinc-800 border-zinc-600 text-red-600 focus:ring-0" />
                <span className="text-zinc-300">QR Code de paiement</span>
              </label>
            </div>
          </div>

          {/* Disposition du logo */}
          <div className="p-4 rounded-xl bg-[#16161c] border border-[#24242e] space-y-4">
            <h3 className="text-xs font-bold text-white border-b border-[#202028] pb-2">
              Disposition du logo
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div
                onClick={() => setLogoPosition('left')}
                className={`p-3 rounded-lg border text-center cursor-pointer space-y-2 ${
                  logoPosition === 'left' ? 'border-red-500 bg-red-500/10' : 'border-[#24242e] bg-[#121216]'
                }`}
              >
                <div className="h-10 border border-zinc-700 bg-zinc-900 rounded p-1 flex items-start">
                  <div className="h-3 w-4 bg-red-500 rounded-sm" />
                </div>
                <div className="text-[10px] font-semibold text-zinc-300">Gauche</div>
              </div>

              <div
                onClick={() => setLogoPosition('center')}
                className={`p-3 rounded-lg border text-center cursor-pointer space-y-2 ${
                  logoPosition === 'center' ? 'border-red-500 bg-red-500/10' : 'border-[#24242e] bg-[#121216]'
                }`}
              >
                <div className="h-10 border border-zinc-700 bg-zinc-900 rounded p-1 flex items-start justify-center">
                  <div className="h-3 w-4 bg-red-500 rounded-sm" />
                </div>
                <div className="text-[10px] font-semibold text-zinc-300">Centre</div>
              </div>

              <div
                onClick={() => setLogoPosition('right')}
                className={`p-3 rounded-lg border text-center cursor-pointer space-y-2 ${
                  logoPosition === 'right' ? 'border-red-500 bg-red-500/10' : 'border-[#24242e] bg-[#121216]'
                }`}
              >
                <div className="h-10 border border-zinc-700 bg-zinc-900 rounded p-1 flex items-start justify-end">
                  <div className="h-3 w-4 bg-red-500 rounded-sm" />
                </div>
                <div className="text-[10px] font-semibold text-zinc-300">Droite</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#202028]">
          <Link
            href="/settings/invoices/preview"
            className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#18181f] px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <Eye className="h-3.5 w-3.5 text-cyan-400" />
            <span>Aperçu du modèle</span>
          </Link>

          <button className="flex items-center gap-1.5 rounded-lg bg-red-600 px-6 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition-colors">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Enregistrer le modèle</span>
          </button>
        </div>
      </div>
    </div>
  )
}
