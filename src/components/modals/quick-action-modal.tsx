'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import {
  X,
  Car,
  ReceiptText,
  CreditCard,
  CalendarDays,
  BadgePercent,
  FolderArchive,
  Receipt,
  UserCheck,
  Plus,
  ArrowRight,
  Download,
} from 'lucide-react'
import clsx from 'clsx'

interface QuickActionModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenExport?: () => void
}

export function QuickActionModal({ isOpen, onClose, onOpenExport }: QuickActionModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  const handleNavigate = (path: string) => {
    onClose()
    router.push(path)
  }

  const actions = [
    {
      title: 'Ajouter un véhicule',
      description: 'Créer une nouvelle fiche véhicule dans le stock',
      icon: Car,
      color: 'text-red-500 bg-red-500/10 border-red-500/20',
      action: () => handleNavigate('/vehicles/new'),
    },
    {
      title: 'Enregistrer une vente',
      description: 'Créer un bon de commande et finaliser une vente',
      icon: BadgePercent,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      action: () => handleNavigate('/sales/new'),
    },
    {
      title: 'Réserver un véhicule',
      description: 'Bloquer un véhicule pour un client avec acompte',
      icon: CalendarDays,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      action: () => handleNavigate('/reservations/new'),
    },
    {
      title: 'Générer une facture',
      description: 'Émettre une facture de vente ou proforma en Dirhams',
      icon: Receipt,
      color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
      action: () => handleNavigate('/invoices/new'),
    },
    {
      title: 'Ajouter une dépense',
      description: 'Enregistrer un frais lié à un véhicule ou de l’atelier',
      icon: ReceiptText,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
      action: () => handleNavigate('/expenses/new'),
    },
    {
      title: 'Enregistrer un paiement',
      description: 'Saisir un encaissement ou versement virement/chèque',
      icon: CreditCard,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      action: () => handleNavigate('/payments'),
    },
    {
      title: 'Téléverser un document',
      description: 'Ajouter une carte grise, CIN, ou attestation d’assurance',
      icon: FolderArchive,
      color: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
      action: () => handleNavigate('/documents/upload'),
    },
    {
      title: 'Nouveau Contact / Client',
      description: 'Ajouter un acheteur, vendeur, fournisseur ou semsar',
      icon: UserCheck,
      color: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
      action: () => handleNavigate('/contacts/new'),
    },
    {
      title: 'Exporter les données',
      description: 'Générer un export Excel / CSV / PDF du stock ou des finances',
      icon: Download,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      action: () => {
        onClose()
        onOpenExport?.()
      },
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#282832] bg-[#111115] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#222228] px-6 py-4 bg-[#0d0d10]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Menu d’Actions Universelles</h2>
              <p className="text-xs text-zinc-400">Sélectionnez une opération métier rapide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-[#1c1c24] hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Actions Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {actions.map((act, i) => {
              const Icon = act.icon
              return (
                <button
                  key={i}
                  onClick={act.action}
                  className="group flex items-start gap-3.5 rounded-xl border border-[#222228] bg-[#16161c] p-4 text-left transition-all duration-150 hover:border-zinc-600 hover:bg-[#1c1c24] hover:shadow-lg active:scale-[0.98]"
                >
                  <div className={clsx('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border', act.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">
                        {act.title}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-zinc-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="mt-1 text-[11px] text-zinc-400 leading-snug line-clamp-2">
                      {act.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-[#222228] bg-[#0c0c0e] px-6 py-3.5 text-xs text-zinc-400">
          <span>Plateforme MAALAL CARS — Raccourci d’action rapide</span>
          <button
            onClick={onClose}
            className="rounded-lg border border-[#262630] bg-[#141418] px-4 py-1.5 font-medium text-zinc-300 hover:bg-[#1a1a22] hover:text-white"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}
