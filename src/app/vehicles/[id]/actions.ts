'use server'

import { redirect } from 'next/navigation'
import { repairService } from '@/services/repair.service'
import { reservationService } from '@/services/reservation.service'
import prisma from '@/lib/db'

export async function createRepairAction(vehicleId: string, formData: FormData) {
  const repairType = (formData.get('repairType') as string) || 'MECANIQUE'
  const garageName = (formData.get('garageName') as string) || ''
  const estimatedAmount = parseFloat(formData.get('estimatedAmount') as string) || null
  const description = (formData.get('description') as string) || ''

  await repairService.createRepair({
    vehicleId,
    repairType,
    startedAt: new Date(),
    garageName: garageName || null,
    estimatedAmount,
    description: description || null,
  })

  redirect(`/vehicles/${vehicleId}?tab=repairs`)
}

export async function completeRepairAction(vehicleId: string, formData: FormData) {
  const repairId = formData.get('repairId') as string
  const finalAmount = parseFloat(formData.get('finalAmount') as string) || 0
  const paidById = (formData.get('paidById') as string) || undefined
  const notes = (formData.get('notes') as string) || ''

  await repairService.completeRepair(repairId, {
    finalAmount,
    paidById: paidById || undefined,
    completedAt: new Date(),
    notes: notes || undefined,
  })

  redirect(`/vehicles/${vehicleId}?tab=repairs`)
}

export async function updateTargetPriceAction(vehicleId: string, formData: FormData) {
  const targetSalePrice = parseFloat(formData.get('targetSalePrice') as string)
  if (targetSalePrice && targetSalePrice > 0) {
    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { targetSalePrice },
    })
  }
  redirect(`/vehicles/${vehicleId}?tab=overview`)
}

export async function cancelRepairAction(vehicleId: string, formData: FormData) {
  const repairId = formData.get('repairId') as string
  await repairService.cancelRepair(repairId)
  redirect(`/vehicles/${vehicleId}?tab=repairs`)
}

export async function createReservationAction(vehicleId: string, formData: FormData) {
  const clientName = formData.get('clientName') as string
  const clientPhone = formData.get('clientPhone') as string
  const clientCin = (formData.get('clientCin') as string) || null
  const depositAmount = parseFloat(formData.get('depositAmount') as string) || 0
  const paymentMethod = (formData.get('paymentMethod') as string) || 'ESPECES'
  const expiryDays = parseInt(formData.get('expiryDays') as string, 10) || 7

  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + expiryDays)

  await reservationService.createReservation({
    vehicleId,
    clientName,
    clientPhone,
    clientCin,
    depositAmount,
    paymentMethod,
    startDate: new Date(),
    expiryDate,
    status: 'ACTIVE',
  })

  redirect(`/vehicles/${vehicleId}?tab=reservations`)
}

export async function cancelReservationAction(vehicleId: string, formData: FormData) {
  const reservationId = formData.get('reservationId') as string
  await reservationService.cancelReservation(reservationId)
  redirect(`/vehicles/${vehicleId}?tab=reservations`)
}

export async function addPhotoAction(vehicleId: string, formData: FormData) {
  const url = formData.get('url') as string
  if (url) {
    await prisma.vehiclePhoto.create({
      data: {
        url,
        vehicleId,
        isPrimary: false,
        category: 'EXTERIEUR',
      },
    })
  }

  redirect(`/vehicles/${vehicleId}?tab=documents`)
}

export async function updatePurchaseCommissionerAction(vehicleId: string, formData: FormData) {
  const purchaseId = formData.get('purchaseId') as string
  const commissionerName = (formData.get('commissionerName') as string) || null
  const commissionerPhone = (formData.get('commissionerPhone') as string) || null
  const commissionerCin = (formData.get('commissionerCin') as string) || null
  const commissionerAddress = (formData.get('commissionerAddress') as string) || null
  const commissionAmount = parseFloat(formData.get('commissionAmount') as string) || 0
  const commissionPaidById = (formData.get('commissionPaidById') as string) || null

  if (purchaseId) {
    await prisma.purchase.update({
      where: { id: purchaseId },
      data: {
        commissionerName,
        commissionerPhone,
        commissionerCin,
        commissionerAddress,
        commissionAmount,
        commissionPaidById: commissionPaidById || null,
      },
    })
  }

  redirect(`/vehicles/${vehicleId}?tab=acquisition`)
}

export async function updateSaleCommissionerAction(vehicleId: string, formData: FormData) {
  const saleId = formData.get('saleId') as string
  const commissionerName = (formData.get('commissionerName') as string) || null
  const commissionerPhone = (formData.get('commissionerPhone') as string) || null
  const commissionerCin = (formData.get('commissionerCin') as string) || null
  const commissionerAddress = (formData.get('commissionerAddress') as string) || null
  const commissionAmount = parseFloat(formData.get('commissionAmount') as string) || 0
  const commissionPaidById = (formData.get('commissionPaidById') as string) || null

  if (saleId) {
    await prisma.sale.update({
      where: { id: saleId },
      data: {
        commissionerName,
        commissionerPhone,
        commissionerCin,
        commissionerAddress,
        commissionAmount,
        commissionPaidById: commissionPaidById || null,
      },
    })
  }

  redirect(`/vehicles/${vehicleId}?tab=sale`)
}

