'use client'

import React from 'react'
import Link from 'next/link'
import {
  Car,
  Search,
  CalendarDays,
  BadgePercent,
  Bell,
  WifiOff,
  Wrench,
  ShieldAlert,
  FileQuestion,
  ServerCrash,
  Plus,
  RefreshCw,
} from 'lucide-react'
import clsx from 'clsx'

export type EmptyStateType =
  | 'vehicles'
  | 'search'
  | 'reservations'
  | 'sales'
  | 'notifications'
  | 'offline'
  | 'maintenance'
  | 'forbidden'
  | 'notfound'
  | 'serverError'
  | 'generic'

export interface EmptyStateProps {
  type?: EmptyStateType
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  type = 'generic',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  const getConfig = () => {
    switch (type) {
      case 'vehicles':
        return {
          icon: Car,
          defaultTitle: 'Aucun véhicule disponible',
          defaultDescription: 'Ajoutez votre premier véhicule au parc pour commencer à gérer votre stock.',
          defaultActionLabel: 'Ajouter un véhicule',
          defaultHref: '/vehicles/new',
          iconColor: 'text-red-500 bg-red-500/10 border-red-500/20',
        }
      case 'search':
        return {
          icon: Search,
          defaultTitle: 'Aucun résultat trouvé',
          defaultDescription: 'Aucun élément ne correspond à vos critères de recherche ou de filtrage.',
          defaultActionLabel: 'Effacer les filtres',
          iconColor: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20',
        }
      case 'reservations':
        return {
          icon: CalendarDays,
          defaultTitle: 'Aucune réservation en cours',
          defaultDescription: 'Vous n’avez aucune réservation active pour le moment.',
          defaultActionLabel: 'Nouvelle réservation',
          defaultHref: '/reservations/new',
          iconColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        }
      case 'sales':
        return {
          icon: BadgePercent,
          defaultTitle: 'Aucune vente enregistrée',
          defaultDescription: 'Aucune transaction de vente n’a encore été créée pour cette période.',
          defaultActionLabel: 'Nouvelle vente',
          defaultHref: '/sales/new',
          iconColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        }
      case 'notifications':
        return {
          icon: Bell,
          defaultTitle: 'Aucune notification',
          defaultDescription: 'Vous êtes à jour ! Aucune nouvelle alerte ou rappel pour le moment.',
          defaultActionLabel: 'Voir les alertes',
          defaultHref: '/notifications',
          iconColor: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
        }
      case 'offline':
        return {
          icon: WifiOff,
          defaultTitle: 'Pas de connexion Internet',
          defaultDescription: 'Vérifiez votre connexion réseau et réessayez.',
          defaultActionLabel: 'Réessayer',
          iconColor: 'text-red-500 bg-red-500/10 border-red-500/20',
        }
      case 'maintenance':
        return {
          icon: Wrench,
          defaultTitle: 'Maintenance en cours',
          defaultDescription: 'La plateforme est actuellement en maintenance technique. Merci de réessayer plus tard.',
          defaultActionLabel: 'Retour à l’accueil',
          defaultHref: '/',
          iconColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        }
      case 'forbidden':
        return {
          icon: ShieldAlert,
          defaultTitle: 'Accès refusé — 403',
          defaultDescription: 'Vous n’avez pas les permissions nécessaires pour accéder à cette page.',
          defaultActionLabel: 'Retour au tableau de bord',
          defaultHref: '/',
          iconColor: 'text-red-500 bg-red-500/10 border-red-500/20',
        }
      case 'notfound':
        return {
          icon: FileQuestion,
          defaultTitle: 'Page non trouvée — 404',
          defaultDescription: 'La page que vous recherchez n’existe pas ou a été déplacée.',
          defaultActionLabel: 'Retour à l’accueil',
          defaultHref: '/',
          iconColor: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20',
        }
      case 'serverError':
        return {
          icon: ServerCrash,
          defaultTitle: 'Erreur serveur — 500',
          defaultDescription: 'Une erreur interne s’est produite. Veuillez réessayer ultérieurement.',
          defaultActionLabel: 'Réessayer',
          iconColor: 'text-red-500 bg-red-500/10 border-red-500/20',
        }
      default:
        return {
          icon: FileQuestion,
          defaultTitle: 'Aucune donnée disponible',
          defaultDescription: 'Aucun enregistrement n’a été trouvé dans cette section.',
          defaultActionLabel: 'Rafraîchir',
          iconColor: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20',
        }
    }
  }

  const config = getConfig()
  const Icon = config.icon
  const finalTitle = title || config.defaultTitle
  const finalDescription = description || config.defaultDescription
  const finalActionLabel = actionLabel || config.defaultActionLabel
  const finalHref = actionHref || config.defaultHref

  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center rounded-2xl border border-[#222228] bg-[#121216] p-8 sm:p-12 text-center shadow-sm',
        className
      )}
    >
      <div className={clsx('flex h-16 w-16 items-center justify-center rounded-2xl border mb-4', config.iconColor)}>
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-white">{finalTitle}</h3>
      <p className="mt-1.5 max-w-md text-xs sm:text-sm text-zinc-400 leading-relaxed">
        {finalDescription}
      </p>

      {(finalHref || onAction) && (
        <div className="mt-6">
          {finalHref ? (
            <Link
              href={finalHref}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 text-xs font-bold text-white shadow-lg shadow-red-950/40 hover:from-red-500 hover:to-red-600 transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{finalActionLabel}</span>
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1c1c24] border border-[#2e2e38] px-4 text-xs font-semibold text-white hover:bg-[#242430] transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{finalActionLabel}</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
