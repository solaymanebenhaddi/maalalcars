'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { repairService } from '@/services/repair.service'
import { reservationService } from '@/services/reservation.service'
import { vehicleService } from '@/services/vehicle.service'
import { vehicleFuelTypes, vehicleTransmissions, vehicleBodyTypes } from '@/validation/vehicle.schema'
import prisma from '@/lib/db'

type FuelType = (typeof vehicleFuelTypes)[number]
type TransmissionType = (typeof vehicleTransmissions)[number]
type BodyType = (typeof vehicleBodyTypes)[number]

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

  revalidatePath('/vehicles')
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

  revalidatePath('/vehicles')
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

  revalidatePath('/vehicles')
  revalidatePath(`/vehicles/${target.vehicleId}`)
}

export async function updatePurchaseCommissionerAction(vehicleId: string, formData: FormData) {
  try {
    const purchaseId = formData.get('purchaseId') as string
    const commissionerName = (formData.get('commissionerName') as string) || null
    const commissionerPhone = (formData.get('commissionerPhone') as string) || null
    const commissionerCin = (formData.get('commissionerCin') as string) || null
    const commissionerAddress = (formData.get('commissionerAddress') as string) || null
    const commissionerCity = (formData.get('commissionerCity') as string) || null
    const commissionAmount = parseFloat(formData.get('commissionAmount') as string) || 0
    const commissionPaidById = (formData.get('commissionPaidById') as string) || null
    const handledById = (formData.get('handledById') as string) || null

    if (purchaseId) {
      const currentPurchase = await prisma.purchase.findUnique({ where: { id: purchaseId } })
      const oldCommission = currentPurchase?.commissionAmount || 0
      const delta = commissionAmount - oldCommission

      await prisma.purchase.update({
        where: { id: purchaseId },
        data: {
          commissionerName,
          commissionerPhone,
          commissionerCin,
          commissionerAddress,
          commissionerCity: commissionerCity || 'Casablanca',
          commissionAmount,
          commissionPaidById: commissionPaidById || null,
          ...(handledById !== null ? { handledById: handledById || null } : {}),
        },
      })

      if (delta !== 0) {
        await prisma.vehicle.update({
          where: { id: vehicleId },
          data: { targetSalePrice: { increment: delta } },
        })
      }
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
    const commissionerCity = (formData.get('commissionerCity') as string) || null
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
          commissionerCity: commissionerCity || 'Casablanca',
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

export async function completeAcquisitionDossierAction(vehicleId: string, formData: FormData) {
  try {
    const supplierName = (formData.get('supplierName') as string) || ''
    const supplierPhone = (formData.get('supplierPhone') as string) || null
    const supplierCin = (formData.get('supplierCin') as string) || null
    const supplierAddress = (formData.get('supplierAddress') as string) || null
    const supplierCity = (formData.get('supplierCity') as string) || null
    const handledById = (formData.get('handledById') as string) || null
    const paymentMethod = (formData.get('paymentMethod') as string) || 'VIREMENT'

    const commissionerOption = (formData.get('commissionerOption') as string) || 'NONE'
    const isWithComm = commissionerOption === 'WITH_COMMISSIONER'
    const commissionerName = isWithComm ? ((formData.get('commissionerName') as string) || null) : 'SANS'
    const commissionerPhone = isWithComm ? ((formData.get('commissionerPhone') as string) || null) : null
    const commissionerCin = isWithComm ? ((formData.get('commissionerCin') as string) || null) : null
    const commissionerAddress = isWithComm ? ((formData.get('commissionerAddress') as string) || null) : null
    const commissionerCity = isWithComm ? ((formData.get('commissionerCity') as string) || null) : null
    const commissionAmount = isWithComm ? (parseFloat(formData.get('commissionAmount') as string) || 0) : 0
    const commissionPaidById = isWithComm ? ((formData.get('commissionPaidById') as string) || null) : null

    // Find existing purchase or create one
    let purchase = await prisma.purchase.findFirst({
      where: { vehicleId },
    })

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    })

    if (!vehicle) {
      throw new Error('Véhicule introuvable.')
    }

    // Check if vehicle def- fields are being updated with real data
    const newVin = formData.get('vin') ? (formData.get('vin') as string).trim().toUpperCase() : null
    const newBrand = formData.get('brand') ? (formData.get('brand') as string).trim() : null
    const newModel = formData.get('model') ? (formData.get('model') as string).trim() : null
    const newColor = formData.get('colorExterior') ? (formData.get('colorExterior') as string).trim() : null
    const newMileageRaw = formData.get('mileage') as string | null
    const newMileage = newMileageRaw !== null && newMileageRaw !== '' ? parseInt(newMileageRaw, 10) : null
    const newPurchasePriceRaw = formData.get('purchasePrice') as string | null
    const newPurchasePrice =
      newPurchasePriceRaw !== null && newPurchasePriceRaw !== '' ? parseFloat(newPurchasePriceRaw) : null

    // Parse options to update missingFields
    let parsedOptions: { isBulkImport?: boolean; missingFields?: string[]; [key: string]: unknown } = {}
    if (typeof vehicle.options === 'string') {
      try {
        parsedOptions = JSON.parse(vehicle.options)
      } catch {
        parsedOptions = {}
      }
    }
    const currentMissing = Array.isArray(parsedOptions.missingFields) ? [...parsedOptions.missingFields] : []

    const vehicleUpdateData: Record<string, unknown> = {}

    if (newVin && newVin !== vehicle.vin && !newVin.startsWith('def-')) {
      if (newVin.length !== 17) {
        throw new Error('Le code VIN doit comporter exactement 17 caractères.')
      }
      const existingVin = await prisma.vehicle.findFirst({
        where: { vin: newVin, id: { not: vehicleId } },
      })
      if (existingVin) {
        throw new Error(`Le code VIN "${newVin}" est déjà attribué à un autre véhicule.`)
      }
      vehicleUpdateData.vin = newVin
      const idx = currentMissing.indexOf('vin')
      if (idx !== -1) currentMissing.splice(idx, 1)
    }

    if (newBrand && newBrand !== 'def-Marque' && !newBrand.startsWith('def-')) {
      vehicleUpdateData.brand = newBrand
      const idx = currentMissing.indexOf('brand')
      if (idx !== -1) currentMissing.splice(idx, 1)
    }

    if (newModel && newModel !== 'def-Modèle' && !newModel.startsWith('def-')) {
      vehicleUpdateData.model = newModel
      const idx = currentMissing.indexOf('model')
      if (idx !== -1) currentMissing.splice(idx, 1)
    }

    if (newColor && newColor !== 'def-Couleur' && !newColor.startsWith('def-')) {
      vehicleUpdateData.colorExterior = newColor
      const idx = currentMissing.indexOf('colorExterior')
      if (idx !== -1) currentMissing.splice(idx, 1)
    }

    if (newMileage !== null && !isNaN(newMileage) && newMileage >= 0) {
      vehicleUpdateData.mileage = newMileage
      const idx = currentMissing.indexOf('mileage')
      if (idx !== -1) currentMissing.splice(idx, 1)
    }

    if (newPurchasePrice !== null && !isNaN(newPurchasePrice) && newPurchasePrice > 0) {
      vehicleUpdateData.purchasePrice = newPurchasePrice
      const idx = currentMissing.indexOf('purchasePrice')
      if (idx !== -1) currentMissing.splice(idx, 1)
    }

    parsedOptions.missingFields = currentMissing
    vehicleUpdateData.options = JSON.stringify(parsedOptions)

    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: vehicleUpdateData,
    })

    const currentYear = new Date().getFullYear()

    if (!purchase) {
      const purchaseCount = await prisma.purchase.count()
      const purchaseCode = `ACH-${currentYear}-${String(purchaseCount + 1).padStart(4, '0')}`
      purchase = await prisma.purchase.create({
        data: {
          code: purchaseCode,
          vehicleId,
          purchasePrice: (newPurchasePrice && newPurchasePrice > 0) ? newPurchasePrice : vehicle.purchasePrice,
          supplierName: supplierName.trim() || null,
          supplierPhone,
          supplierCin,
          supplierAddress,
          supplierCity: supplierCity || 'Casablanca',
          handledById: handledById || null,
          paymentMethod,
          hasCommissioner: isWithComm,
          commissionerName,
          commissionerPhone,
          commissionerCin,
          commissionerAddress,
          commissionerCity: isWithComm ? (commissionerCity || 'Casablanca') : null,
          commissionAmount,
          commissionPaidById: commissionPaidById || null,
          status: 'CONFIRMED',
          notes: isWithComm ? undefined : 'Achat direct sans intermédiaire [SANS_COMMISSIONNAIRE]',
        },
      })

      if (commissionAmount > 0) {
        await prisma.vehicle.update({
          where: { id: vehicleId },
          data: { targetSalePrice: { increment: commissionAmount } },
        })
      }
    } else {
      const oldCommission = purchase.commissionAmount || 0
      const delta = commissionAmount - oldCommission

      await prisma.purchase.update({
        where: { id: purchase.id },
        data: {
          ...(newPurchasePrice && newPurchasePrice > 0 ? { purchasePrice: newPurchasePrice } : {}),
          supplierName: supplierName.trim() || null,
          supplierPhone,
          supplierCin,
          supplierAddress,
          supplierCity: supplierCity || 'Casablanca',
          handledById: handledById || null,
          paymentMethod,
          hasCommissioner: isWithComm,
          commissionerName,
          commissionerPhone,
          commissionerCin,
          commissionerAddress,
          commissionerCity: isWithComm ? (commissionerCity || 'Casablanca') : null,
          commissionAmount,
          commissionPaidById: commissionPaidById || null,
          notes: isWithComm ? purchase.notes : 'Achat direct sans intermédiaire [SANS_COMMISSIONNAIRE]',
        },
      })

      if (delta !== 0) {
        await prisma.vehicle.update({
          where: { id: vehicleId },
          data: { targetSalePrice: { increment: delta } },
        })
      }
    }

    revalidatePath(`/vehicles`)
    revalidatePath(`/vehicles/${vehicleId}`)

    redirect(`/vehicles/${vehicleId}?tab=acquisition&success=${encodeURIComponent('Dossier d\'achat, informations du véhicule et acteurs mis à jour avec succès.')}`)
  } catch (error: unknown) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : 'Erreur lors de l\'enregistrement des informations.'
    redirect(`/vehicles/${vehicleId}?tab=acquisition&error=${encodeURIComponent(message)}`)
  }
}

