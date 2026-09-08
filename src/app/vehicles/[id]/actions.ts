'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { repairService } from '@/services/repair.service'
import { reservationService } from '@/services/reservation.service'
import prisma from '@/lib/db'

function isRedirectError(error: unknown) {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'digest' in error &&
      typeof (error as { digest?: unknown }).digest === 'string' &&
      ((error as { digest: string }).digest.startsWith('NEXT_REDIRECT') ||
        (error as { digest: string }).digest.startsWith('NEXT_NOT_FOUND'))
  )
}

export async function createRepairAction(vehicleId: string, formData: FormData) {
  try {
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

    redirect(`/vehicles/${vehicleId}?tab=repairs&success=${encodeURIComponent('Intervention atelier enregistrée avec succès.')}`)
  } catch (error: unknown) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : 'Erreur lors de la création de la réparation.'
    redirect(`/vehicles/${vehicleId}?tab=repairs&error=${encodeURIComponent(message)}`)
  }
}

export async function completeRepairAction(vehicleId: string, formData: FormData) {
  try {
    const repairId = (formData.get('repairId') as string) || ''
    const finalAmount = parseFloat(formData.get('finalAmount') as string) || 0
    const paidById = (formData.get('paidById') as string) || undefined
    const notes = (formData.get('notes') as string) || ''

    if (!repairId) {
      redirect(`/vehicles/${vehicleId}?tab=repairs&error=${encodeURIComponent('Identifiant d\'intervention manquant.')}`)
    }

    await repairService.completeRepair(repairId, {
      finalAmount,
      paidById: paidById || undefined,
      completedAt: new Date(),
      notes: notes || undefined,
    })

    redirect(`/vehicles/${vehicleId}?tab=repairs&success=${encodeURIComponent('Intervention clôturée et montant imputé au coût de revient du véhicule.')}`)
  } catch (error: unknown) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : 'Erreur lors de la finalisation de l\'intervention.'
    redirect(`/vehicles/${vehicleId}?tab=repairs&error=${encodeURIComponent(message)}`)
  }
}

export async function updateTargetPriceAction(vehicleId: string, formData: FormData) {
  try {
    const targetSalePrice = parseFloat(formData.get('targetSalePrice') as string)
    if (targetSalePrice && targetSalePrice > 0) {
      await prisma.vehicle.update({
        where: { id: vehicleId },
        data: { targetSalePrice },
      })
    }
    redirect(`/vehicles/${vehicleId}?tab=overview&success=${encodeURIComponent('Prix de vente souhaité actualisé avec succès.')}`)
  } catch (error: unknown) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : 'Erreur lors de la modification du prix.'
    redirect(`/vehicles/${vehicleId}?tab=overview&error=${encodeURIComponent(message)}`)
  }
}

export async function cancelRepairAction(vehicleId: string, formData: FormData) {
  try {
    const repairId = (formData.get('repairId') as string) || ''
    if (!repairId) {
      redirect(`/vehicles/${vehicleId}?tab=repairs&error=${encodeURIComponent('Identifiant d\'intervention manquant.')}`)
    }
    await repairService.cancelRepair(repairId)
    redirect(`/vehicles/${vehicleId}?tab=repairs&success=${encodeURIComponent('Intervention atelier annulée.')}`)
  } catch (error: unknown) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : 'Erreur lors de l\'annulation de la réparation.'
    redirect(`/vehicles/${vehicleId}?tab=repairs&error=${encodeURIComponent(message)}`)
  }
}

