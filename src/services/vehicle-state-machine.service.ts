import prisma from '@/lib/db'
import { canTransitionVehicleStatus, VehicleStatus } from '@/domain/vehicle'
import { auditService } from './audit.service'

export const vehicleStateMachine = {
  /**
   * Automatically expires reservations whose expiryDate is in the past.
   * Restores vehicle status to IN_STOCK if it was RESERVED.
   * Safe to call preemptively before availability-sensitive operations.
   */
  async expireDueReservations(): Promise<number> {
    const now = new Date()

    const expiredReservations = await prisma.reservation.findMany({
      where: {
        status: 'ACTIVE',
        expiryDate: { lte: now },
      },
      include: {
        vehicle: true,
      },
    })

    if (expiredReservations.length === 0) {
      return 0
    }

    for (const res of expiredReservations) {
      await prisma.$transaction(async (tx) => {
        // Mark reservation as expired
        await tx.reservation.update({
          where: { id: res.id },
          data: { status: 'EXPIREE' },
        })

        // If the vehicle is currently RESERVED, revert to IN_STOCK
        if (res.vehicle && res.vehicle.status === 'RESERVED') {
          await tx.vehicle.update({
            where: { id: res.vehicleId },
            data: { status: 'IN_STOCK' },
          })

          await tx.vehicleStatusHistory.create({
            data: {
              vehicleId: res.vehicleId,
              oldStatus: 'RESERVED',
              newStatus: 'IN_STOCK',
              reason: `Expiration automatique de la réservation ${res.code}`,
              changedBy: 'SYSTEM',
            },
          })
        }
      })

      await auditService.log({
        action: 'RESERVATION_EXPIRED',
        entityType: 'Reservation',
        entityId: res.id,
        details: `Réservation ${res.code} expirée automatiquement. Véhicule remis en stock.`,
      })
    }

    return expiredReservations.length
  },

  /**
   * Authority for all vehicle status transitions.
   * Enforces business invariants and creates status history audit trail.
   */
  async transitionVehicleStatus(
    vehicleId: string,
    toStatus: VehicleStatus,
    reason?: string,
    userId?: string
  ): Promise<void> {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    })

    if (!vehicle) {
      throw new Error('Véhicule introuvable')
    }

    const currentStatus = vehicle.status as VehicleStatus

    if (currentStatus === toStatus) {
      return
    }

    // Verify allowed transition
    if (!canTransitionVehicleStatus(currentStatus, toStatus)) {
      throw new Error(
        `Transition de statut non autorisée de ${currentStatus} vers ${toStatus}`
      )
    }

    // Invariant checks
    if (toStatus === 'RESERVED') {
      await this.expireDueReservations()

      const activeRes = await prisma.reservation.findFirst({
        where: {
          vehicleId,
          status: 'ACTIVE',
        },
      })

      if (activeRes) {
        throw new Error(
          `Ce véhicule a déjà une réservation active (${activeRes.code})`
        )
      }
    }

    if (toStatus === 'WORKSHOP') {
      const activeRepair = await prisma.repair.findFirst({
        where: {
          vehicleId,
          status: 'EN_COURS',
        },
      })

      if (activeRepair) {
        throw new Error(
          `Ce véhicule a déjà une réparation en cours (${activeRepair.code})`
        )
      }
    }

    // Apply status change and record history
    await prisma.$transaction(async (tx) => {
      await tx.vehicle.update({
        where: { id: vehicleId },
        data: { status: toStatus },
      })

      await tx.vehicleStatusHistory.create({
        data: {
          vehicleId,
          oldStatus: currentStatus,
          newStatus: toStatus,
          reason: reason || `Transition vers ${toStatus}`,
          changedBy: userId || 'SYSTEM',
        },
      })
    })

    await auditService.log({
      action: 'VEHICLE_STATUS_CHANGED',
      entityType: 'Vehicle',
      entityId: vehicleId,
      details: `Statut changé de ${currentStatus} à ${toStatus}${reason ? ` (${reason})` : ''}`,
      userId,
    })
  },
}

export const expireDueReservations = vehicleStateMachine.expireDueReservations.bind(vehicleStateMachine)
export const transitionVehicleStatus = vehicleStateMachine.transitionVehicleStatus.bind(vehicleStateMachine)
