import React from 'react'
import clsx from 'clsx'

export interface StatusBadgeProps {
  status: string
  className?: string
  dot?: boolean
}

export function StatusBadge({ status, className, dot = true }: StatusBadgeProps) {
  const normalized = (status || '').toUpperCase()

  const getStatusConfig = () => {
    switch (normalized) {
      // Stock & Véhicules
      case 'IN_STOCK':
      case 'EN STOCK':
        return {
          label: 'En stock',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dotBg: 'bg-emerald-400',
        }
      case 'RESERVED':
      case 'RÉSERVÉ':
      case 'RESERVE':
        return {
          label: 'Réservé',
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dotBg: 'bg-amber-400',
        }
      case 'SOLD':
      case 'VENDU':
        return {
          label: 'Vendu',
          bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
          dotBg: 'bg-cyan-400',
        }
      case 'WORKSHOP':
      case 'ATELIER':
        return {
          label: 'En atelier',
          bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          dotBg: 'bg-purple-400',
        }
      case 'ARCHIVED':
      case 'ARCHIVÉ':
        return {
          label: 'Archivé',
          bg: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30',
          dotBg: 'bg-zinc-400',
        }
      case 'EN_COURS':
        return {
          label: 'En cours',
          bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          dotBg: 'bg-purple-400',
        }
      case 'TERMINEE':
      case 'TERMINÉE':
        return {
          label: 'Terminée',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dotBg: 'bg-emerald-400',
        }
      case 'CONVERTIE_EN_VENTE':
      case 'CONVERTED':
        return {
          label: 'Convertie en vente',
          bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
          dotBg: 'bg-cyan-400',
        }

      // Paiements & Factures
      case 'PAID':
      case 'PAYÉ':
      case 'PAYEE':
        return {
          label: 'Payé',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dotBg: 'bg-emerald-400',
        }
      case 'PARTIAL':
      case 'PARTIELLEMENT PAYÉ':
        return {
          label: 'Partiel',
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dotBg: 'bg-amber-400',
        }
      case 'OVERDUE':
      case 'EN RETARD':
        return {
          label: 'En retard',
          bg: 'bg-red-500/10 text-red-400 border-red-500/30',
          dotBg: 'bg-red-400',
        }
      case 'PENDING':
      case 'EN ATTENTE':
        return {
          label: 'En attente',
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dotBg: 'bg-amber-400',
        }

      // Ventes & Opérations
      case 'CONFIRMED':
      case 'CONFIRMÉ':
      case 'CONFIRMEE':
        return {
          label: 'Confirmé',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dotBg: 'bg-emerald-400',
        }
      case 'DELIVERED':
      case 'LIVRÉ':
      case 'LIVREE':
        return {
          label: 'Livré',
          bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
          dotBg: 'bg-cyan-400',
        }
      case 'CANCELLED':
      case 'ANNULÉ':
      case 'ANNULEE':
        return {
          label: 'Annulé',
          bg: 'bg-red-500/10 text-red-400 border-red-500/30',
          dotBg: 'bg-red-400',
        }
      case 'DRAFT':
      case 'BROUILLON':
        return {
          label: 'Brouillon',
          bg: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30',
          dotBg: 'bg-zinc-400',
        }

      // Contacts & Relations
      case 'ACTIVE':
      case 'ACTIF':
        return {
          label: 'Actif',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dotBg: 'bg-emerald-400',
        }
      case 'INACTIVE':
      case 'INACTIF':
        return {
          label: 'Inactif',
          bg: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30',
          dotBg: 'bg-zinc-400',
        }

      // Validations & Contrôles
      case 'VALID':
      case 'VALIDE':
      case 'VALIDATED':
        return {
          label: 'Validé',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dotBg: 'bg-emerald-400',
        }
      case 'EXPIRING_SOON':
      case 'EXPIRE BIENTÔT':
        return {
          label: 'Expire bientôt',
          bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
          dotBg: 'bg-orange-400',
        }
      case 'EXPIRED':
      case 'EXPIRÉ':
        return {
          label: 'Expiré',
          bg: 'bg-red-500/10 text-red-400 border-red-500/30',
          dotBg: 'bg-red-400',
        }

      default:
        return {
          label: status,
          bg: 'bg-zinc-500/10 text-zinc-300 border-zinc-500/30',
          dotBg: 'bg-zinc-400',
        }
    }
  }

  const config = getStatusConfig()

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide',
        config.bg,
        className
      )}
    >
      {dot && <span className={clsx('h-1.5 w-1.5 rounded-full', config.dotBg)} />}
      <span>{config.label}</span>
    </span>
  )
}