export async function updateRepairAction(vehicleId: string, formData: FormData) {
  try {
    const repairId = (formData.get('repairId') as string) || ''
    const repairType = (formData.get('repairType') as string) || undefined
    const garageName = (formData.get('garageName') as string) || undefined
    const estimatedAmountRaw = formData.get('estimatedAmount') as string
    const estimatedAmount = estimatedAmountRaw ? parseFloat(estimatedAmountRaw) : undefined
    const finalAmountRaw = formData.get('finalAmount') as string
    const finalAmount = finalAmountRaw ? parseFloat(finalAmountRaw) : undefined
    const description = (formData.get('description') as string) || undefined
    const notes = (formData.get('notes') as string) || undefined

    if (!repairId) {
      redirect(`/vehicles/${vehicleId}?tab=repairs&error=${encodeURIComponent('Identifiant d\'intervention manquant.')}`)
    }

    await repairService.updateRepair(repairId, {
      repairType,
      garageName,
      estimatedAmount,
      finalAmount,
      description,
      notes,
    })

    revalidatePath(`/vehicles/${vehicleId}`)
    revalidatePath('/vehicles')
    redirect(`/vehicles/${vehicleId}?tab=repairs&success=${encodeURIComponent('Intervention mise à jour avec succès.')}`)
  } catch (error: unknown) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : 'Erreur lors de la mise à jour de l\'intervention.'
    redirect(`/vehicles/${vehicleId}?tab=repairs&error=${encodeURIComponent(message)}`)
  }
}

