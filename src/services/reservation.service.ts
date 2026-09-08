import prisma from '@/lib/db'
import { reservationRepository } from '@/repositories/reservation.repository'
import { vehicleRepository } from '@/repositories/vehicle.repository'
import { vehicleStateMachine } from './vehicle-state-machine.service'
import { auditService } from './audit.service'
import { financialService } from './financial.service'
import { ReservationCreateInput, ReservationUpdateInput } from '@/validation/reservation.schema'

export const reservationService = {
  async listReservations(params: { status?: string; search?: string } = {}) {
    await vehicleStateMachine.expireDueReservations()
    return reservationRepository.getAll(params)
  },

  async getReservationDetails(id: string) {
    await vehicleStateMachine.expireDueReservations()
    return reservationRepository.getById(id)
  },

  async getExpiringSoon(days = 3) {
    await vehicleStateMachine.expireDueReservations()
    return reservationRepository.getExpiringSoon(days)
  },

  async createReservation(input: ReservationCreateInput, userId?: string) {
    await vehicleStateMachine.expireDueReservations()

    const vehicle = await vehicleRepository.getById(input.vehicleId)
    if (!vehicle) {
      throw new Error('Véhicule introuvable')
    }

    if (vehicle.status !== 'IN_STOCK') {
      throw new Error(
        `Le véhicule n'est pas disponible pour réservation (Statut actuel: ${vehicle.status})`
      )
    }

    const count = await prisma.reservation.count()
    const code =
      input.code ||
      `RES-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`

    const reservation = await reservationRepository.create({
      code,
      vehicle: { connect: { id: input.vehicleId } },
      ...(input.contactId ? { contact: { connect: { id: input.contactId } } } : {}),
      clientName: input.clientName || null,
      clientPhone: input.clientPhone || null,
      clientCin: input.clientCin || null,
      clientAddress: input.clientAddress || null,
      depositAmount: input.depositAmount || 0,
      paymentMethod: input.paymentMethod,
      startDate: input.startDate,
      expiryDate: input.expiryDate,
      salespersonName: input.salespersonName || null,
      status: input.status || 'ACTIVE',
      notes: input.notes || null,
    })

    // Lock vehicle to RESERVED status via state machine
    await vehicleStateMachine.transitionVehicleStatus(
      input.vehicleId,
      'RESERVED',
      `Réservation client: ${reservation.code}`,
      userId,
      { excludeReservationId: reservation.id }
    )

    await auditService.log({
      action: 'RESERVATION_CREATED',
      entityType: 'Reservation',
      entityId: reservation.id,
      details: `Réservation ${reservation.code} créée pour ${reservation.clientName || 'Client'} (Acompte: ${financialService.formatMAD(reservation.depositAmount)})`,
      userId,
    })

    return reservation
  },

  async updateReservation(id: string, input: ReservationUpdateInput, userId?: string) {
    const updated = await reservationRepository.update(id, input)

    await auditService.log({
      action: 'RESERVATION_UPDATED',
      entityType: 'Reservation',
      entityId: updated.id,
      details: `Mise à jour de la réservation ${updated.code}`,
      userId,
    })

    return updated
  },

  async cancelReservation(id: string, userId?: string) {
    if (!id) {
      throw new Error('Identifiant de réservation manquant')
    }

    const reservation = await reservationRepository.getById(id)
    if (!reservation) {
      throw new Error('Réservation introuvable')
    }

    if (reservation.status === 'CANCELLED' || reservation.status === 'ANNULEE') {
      // Idempotent safe return if already cancelled
      return reservation
    }

    if (reservation.status === 'CONVERTED' || reservation.status === 'CONVERTIE_EN_VENTE') {
      throw new Error('Impossible d\'annuler une réservation déjà convertie en vente')
    }

    const updated = await reservationRepository.update(id, {
      status: 'ANNULEE',
    })

    // Release vehicle back to IN_STOCK
    await vehicleStateMachine.transitionVehicleStatus(
      reservation.vehicleId,
      'IN_STOCK',
      `Annulation de la réservation ${reservation.code}`,
      userId
    )

    await auditService.log({
      action: 'RESERVATION_CANCELLED',
      entityType: 'Reservation',
      entityId: id,
      details: `Annulation de la réservation ${reservation.code}. Véhicule remis en stock.`,
      userId,
    })

    return updated
  },

  async expireReservations(): Promise<number> {
    return vehicleStateMachine.expireDueReservations()
  },
}