export async function createReservationAction(vehicleId: string, formData: FormData) {
  try {
    const clientName = (formData.get('clientName') as string) || ''
    const clientPhone = (formData.get('clientPhone') as string) || ''
    const clientCin = (formData.get('clientCin') as string) || null
    const depositAmount = parseFloat(formData.get('depositAmount') as string) || 0
    const paymentMethod = (formData.get('paymentMethod') as string) || 'ESPECES'
    const expiryDays = parseInt(formData.get('expiryDays') as string, 10) || 7
    const salespersonName = (formData.get('salespersonName') as string) || null

    if (!clientName.trim()) {
      redirect(`/vehicles/${vehicleId}?tab=reservations&error=${encodeURIComponent('Le nom du client est obligatoire pour bloquer le véhicule.')}`)
    }

    if (!salespersonName) {
      redirect(`/vehicles/${vehicleId}?tab=reservations&error=${encodeURIComponent('Veuillez désigner le collaborateur ayant encaissé l\'acompte.')}`)
    }

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

    redirect(`/vehicles/${vehicleId}?tab=reservations&success=${encodeURIComponent('Réservation confirmée avec succès. Le véhicule est bloqué.')}`)
  } catch (error: unknown) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : 'Impossible de créer la réservation.'
    redirect(`/vehicles/${vehicleId}?tab=reservations&error=${encodeURIComponent(message)}`)
  }
}

export async function cancelReservationAction(vehicleId: string, formData: FormData) {
  try {
    const reservationId = (formData.get('reservationId') as string) || ''
    if (!reservationId) {
      redirect(
        `/vehicles/${vehicleId}?tab=reservations&error=${encodeURIComponent(
          'Identifiant de réservation manquant.'
        )}`
      )
    }

    const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } })
    if (!reservation) {
      redirect(
        `/vehicles/${vehicleId}?tab=reservations&error=${encodeURIComponent(
          'Cette réservation est introuvable ou a déjà été supprimée de la base de données.'
        )}`
      )
    }

    if (reservation.status === 'CANCELLED' || reservation.status === 'ANNULEE') {
      redirect(
        `/vehicles/${vehicleId}?tab=reservations&info=${encodeURIComponent(
          'Cette réservation a déjà été annulée précédemment. Le véhicule est disponible en stock.'
        )}`
      )
    }

    if (reservation.status === 'CONVERTED' || reservation.status === 'CONVERTIE_EN_VENTE') {
      redirect(
        `/vehicles/${vehicleId}?tab=reservations&error=${encodeURIComponent(
          'Impossible d\'annuler une réservation ayant déjà fait l\'objet d\'une vente finalisée.'
        )}`
      )
    }

    await reservationService.cancelReservation(reservationId)
    redirect(
      `/vehicles/${vehicleId}?tab=reservations&success=${encodeURIComponent(
        'La réservation a été annulée avec succès et le véhicule est de nouveau disponible en stock.'
      )}`
    )
  } catch (error: unknown) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : 'Une erreur inattendue est survenue lors de l\'annulation.'
    redirect(`/vehicles/${vehicleId}?tab=reservations&error=${encodeURIComponent(message)}`)
  }
}

export async function addPhotoAction(vehicleId: string, formData: FormData) {
  try {
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
    redirect(`/vehicles/${vehicleId}?tab=documents&success=${encodeURIComponent('Photo ajoutée avec succès.')}`)
  } catch (error: unknown) {
    if (isRedirectError(error)) throw error
    redirect(`/vehicles/${vehicleId}?tab=documents&error=${encodeURIComponent('Erreur lors de l\'ajout de la photo.')}`)
  }
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
  try {
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

    redirect(`/vehicles/${vehicleId}?tab=acquisition&success=${encodeURIComponent('Dossier d\'achat et commissionnaire enregistrés.')}`)
  } catch (error: unknown) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : 'Erreur lors de la mise à jour.'
    redirect(`/vehicles/${vehicleId}?tab=acquisition&error=${encodeURIComponent(message)}`)
  }
}

export async function updateSaleCommissionerAction(vehicleId: string, formData: FormData) {
  try {
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

    redirect(`/vehicles/${vehicleId}?tab=sale&success=${encodeURIComponent('Informations du commissionnaire enregistrées.')}`)
  } catch (error: unknown) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : 'Erreur lors de la mise à jour.'
    redirect(`/vehicles/${vehicleId}?tab=sale&error=${encodeURIComponent(message)}`)
  }
}