export async function updateVehicleFullAction(vehicleId: string, formData: FormData) {
  try {
    const brand = (formData.get('brand') as string) || ''
    const model = (formData.get('model') as string) || ''
    const version = (formData.get('version') as string) || null
    const customsStatus = (formData.get('customsStatus') as 'MAROC' | 'DEDOUANEE') || 'MAROC'
    const customsYearRaw = formData.get('customsYear') as string
    const customsYear = customsStatus === 'DEDOUANEE' && customsYearRaw ? parseInt(customsYearRaw, 10) : null
    const colorExterior = (formData.get('colorExterior') as string) || 'Gris Métallisé'
    const colorInterior = (formData.get('colorInterior') as string) || null
    const parkId = (formData.get('parkId') as string) || null
    const matricule = (formData.get('matricule') as string) || null
    const vin = (formData.get('vin') as string) || ''
    const mileage = parseInt(formData.get('mileage') as string, 10) || 0
    const year = parseInt(formData.get('year') as string, 10) || new Date().getFullYear()
    const rawFuel = formData.get('fuelType') as string
    const fuelType: FuelType = vehicleFuelTypes.includes(rawFuel as FuelType) ? (rawFuel as FuelType) : 'DIESEL'
    const rawTrans = formData.get('transmission') as string
    const transmission: TransmissionType = vehicleTransmissions.includes(rawTrans as TransmissionType)
      ? (rawTrans as TransmissionType)
      : 'AUTOMATIQUE'
    const rawBody = formData.get('bodyType') as string
    const bodyType: BodyType = vehicleBodyTypes.includes(rawBody as BodyType) ? (rawBody as BodyType) : 'SUV'
    const purchasePrice = parseFloat(formData.get('purchasePrice') as string) || 0
    const targetSalePrice = parseFloat(formData.get('targetSalePrice') as string) || 0
    const description = (formData.get('description') as string) || null

    if (!brand.trim() || !model.trim()) {
      throw new Error('La marque et le modèle du véhicule sont obligatoires')
    }

    // Determine location name from park if parkId is set
    let location = 'Casablanca Showroom'
    if (parkId) {
      const park = await prisma.park.findUnique({ where: { id: parkId } })
      if (park) {
        location = `${park.city} — ${park.name}`
      }
    }

    await vehicleService.updateVehicle(vehicleId, {
      brand: brand.trim(),
      model: model.trim(),
      version: version ? version.trim() : null,
      customsStatus,
      customsYear,
      colorExterior: colorExterior.trim(),
      colorInterior: colorInterior ? colorInterior.trim() : null,
      parkId,
      location,
      matricule: matricule ? matricule.trim() : null,
      vin: vin.trim().toUpperCase(),
      mileage,
      year,
      fuelType,
      transmission,
      bodyType,
      purchasePrice,
      targetSalePrice,
      description,
    })

    revalidatePath('/vehicles')
    revalidatePath(`/vehicles/${vehicleId}`)
    revalidatePath('/stock')
    revalidatePath('/parks')

    redirect(`/vehicles/${vehicleId}?success=${encodeURIComponent('Fiche technique et informations du véhicule mises à jour avec succès.')}`)
  } catch (error: unknown) {
    if (isRedirectError(error)) throw error
    const message = error instanceof Error ? error.message : 'Erreur lors de la mise à jour de la fiche véhicule.'
    redirect(`/vehicles/${vehicleId}?action=edit-vehicle&error=${encodeURIComponent(message)}`)
  }
}


