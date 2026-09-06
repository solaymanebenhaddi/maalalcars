'use client'

import React from 'react'
import Link from 'next/link'
import {
  Hash,
  Building2,
  ShieldCheck,
  Clock,
  FileText,
  Image,
  Scale,
  Eye,
  History,
  ChevronRight,
} from 'lucide-react'

interface InvoiceSettingCard {
  id: string
  title: string
  desc: string
  status: string
  statusType: 'configured' | 'completed' | 'custom'
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const INVOICE_SETTINGS: InvoiceSettingCard[] = [
  {
    id: 'numbering',
    title: 'Numérotation des factures',
    desc: 'Définissez le préfixe, la séquence et le format de numérotation. Ex: FAC-2025-00045',
    status: 'Configurer →',
    statusType: 'configured',
    href: '/settings/invoices/numbering',
    icon: Hash,
  },
  {
    id: 'legal',
    title: 'Informations légales',
    desc: 'Renseignez les informations juridiques et fiscales de votre entreprise.',
    status: '✓ Complété',
    statusType: 'completed',
    href: '/settings/invoices/legal',
    icon: Building2,
  },
  {
    id: 'terms',
    title: 'Conditions générales',
    desc: 'Personnalisez vos conditions de vente et mentions supplémentaires.',
    status: '✓ Complété',
    statusType: 'completed',
    href: '/settings/invoices/legal',
    icon: ShieldCheck,
  },
  {
    id: 'due',
    title: 'Échéances & paiements',
    desc: 'Définissez les délais de paiement, pénalités et modes de règlement.',
    status: '30 jours',
    statusType: 'custom',
    href: '/settings/invoices/numbering',
    icon: Clock,
  },
  {
    id: 'footer',
    title: 'Pied de page & mentions',
    desc: 'Personnalisez le pied de page et les mentions légales marocaines.',
    status: '✓ Complété',
    statusType: 'completed',
    href: '/settings/invoices/legal',
    icon: FileText,
  },
  {
    id: 'logo',
    title: 'Logo & identité visuelle',
    desc: 'Ajoutez votre logo et positionnez-le sur vos documents.',
    status: '✓ Complété',
    statusType: 'completed',
    href: '/settings/invoices/templates',
    icon: Image,
  },
  {
    id: 'taxes',
    title: 'Champs fiscaux',
    desc: "Configurez la TVA (20%), l'ICE, le RC, la Patente et l'IF.",
    status: '✓ Complété',
    statusType: 'completed',
    href: '/settings/invoices/legal',
    icon: Scale,
  },
  {
    id: 'preview',
    title: 'Aperçu & modèle',
    desc: 'Personnalisez le modèle et visualisez le rendu de vos factures.',
    status: 'MODÈLE Premium',
    statusType: 'custom',
    href: '/settings/invoices/preview',
    icon: Eye,
  },
]

export function InvoicesSettingsClient() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs text-white">
      {/* Top Header matching Reference #30 Screen 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Paramètres des factures
          </h1>
          <p className="text-xs text-zinc-400">
            Personnalisez l&apos;ensemble des options liées à vos factures et à votre image de marque.
          </p>
        </div>

        <div className="flex items-center gap-3 text-zinc-400 text-[11px]">
          <span>Dernière modification : <strong className="text-zinc-200 font-mono">21/05/2025 à 14:32</strong></span>
          <button className="flex items-center gap-1 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white">
            <History className="h-3.5 w-3.5 text-zinc-400" />
            <span>Historique</span>
          </button>
        </div>
      </div>

      {/* 8 Feature Cards 4x2 Grid matching Reference #30 Screen 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {INVOICE_SETTINGS.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.id}
              href={card.href}
              className="group rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-sm hover:border-zinc-500 hover:bg-[#15151b] transition-all flex flex-col justify-between h-[190px]"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800/80 border border-zinc-700 text-red-500">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-1 my-2">
                <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#1e1e24] text-[10px]">
                <span
                  className={`font-bold ${
                    card.statusType === 'completed'
                      ? 'text-emerald-400 flex items-center gap-1'
                      : card.statusType === 'configured'
                      ? 'text-red-400'
                      : 'text-amber-400'
                  }`}
                >
                  {card.status}
                </span>
                <ChevronRight className="h-3 w-3 text-zinc-500 group-hover:text-red-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Bottom Summary Bar matching Reference #30 Screen 1 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-white tracking-wide">
          Résumé de vos paramètres
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
          <div className="p-3 rounded-lg bg-[#16161c] border border-[#202028]">
            <div className="text-[10px] text-zinc-400">Préfixe</div>
            <div className="font-mono font-bold text-white text-sm mt-0.5">FAC</div>
          </div>

          <div className="p-3 rounded-lg bg-[#16161c] border border-[#202028]">
            <div className="text-[10px] text-zinc-400">Dernier numéro</div>
            <div className="font-mono font-bold text-white text-sm mt-0.5">00045</div>
          </div>

          <div className="p-3 rounded-lg bg-[#16161c] border border-[#202028]">
            <div className="text-[10px] text-zinc-400">Prochaine facture</div>
            <div className="font-mono font-bold text-cyan-400 text-sm mt-0.5">FAC-2025-00046</div>
          </div>

          <div className="p-3 rounded-lg bg-[#16161c] border border-[#202028]">
            <div className="text-[10px] text-zinc-400">Format</div>
            <div className="font-mono font-bold text-zinc-300 text-xs mt-0.5">FAC-YYYY-NNNNN</div>
          </div>

          <div className="p-3 rounded-lg bg-[#16161c] border border-[#202028]">
            <div className="text-[10px] text-zinc-400">Échéance par défaut</div>
            <div className="font-bold text-emerald-400 text-sm mt-0.5">30 jours</div>
          </div>

          <div className="p-3 rounded-lg bg-[#16161c] border border-[#202028]">
            <div className="text-[10px] text-zinc-400">Devise</div>
            <div className="font-bold text-amber-400 text-sm mt-0.5">MAD (DH)</div>
          </div>
        </div>
      </div>
    </div>
  )
}
