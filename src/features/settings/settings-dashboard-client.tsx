'use client'

import React from 'react'
import Link from 'next/link'
import {
  Building2,
  Car,
  FileText,
  CreditCard,
  Bell,
  MapPin,
  Settings2,
  Share2,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react'

interface SettingCard {
  id: string
  title: string
  desc: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
}

const SETTINGS_CARDS: SettingCard[] = [
  {
    id: 'company',
    title: 'Entreprise',
    desc: 'Informations générales, coordonnées, identité visuelle et documents officiels.',
    href: '/settings/company',
    icon: Building2,
    iconColor: 'text-red-500 bg-red-500/10 border-red-500/20',
  },
  {
    id: 'vehicles',
    title: 'Véhicules',
    desc: 'Catégories, marques, modèles, options et paramètres liés aux véhicules.',
    href: '/settings/vehicles',
    icon: Car,
    iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  },
  {
    id: 'invoices',
    title: 'Factures',
    desc: 'Préférences de facturation, numérotation, TVA et conditions de paiement.',
    href: '/settings/invoices',
    icon: FileText,
    iconColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  },
  {
    id: 'payments',
    title: 'Méthodes de paiement',
    desc: 'Moyens de paiement acceptés, frais et paramètres des transactions.',
    href: '/settings/payments',
    icon: CreditCard,
    iconColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    desc: "Préférences de notifications, canaux d'envoi et alertes personnalisées.",
    href: '/notifications',
    icon: Bell,
    iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  {
    id: 'branches',
    title: 'Locations / Succursales',
    desc: 'Succursales, agences et paramètres de gestion multi-sites.',
    href: '/settings/payments',
    icon: MapPin,
    iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  },
  {
    id: 'general',
    title: 'Préférences générales',
    desc: 'Langue, fuseau horaire, devises, thème et autres préférences système.',
    href: '/settings/profile',
    icon: Settings2,
    iconColor: 'text-red-500 bg-red-500/10 border-red-500/20',
  },
  {
    id: 'integrations',
    title: 'Intégrations',
    desc: 'Connectez votre plateforme à des outils tiers et services externes.',
    href: '/settings/integrations',
    icon: Share2,
    iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    id: 'features',
    title: 'Modules & Feature Flags',
    desc: 'Activer ou désactiver les modules de l\'application (périmètre MVP & extensions futures).',
    href: '/settings/features',
    icon: ShieldCheck,
    iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
]

export function SettingsDashboardClient() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs text-white">
      {/* Top Header matching Reference #29 Screen 1 */}
      <div>
        <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
          Paramètres
        </h1>
        <p className="text-xs text-zinc-400">
          Gérez et personnalisez l&apos;ensemble de votre plateforme MAALAL CARS.
        </p>
      </div>

      {/* 9 Configuration Cards 3x3 Grid matching Reference #29 Screen 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SETTINGS_CARDS.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.id}
              href={card.href}
              className="group rounded-xl border border-[#222228] bg-[#121216] p-5 shadow-sm hover:border-zinc-500 hover:bg-[#15151b] transition-all flex flex-col justify-between h-[180px]"
            >
              <div className="flex items-start justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${card.iconColor}`}>
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

              <div className="flex items-center gap-1 text-[10px] font-bold text-red-400 group-hover:text-red-300 pt-1 border-t border-[#1e1e24]">
                <span>Configurer</span>
                <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
