import React from 'react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import prisma from '@/lib/db'
import { PageHeader } from '@/components/shared/page-header'
import { StatusBadge } from '@/components/shared/status-badge'
import { Currency } from '@/components/shared/currency'
import { Car, CheckCircle2, User, XCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

async function convertToSaleAction(formData: FormData) {
  'use server'
  const reservationId = formData.get('reservationId') as string
  const res = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { vehicle: true },
  })

  if (!res) return

  // Redirect to sale creation with prefilled params
  redirect(`/sales/new?vehicleId=${res.vehicleId}&buyerId=${res.contactId}&deposit=${res.depositAmount}&reservationId=${res.id}`)
}

async function cancelReservationAction(formData: FormData) {
  'use server'
  const reservationId = formData.get('reservationId') as string
  const res = await prisma.reservation.findUnique({ where: { id: reservationId } })
  if (!res) return

  await prisma.reservation.update({
    where: { id: reservationId },
    data: { status: 'CANCELLED' },
  })

  await prisma.vehicle.update({
    where: { id: res.vehicleId },
    data: { status: 'IN_STOCK' },
  })

  redirect('/reservations')
}

export default async function ReservationDetailPage({ params }: Props) {
  const { id } = await params
  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: {
      vehicle: true,
      contact: true,
    },
  })

  if (!reservation) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={`Réservation ${reservation.code}`}
        subtitle={`Véhicule : ${reservation.vehicle?.brand} ${reservation.vehicle?.model} (${reservation.vehicle?.year})`}
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Réservations', href: '/reservations' },
          { label: reservation.code },
        ]}
        actions={<StatusBadge status={reservation.status} />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4">
          <span className="text-xs font-semibold text-zinc-400 block uppercase">Acompte Versé</span>
          <Currency amount={reservation.depositAmount} className="text-xl text-emerald-400 font-bold" />
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4">
          <span className="text-xs font-semibold text-zinc-400 block uppercase">Acompte Encaissé Par</span>
          <span className="text-base font-bold text-cyan-400 block mt-1 flex items-center gap-1.5">
            <User className="h-4 w-4 text-cyan-400" />
            <span>{reservation.salespersonName || 'Non spécifié'}</span>
          </span>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4">
          <span className="text-xs font-semibold text-zinc-400 block uppercase">Date Réservation</span>
          <span className="text-base font-bold text-white block mt-1">
            {new Date(reservation.startDate).toLocaleDateString('fr-MA')}
          </span>
        </div>

        <div className="rounded-xl border border-[#222228] bg-[#121216] p-4">
          <span className="text-xs font-semibold text-zinc-400 block uppercase">Date d’Expiration</span>
          <span className="text-base font-bold text-amber-400 block mt-1">
            {new Date(reservation.expiryDate).toLocaleDateString('fr-MA')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vehicle Information */}
        <div className="rounded-2xl border border-[#222228] bg-[#121216] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#222228] pb-3">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-red-500" />
              <h3 className="text-sm font-bold text-white">Véhicule Réservé</h3>
            </div>
            <Link
              href={`/vehicles/${reservation.vehicle?.id}`}
              className="text-xs text-red-400 hover:text-red-300 font-semibold"
            >
              Fiche complète
            </Link>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">Marque & Modèle:</span>
              <span className="font-bold text-white">{reservation.vehicle?.brand} {reservation.vehicle?.model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Année:</span>
              <span className="text-zinc-200">{reservation.vehicle?.year}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Matricule:</span>
              <span className="text-zinc-200 font-mono">{reservation.vehicle?.matricule || 'En cours'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Prix Cible:</span>
              <Currency amount={reservation.vehicle?.targetSalePrice} className="text-cyan-400" />
            </div>
          </div>
        </div>

        {/* Client Details */}
        <div className="rounded-2xl border border-[#222228] bg-[#121216] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#222228] pb-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Client Bénéficiaire</h3>
            </div>
            <Link
              href={`/contacts/${reservation.contact?.id}`}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Fiche client
            </Link>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">Nom & Prénom:</span>
              <span className="font-bold text-white">{reservation.contact?.firstName} {reservation.contact?.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Téléphone:</span>
              <span className="text-zinc-200 font-mono">{reservation.contact?.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">CIN:</span>
              <span className="text-zinc-200 font-mono">{reservation.contact?.cin || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Ville:</span>
              <span className="text-zinc-200">{reservation.contact?.city}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Decision Ribbon */}
      {reservation.status === 'ACTIVE' && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-emerald-400">Finaliser la Transaction</h4>
            <p className="text-xs text-zinc-300">Convertir cette réservation en Bon de Vente et déduire l’acompte du solde.</p>
          </div>

          <div className="flex items-center gap-3">
            <form action={cancelReservationAction}>
              <input type="hidden" name="reservationId" value={reservation.id} />
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20"
              >
                <XCircle className="h-4 w-4" />
                <span>Annuler la réservation</span>
              </button>
            </form>

            <form action={convertToSaleAction}>
              <input type="hidden" name="reservationId" value={reservation.id} />
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-950/40"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Convertir en Vente</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
