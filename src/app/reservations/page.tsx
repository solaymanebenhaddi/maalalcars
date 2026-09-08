import React from 'react'
import Link from 'next/link'
import {
  CalendarDays,
  Plus,
  Clock,
  Car,
  CheckCircle2,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/shared/stat-card'
import { StatusBadge } from '@/components/shared/status-badge'
import { Currency } from '@/components/shared/currency'
import { EmptyState } from '@/components/shared/empty-state'
import { ActionAlert } from '@/components/shared/action-alert'
import { operationsRepository } from '@/repositories/operations.repository'
import { vehicleStateMachine } from '@/services/vehicle-state-machine.service'
import { requireAuth } from '@/lib/session'

export const dynamic = 'force-dynamic'

interface ReservationsPageProps {
  searchParams?: Promise<{
    error?: string
    success?: string
    info?: string
  }>
}

export default async function ReservationsPage({ searchParams }: ReservationsPageProps) {
  await requireAuth()
  const { error, success, info } = (await searchParams) || {}
  await vehicleStateMachine.expireDueReservations()
  const reservations = await operationsRepository.getReservations()

  const totalDeposits = reservations.reduce((sum, r) => sum + r.depositAmount, 0)
  const activeCount = reservations.filter((r) => r.status === 'ACTIVE').length
  const expiringCount = reservations.filter((r) => r.status === 'EXPIRING').length
  const convertedCount = reservations.filter((r) => r.status === 'CONVERTED').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Réservations & Acomptes"
        subtitle="Gestion des véhicules réservés avec acomptes clients et dates d’échéance"
        breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'Réservations' }]}
        primaryAction={{
          label: 'Nouvelle Réservation',
          href: '/reservations/new',
          icon: Plus,
        }}
      />

      <ActionAlert
        error={error}
        success={success}
        info={info}
        dismissHref="/reservations"
      />

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Réservations Actives"
          value={activeCount}
          trend={{ value: `${reservations.length} au total`, direction: 'neutral', label: 'enregistrées' }}
          icon={CalendarDays}
          iconColor="amber"
        />

        <StatCard
          title="Total Acomptes Encaissés"
          value={<Currency amount={totalDeposits} />}
          trend={{ value: 'Trésorerie bloquée', direction: 'up', label: 'acomptes versés' }}
          icon={CheckCircle2}
          iconColor="green"
        />

        <StatCard
          title="Expirant Prochainement"
          value={expiringCount}
          trend={{ value: 'Sous 7 jours', direction: 'down', label: 'à relancer' }}
          icon={Clock}
          iconColor="red"
        />

        <StatCard
          title="Converties en Vente"
          value={convertedCount}
          trend={{ value: 'Taux de succès', direction: 'up', label: 'ventes finalisées' }}
          icon={Car}
          iconColor="cyan"
        />
      </div>

      {/* Reservations Table */}
      {reservations.length > 0 ? (
        <div className="rounded-2xl border border-[#222228] bg-[#121216] p-5 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#222228] text-[11px] font-semibold text-zinc-400">
                  <th className="pb-3">Réf.</th>
                  <th className="pb-3">Véhicule</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Date Réservation</th>
                  <th className="pb-3">Date Expiration</th>
                  <th className="pb-3 text-right">Acompte Versé</th>
                  <th className="pb-3 text-center">Statut</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24]">
                {reservations.map((res) => (
                  <tr key={res.id} className="hover:bg-[#18181f] transition-colors">
                    <td className="py-3.5 font-mono font-semibold text-white">{res.code}</td>
                    <td className="py-3.5 font-medium text-zinc-200">
                      <Link href={`/vehicles/${res.vehicleId}`} className="hover:text-red-400">
                        {res.vehicle?.brand} {res.vehicle?.model} ({res.vehicle?.year})
                      </Link>
                    </td>
                    <td className="py-3.5 text-zinc-300">
                      <span className="font-semibold text-white">
                        {res.clientName || (res.contact ? `${res.contact.firstName} ${res.contact.lastName}` : 'Client')}
                      </span>
                      <span className="block text-[10px] text-zinc-400 font-mono">
                        {res.clientPhone || res.contact?.phone || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3.5 text-zinc-400">{new Date(res.startDate).toLocaleDateString('fr-MA')}</td>
                    <td className="py-3.5 text-amber-400 font-semibold">{new Date(res.expiryDate).toLocaleDateString('fr-MA')}</td>
                    <td className="py-3.5 text-right font-mono">
                      <span className="font-bold text-emerald-400">
                        <Currency amount={res.depositAmount} />
                      </span>
                      {res.salespersonName && (
                        <span className="block text-[10px] text-zinc-400 font-sans">
                          Reçu par : <strong className="text-cyan-400">{res.salespersonName}</strong>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-center">
                      <StatusBadge status={res.status} />
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {res.status === 'ACTIVE' && (
                          <Link
                            href={`/sales/new?vehicleId=${res.vehicleId}&reservationId=${res.id}`}
                            className="rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-500 transition-colors shadow-sm"
                          >
                            Convertir
                          </Link>
                        )}
                        <Link
                          href={`/vehicles/${res.vehicleId}?tab=reservations`}
                          className="rounded-md bg-[#1c1c24] px-2.5 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-[#282834] hover:text-white transition-colors"
                        >
                          Fiche
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          type="reservations"
          actionHref="/reservations/new"
        />
      )}
    </div>
  )
}
