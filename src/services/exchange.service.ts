import prisma from '@/lib/db'
import { auditService } from './audit.service'
import { exchangeRepository } from '@/repositories/exchange.repository'
import {
  toMinorUnits,
  fromMinorUnits,
  validateExchangeFinancials,
  SoulteDirection,
} from '@/domain/vehicle'

export interface ExecuteExchangeInput {
  outgoingVehicleId: string
  outgoingVehicleValueDH: number
  incomingVehicleValueDH: number
  direction: SoulteDirection
  soulteAmountDH: number
  soultePaymentMethod?: string | null
  handledById?: string | null
  notes?: string | null

  // Incoming vehicle details
  incomingVehicle: {
    brand: string
    model: string
    version?: string | null
    year: number
    vin: string
    matricule?: string | null
    fuelType: string
    transmission: string
    mileage: number
    colorExterior: string
    colorInterior?: string | null
    bodyType?: string
    fiscalPower?: number
    customsStatus?: string
    customsYear?: number | null
    parkId?: string | null
    location?: string
    targetSalePrice?: number
    description?: string | null
    photos?: Array<{ url: string; isPrimary: boolean; order: number }>
    documentIds?: string[]
  }

  // Supplier snapshot
  supplier?: {
    supplierName?: string | null
    supplierPhone?: string | null
    supplierCin?: string | null
    supplierAddress?: string | null
    supplierCity?: string | null
  }

  userId?: string
  actorName?: string
}

