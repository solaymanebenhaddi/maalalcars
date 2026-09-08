'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
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
  const salespersonName = (formData.get('salespersonName') as string) || null

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
    salespersonName,
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
    const count = await prisma.vehiclePhoto.count({ where: { vehicleId } })
    if (count < 10) {
      const hasPrimary = await prisma.vehiclePhoto.findFirst({ where: { vehicleId, isPrimary: true } })
      await prisma.vehiclePhoto.create({
        data: {
          url,
          vehicleId,
          isPrimary: !hasPrimary,
          category: 'EXTERIEUR',
          order: count,
        },
      })
    }
  }

  redirect(`/vehicles/${vehicleId}?tab=documents`)
}

export async function addVehiclePhotosAction(
  vehicleId: string,
  photos: Array<{ url: string; isPrimary?: boolean }>
) {
  const currentCount = await prisma.vehiclePhoto.count({ where: { vehicleId } })
  const availableSlots = Math.max(0, 10 - currentCount)
  if (availableSlots <= 0) {
    throw new Error('Limite maximale de 10 photos déjà atteinte pour ce véhicule.')
  }

  const photosToAdd = photos.slice(0, availableSlots)
  const hasPrimary = await prisma.vehiclePhoto.findFirst({ where: { vehicleId, isPrimary: true } })

  for (let i = 0; i < photosToAdd.length; i++) {
    const p = photosToAdd[i]
    await prisma.vehiclePhoto.create({
      data: {
        vehicleId,
        url: p.url,
        isPrimary: !hasPrimary && i === 0,
        order: currentCount + i,
        category: 'EXTERIEUR',
      },
    })
  }

  revalidatePath(`/vehicles/${vehicleId}`)
}

export async function syncVehiclePhotosAction(
  vehicleId: string,
  photos: Array<{ id?: string; url: string; isPrimary?: boolean }>
) {
  const newPhotos = photos.filter((p) => !p.id)
  if (newPhotos.length > 0) {
    await addVehiclePhotosAction(vehicleId, newPhotos)
  }
}

export async function deleteVehiclePhotoAction(photoId: string, url?: string) {
  const photo = await prisma.vehiclePhoto.findUnique({ where: { id: photoId } })
  if (!photo) return

  const vehicleId = photo.vehicleId

  await prisma.vehiclePhoto.delete({ where: { id: photoId } })

  // If deleted photo was primary, promote next photo
  if (photo.isPrimary) {
    const nextPhoto = await prisma.vehiclePhoto.findFirst({
      where: { vehicleId },
      orderBy: { order: 'asc' },
    })
    if (nextPhoto) {
      await prisma.vehiclePhoto.update({
        where: { id: nextPhoto.id },
        data: { isPrimary: true },
      })
    }
  }

  // Attempt to delete file from storage
  if (url && url.startsWith('/api/storage/')) {
    try {
      const relativePath = url.replace('/api/storage/', '')
      const { deleteFile } = await import('@/lib/storage')
      await deleteFile(relativePath)
    } catch (_) {}
  }

  revalidatePath(`/vehicles/${vehicleId}`)
}

export async function setPrimaryVehiclePhotoAction(photoId: string) {
  const target = await prisma.vehiclePhoto.findUnique({ where: { id: photoId } })
  if (!target) return

  await prisma.vehiclePhoto.updateMany({
    where: { vehicleId: target.vehicleId, isPrimary: true },
    data: { isPrimary: false },
  })

  await prisma.vehiclePhoto.update({
    where: { id: photoId },
    data: { isPrimary: true },
  })

  revalidatePath(`/vehicles/${target.vehicleId}`)
}

export async function updatePurchaseCommissionerAction(vehicleId: string, formData: FormData) {
  const purchaseId = formData.get('purchaseId') as string
  const commissionerName = (formData.get('commissionerName') as string) || null
  const commissionerPhone = (formData.get('commissionerPhone') as string) || null
  const commissionerCin = (formData.get('commissionerCin') as string) || null
  const commissionerAddress = (formData.get('commissionerAddress') as string) || null
  const commissionAmount = parseFloat(formData.get('commissionAmount') as string) || 0
  const commissionPaidById = (formData.get('commissionPaidById') as string) || null
  const handledById = (formData.get('handledById') as string) || null

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
        ...(handledById !== null ? { handledById: handledById || null } : {}),
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

