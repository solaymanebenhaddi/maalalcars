import React from 'react'
import prisma from '@/lib/db'
import { PageHeader } from '@/components/shared/page-header'
import { SaleForm } from '@/components/sales/sale-form'
import { vehicleStateMachine } from '@/services/vehicle-state-machine.service'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{
    vehicleId?: string
    reservationId?: string
  }>
}

export default async function NewSalePage({ searchParams }: Props) {
  await vehicleStateMachine.expireDueReservations()
  const { vehicleId, reservationId } = await searchParams

  // Load available vehicles: IN_STOCK, or if vehicleId is passed, include that vehicle even if RESERVED
  const availableVehicles = await prisma.vehicle.findMany({
    where: {
      archivedAt: null,
      OR: [
        { status: 'IN_STOCK' },
        ...(vehicleId ? [{ id: vehicleId }] : []),
      ],
    },
    select: {
      id: true,
      code: true,
      brand: true,
      model: true,
      year: true,
      matricule: true,
      purchasePrice: true,
      targetSalePrice: true,
      status: true,
      purchases: {
        select: {
          commissionAmount: true,
        },
        take: 1,
      },
      repairs: {
        where: {
          status: { not: 'ANNULEE' },
        },
        select: {
          id: true,
          repairType: true,
          estimatedAmount: true,
          finalAmount: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Check if there is a reservation to convert
  let initialReservation = null
  if (reservationId) {
    initialReservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    })
  } else if (vehicleId) {
    initialReservation = await prisma.reservation.findFirst({
      where: { vehicleId, status: { in: ['ACTIVE', 'EXPIRING'] } },
      orderBy: { createdAt: 'desc' },
    })
  }

  // Load personnel list for commissioner payer tracking
  const personnelList = await prisma.user.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={initialReservation ? 'Conversion de Réservation en Vente' : 'Nouvelle Vente'}
        subtitle="Enregistrement du dossier de vente, de l'acheteur et de l'encaissement financier"
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Ventes', href: '/sales' },
          { label: 'Nouvelle Vente' },
        ]}
      />

      <SaleForm
        availableVehicles={availableVehicles}
        initialReservation={initialReservation}
        preselectedVehicleId={vehicleId}
        personnelList={personnelList}
      />
    </div>
  )
}
