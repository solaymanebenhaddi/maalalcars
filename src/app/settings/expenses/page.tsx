'use client'

import React from 'react'
import Link from 'next/link'
import {
  Folder,
  Users,
  FileCheck,
  Receipt,
  ShieldCheck,
  Bell,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react'

interface ExpenseSettingCard {
  id: string
  title: string
  desc: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

const EXPENSE_SETTING_CARDS: ExpenseSettingCard[] = [
  {
    id: 'categories',
    title: 'Catégories de dépenses',
    desc: 'Gérez les catégories et sous-catégories de dépenses disponibles.',
    href: '/settings/expenses/categories',
    icon: Folder,
    color: 'text-red-400 bg-red-500/10 border-red-500/30',
  },
  {
    id: 'approvals',
    title: "Règles d'approbation",
    desc: "Définissez les workflows d'approbation et les niveaux de validation.",
    href: '/settings/expenses/approvals',
    icon: Users,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  },
  {
    id: 'reimbursement',
    title: 'Remboursement & justificatifs',
    desc: 'Définissez les règles de remboursement et les documents obligatoires.',
    href: '/settings/expenses/reimbursement',
    icon: FileCheck,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  },
  {
    id: 'taxes',
    title: 'TVA & fiscalité',
    desc: 'Configurez la TVA, la déductibilité et les règles fiscales applicables.',
    href: '/settings/expenses/taxes',
    icon: Receipt,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  },
  {
    id: 'permissions',
    title: 'Autorisations & accès',
    desc: 'Contrôlez qui peut créer, approuver et gérer les dépenses.',
    href: '/settings/expenses/permissions',
    icon: ShieldCheck,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  },
  {
    id: 'alerts',
    title: 'Seuils d’alertes budgétaires',
    desc: 'Définissez les seuils, alertes et notifications par catégorie.',
    href: '/settings/expenses/alerts',
    icon: Bell,
    color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  },
]

export default function ExpenseSettingsHubPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto text-xs text-white">
      {/* Top Breadcrumb & Header matching Reference #32 Screen 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-zinc-400 text-xs">
            <Link
              href="/settings"
              className="flex items-center gap-1.5 rounded-lg border border-[#282834] bg-[#141418] px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Paramètres généraux</span>
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-400">Paramètres</span>
            <span className="text-zinc-600">&gt;</span>
            <span className="text-zinc-400">Dépenses</span>
            <span className="text-zinc-600">&gt;</span>
            <span className="font-semibold text-white">Paramètres</span>
          </div>
          <h1 className="text-base sm:text-xl font-black text-white tracking-tight pt-2">
            Paramètres des dépenses
          </h1>
          <p className="text-xs text-zinc-400">
            Configurez et centralisez les règles et politiques de dépenses selon les besoins de votre entreprise.
          </p>
        </div>
      </div>

      {/* Grid of 6 cards matching Reference #32 Screen 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EXPENSE_SETTING_CARDS.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.id}
              href={card.href}
              className="group rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-lg hover:border-zinc-500 hover:bg-[#15151b] transition-all flex items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border ${card.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                    {card.title}
                  </h2>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
            </Link>
          )
        })}
      </div>

      {/* Résumé des paramètres matching Reference #32 Screen 1 */}
      <div className="rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Résumé des paramètres
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
          <div className="rounded-lg border border-[#202028] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Catégories configurées</div>
            <div className="font-mono font-black text-white text-lg mt-1">24</div>
            <div className="text-[10px] text-emerald-400 font-semibold">Actives</div>
          </div>

          <div className="rounded-lg border border-[#202028] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Règles d&apos;approbation</div>
            <div className="font-mono font-black text-white text-lg mt-1">6</div>
            <div className="text-[10px] text-cyan-400 font-semibold">Workflows</div>
          </div>

          <div className="rounded-lg border border-[#202028] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Documents obligatoires</div>
            <div className="font-mono font-black text-white text-lg mt-1">18</div>
            <div className="text-[10px] text-amber-400 font-semibold">Règles</div>
          </div>

          <div className="rounded-lg border border-[#202028] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">TVA standard</div>
            <div className="font-mono font-black text-white text-lg mt-1">20%</div>
            <div className="text-[10px] text-zinc-400 font-semibold">Taux par défaut</div>
          </div>

          <div className="rounded-lg border border-[#202028] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Alertes actives</div>
            <div className="font-mono font-black text-white text-lg mt-1">7</div>
            <div className="text-[10px] text-orange-400 font-semibold">Seuils</div>
          </div>

          <div className="rounded-lg border border-[#202028] bg-[#16161c] p-3 text-center">
            <div className="text-[10px] text-zinc-400">Utilisateurs autorisés</div>
            <div className="font-mono font-black text-white text-lg mt-1">32</div>
            <div className="text-[10px] text-purple-400 font-semibold">Utilisateurs</div>
          </div>
        </div>

        <div className="pt-2 text-right text-[10px] text-zinc-500 font-mono">
          Dernière mise à jour : 30 Mai 2025 à 14:30 par Admin Maalal
        </div>
      </div>
    </div>
  )
}