export const exchangeService = {
  /**
   * Validates and executes an atomic Reprise / Échange transaction.
   * Enforces mathematical consistency, vehicle eligibility, relational integrity,
   * audit logging, and stock transition.
   */
  async executeExchange(input: ExecuteExchangeInput) {
    const {
      outgoingVehicleId,
      outgoingVehicleValueDH,
      incomingVehicleValueDH,
      direction,
      soulteAmountDH,
      soultePaymentMethod,
      handledById,
      notes,
      incomingVehicle,
      supplier,
      userId,
      actorName = 'Admin Maalal',
    } = input

    // 1. Validate mathematical consistency
    const financialCheck = validateExchangeFinancials({
      incomingVehicleValueDH,
      outgoingVehicleValueDH,
      direction,
      soulteAmountDH: direction === 'NONE' ? 0 : soulteAmountDH,
    })

    if (!financialCheck.isValid) {
      throw new Error(financialCheck.errorMessage || 'Incohérence financière dans le calcul de la reprise.')
    }

    // 2. Pre-transaction validation of outgoing vehicle eligibility
    const outgoing = await prisma.vehicle.findUnique({
      where: { id: outgoingVehicleId },
      include: {
        reservations: { where: { status: 'ACTIVE' } },
        repairs: { where: { status: 'EN_COURS' } },
        exchangeAsOutgoing: true,
      },
    })

    if (!outgoing) {
      throw new Error("Le véhicule sélectionné pour l'échange est introuvable.")
    }

    if (outgoing.status !== 'IN_STOCK' || outgoing.archivedAt !== null) {
      throw new Error(
        `Le véhicule cédé (${outgoing.brand} ${outgoing.model}) n'est pas disponible en stock (statut actuel: ${outgoing.status}). Seuls les véhicules 'En Stock' peuvent faire l'objet d'une reprise.`
      )
    }

    if (outgoing.reservations.length > 0) {
      throw new Error(
        `Le véhicule ${outgoing.brand} ${outgoing.model} a une réservation active (${outgoing.reservations[0].code}) et ne peut pas être cédé en reprise.`
      )
    }

    if (outgoing.repairs.length > 0) {
      throw new Error(
        `Le véhicule ${outgoing.brand} ${outgoing.model} a une réparation en cours (${outgoing.repairs[0].code}) et ne peut pas être cédé en reprise.`
      )
    }

    if (outgoing.exchangeAsOutgoing) {
      throw new Error(
        `Le véhicule ${outgoing.brand} ${outgoing.model} a déjà été cédé lors d'un échange précédent.`
      )
    }

    // Resolve park location if parkId is set
    let location = incomingVehicle.location || 'Casablanca Showroom'
    if (incomingVehicle.parkId) {
      const park = await prisma.park.findUnique({ where: { id: incomingVehicle.parkId } })
      if (park) location = park.name
    }

    // 3. Execute atomic transaction
    const result = await prisma.$transaction(async (tx) => {
      // A. Generate unique codes
      const vehicleCount = await tx.vehicle.count()
      const vehicleCode = `V-${new Date().getFullYear()}-${String(vehicleCount + 1).padStart(4, '0')}`

      const purchaseCount = await tx.purchase.count()
      const purchaseCode = `ACH-${new Date().getFullYear()}-${String(purchaseCount + 1).padStart(4, '0')}`

      const exchangeCount = await tx.vehicleExchange.count()
      const exchangeCode = `ECH-${new Date().getFullYear()}-${String(exchangeCount + 1).padStart(4, '0')}`

      // B. Create incoming vehicle in stock
      const photos = incomingVehicle.photos || []
      const newVehicle = await tx.vehicle.create({
        data: {
          code: vehicleCode,
          brand: incomingVehicle.brand,
          model: incomingVehicle.model,
          version: incomingVehicle.version || null,
          year: incomingVehicle.year,
          vin: incomingVehicle.vin.toUpperCase(),
          matricule: incomingVehicle.matricule || null,
          fuelType: incomingVehicle.fuelType,
          transmission: incomingVehicle.transmission,
          mileage: incomingVehicle.mileage,
          colorExterior: incomingVehicle.colorExterior,
          colorInterior: incomingVehicle.colorInterior || null,
          bodyType: incomingVehicle.bodyType || 'SUV',
          fiscalPower: incomingVehicle.fiscalPower || 8,
          customsStatus: incomingVehicle.customsStatus || 'MAROC',
          customsYear: incomingVehicle.customsStatus === 'DEDOUANEE' ? (incomingVehicle.customsYear || null) : null,
          parkId: incomingVehicle.parkId || null,
          location,
          purchasePrice: incomingVehicleValueDH,
          targetSalePrice: incomingVehicle.targetSalePrice || incomingVehicleValueDH,
          description: incomingVehicle.description || null,
          status: 'IN_STOCK',
          archivedAt: null,
          ...(photos.length > 0
            ? {
                photos: {
                  create: photos.slice(0, 10).map((p, idx) => ({
                    url: p.url,
                    isPrimary: Boolean(p.isPrimary),
                    category: 'EXTERIEUR',
                    order: typeof p.order === 'number' ? p.order : idx,
                  })),
                },
              }
            : {}),
        },
      })

      // C. Create Purchase dossier for incoming vehicle
      const purchase = await tx.purchase.create({
        data: {
          code: purchaseCode,
          vehicleId: newVehicle.id,
          purchasePrice: incomingVehicleValueDH,
          paymentMethod: 'REPRISE',
          status: 'CONFIRMED',
          supplierName: supplier?.supplierName || null,
          supplierPhone: supplier?.supplierPhone || null,
          supplierCin: supplier?.supplierCin || null,
          supplierAddress: supplier?.supplierAddress || null,
          supplierCity: supplier?.supplierCity || 'Casablanca',
          handledById: handledById || null,
          notes: notes
            ? `Acquisition par reprise/échange contre ${outgoing.brand} ${outgoing.model} (${outgoing.code}). ${notes}`
            : `Acquisition par reprise/échange contre ${outgoing.brand} ${outgoing.model} (${outgoing.code})`,
        },
      })

      // D. Create VehicleExchange relational record (storing integer minor units)
      const exchange = await tx.vehicleExchange.create({
        data: {
          code: exchangeCode,
          incomingVehicleId: newVehicle.id,
          outgoingVehicleId: outgoing.id,
          incomingVehicleValue: toMinorUnits(incomingVehicleValueDH),
          outgoingVehicleValue: toMinorUnits(outgoingVehicleValueDH),
          cashAdjustmentDirection: direction,
          cashAdjustmentAmount: direction === 'NONE' ? 0 : toMinorUnits(soulteAmountDH),
          paymentMethod: direction !== 'NONE' ? (soultePaymentMethod || null) : null,
          handledById: handledById || null,
          supplierName: supplier?.supplierName || null,
          supplierPhone: supplier?.supplierPhone || null,
          supplierCin: supplier?.supplierCin || null,
          supplierAddress: supplier?.supplierAddress || null,
          supplierCity: supplier?.supplierCity || 'Casablanca',
          notes: notes || null,
        },
      })

      // E. Transition outgoing vehicle to ECHANGE and ARCHIVE
      const updatedOutgoing = await tx.vehicle.update({
        where: { id: outgoing.id },
        data: {
          status: 'ECHANGE',
          archivedAt: new Date(),
        },
      })

      // F. Status history for outgoing vehicle
      await tx.vehicleStatusHistory.create({
        data: {
          vehicleId: outgoing.id,
          oldStatus: 'IN_STOCK',
          newStatus: 'ECHANGE',
          reason: `Sorti du parc par reprise / échange contre ${newVehicle.brand} ${newVehicle.model} (${newVehicle.code})`,
          changedBy: actorName,
        },
      })

      // G. Status history for incoming vehicle
      await tx.vehicleStatusHistory.create({
        data: {
          vehicleId: newVehicle.id,
          oldStatus: null,
          newStatus: 'IN_STOCK',
          reason: `Entrée en stock par reprise / échange contre ${outgoing.brand} ${outgoing.model} (${outgoing.code})`,
          changedBy: actorName,
        },
      })

      // H. Create archive record for outgoing vehicle
      await tx.archiveRecord.create({
        data: {
          entityType: 'Vehicle',
          entityId: outgoing.id,
          entityCode: outgoing.code,
          summary: `${outgoing.brand} ${outgoing.model} ${outgoing.year} (${outgoing.matricule || outgoing.vin}) - Échangé contre ${newVehicle.brand} ${newVehicle.model}`,
          archivedReason: 'REPRISE',
          archivedBy: actorName,
          dataSnapshot: JSON.stringify(outgoing),
        },
      })

      // I. Associate any uploaded documents with incoming vehicle and purchase
      if (incomingVehicle.documentIds && incomingVehicle.documentIds.length > 0) {
        await tx.document.updateMany({
          where: { id: { in: incomingVehicle.documentIds } },
          data: {
            vehicleId: newVehicle.id,
            purchaseId: purchase.id,
          },
        })
      }

      return {
        incomingVehicle: newVehicle,
        outgoingVehicle: updatedOutgoing,
        exchange,
        purchase,
      }
    })

    // 4. Create meaningful audit entries
    const directionLabel =
      direction === 'COMPANY_TO_SUPPLIER'
        ? 'Versée au fournisseur par MAALAL CARS'
        : direction === 'SUPPLIER_TO_COMPANY'
        ? 'Versée par le fournisseur à MAALAL CARS'
        : 'Aucune soulte (échange équilibré)'

    const soulteText =
      direction !== 'NONE' ? `${soulteAmountDH.toLocaleString('fr-MA')} DH (${directionLabel})` : '0 DH'

    // Audit for incoming vehicle
    await auditService.log({
      action: 'VEHICLE_ACQUIRED_BY_REPRISE',
      entityType: 'Vehicle',
      entityId: result.incomingVehicle.id,
      details: `Véhicule acquis par reprise : ${result.incomingVehicle.brand} ${result.incomingVehicle.model} (${result.incomingVehicle.code}). Véhicule cédé en échange : ${outgoing.brand} ${outgoing.model} (${outgoing.code}, valeur ${outgoingVehicleValueDH.toLocaleString('fr-MA')} DH). Soulte : ${soulteText}. Enregistré par ${actorName}.`,
      userId: handledById || userId,
    })

    // Audit for outgoing vehicle
    await auditService.log({
      action: 'VEHICLE_EXITED_BY_REPRISE',
      entityType: 'Vehicle',
      entityId: outgoing.id,
      details: `Véhicule sorti du parc par reprise : ${outgoing.brand} ${outgoing.model} (${outgoing.code}). Échangé contre : ${result.incomingVehicle.brand} ${result.incomingVehicle.model} (${result.incomingVehicle.code}, valeur ${incomingVehicleValueDH.toLocaleString('fr-MA')} DH). Valeur de reprise : ${outgoingVehicleValueDH.toLocaleString('fr-MA')} DH. Soulte : ${soulteText}. Date: ${new Date().toLocaleDateString('fr-MA')}.`,
      userId: handledById || userId,
    })

    return result
  },

  /**
   * Retrieves exchange details associated with a vehicle (either as incoming or outgoing).
   */
  async getExchangeForVehicle(vehicleId: string) {
    const asIncoming = await exchangeRepository.getByIncomingVehicleId(vehicleId)
    if (asIncoming) {
      return {
        type: 'INCOMING' as const,
        exchange: {
          ...asIncoming,
          incomingVehicleValueDH: fromMinorUnits(asIncoming.incomingVehicleValue),
          outgoingVehicleValueDH: fromMinorUnits(asIncoming.outgoingVehicleValue),
          cashAdjustmentAmountDH: fromMinorUnits(asIncoming.cashAdjustmentAmount),
        },
      }
    }

    const asOutgoing = await exchangeRepository.getByOutgoingVehicleId(vehicleId)
    if (asOutgoing) {
      return {
        type: 'OUTGOING' as const,
        exchange: {
          ...asOutgoing,
          incomingVehicleValueDH: fromMinorUnits(asOutgoing.incomingVehicleValue),
          outgoingVehicleValueDH: fromMinorUnits(asOutgoing.outgoingVehicleValue),
          cashAdjustmentAmountDH: fromMinorUnits(asOutgoing.cashAdjustmentAmount),
        },
      }
    }

    return null
  },
}
