import prisma from '@/lib/db'
import { repairRepository } from '@/repositories/repair.repository'
import { vehicleRepository } from '@/repositories/vehicle.repository'
import { vehicleStateMachine } from './vehicle-state-machine.service'
import { auditService } from './audit.service'
import { financialService } from './financial.service'
import { RepairCreateInput, RepairCompleteInput } from '@/validation/repair.schema'

export const repairService = {
  async listRepairs(params: { status?: string; vehicleId?: string; search?: string } = {}) {
    return repairRepository.getAll(params)
  },

  async getRepairDetails(id: string) {
    return repairRepository.getById(id)
  },

  async getActiveRepairs() {
    return repairRepository.getActiveRepairs()
  },

  async createRepair(input: RepairCreateInput, userId?: string) {
    await vehicleStateMachine.expireDueReservations()

    const vehicle = await vehicleRepository.getById(input.vehicleId)
    if (!vehicle) {
      throw new Error('Véhicule introuvable')
    }

    if (vehicle.status !== 'IN_STOCK' && vehicle.status !== 'SOLD') {
      throw new Error(
        `Le véhicule n'est pas disponible pour réparation (Statut actuel: ${vehicle.status})`
      )
    }

    const count = await prisma.repair.count()
    const code =
      input.code ||
      `REP-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`

    // Create Repair record
    const repair = await repairRepository.create({
      code,
      vehicle: { connect: { id: input.vehicleId } },
      repairType: input.repairType,
      description: input.description || null,
      garageName: input.garageName || null,
      startedAt: input.startedAt || new Date(),
      estimatedAmount: input.estimatedAmount || null,
      finalAmount: null,
      ...(input.paidById ? { paidBy: { connect: { id: input.paidById } } } : {}),
      status: 'EN_COURS',
      notes: input.notes || null,
    })

    // Transition vehicle to WORKSHOP status only if IN_STOCK (sold vehicles remain SOLD during pre-delivery prep)
    if (vehicle.status === 'IN_STOCK') {
      await vehicleStateMachine.transitionVehicleStatus(
        input.vehicleId,
        'WORKSHOP',
        `Envoi en réparation: ${repair.code}`,
        userId,
        { excludeRepairId: repair.id }
      )
    }

    await auditService.log({
      action: 'REPAIR_CREATED',
      entityType: 'Repair',
      entityId: repair.id,
      details: `Création de la réparation ${repair.code} pour véhicule ${vehicle.brand} ${vehicle.model} (${repair.repairType})`,
      userId,
    })

    return repair
  },

  async completeRepair(id: string, input: RepairCompleteInput, userId?: string) {
    const existing = await repairRepository.getById(id)
    if (!existing) {
      throw new Error('Réparation introuvable')
    }

    if (existing.status !== 'EN_COURS') {
      throw new Error(
        `Impossible de clôturer une réparation avec le statut ${existing.status}`
      )
    }

    const updated = await repairRepository.update(id, {
      finalAmount: input.finalAmount,
      ...(input.paidById ? { paidBy: { connect: { id: input.paidById } } } : {}),
      completedAt: input.completedAt || new Date(),
      status: 'TERMINEE',
      notes: input.notes !== undefined ? input.notes : existing.notes,
    })

    // Transition vehicle back to IN_STOCK only if currently in WORKSHOP
    const vehicle = await prisma.vehicle.findUnique({ where: { id: existing.vehicleId } })
    if (vehicle?.status === 'WORKSHOP') {
      await vehicleStateMachine.transitionVehicleStatus(
        existing.vehicleId,
        'IN_STOCK',
        `Réparation terminée: ${existing.code}`,
        userId
      )
    }

    await auditService.log({
      action: 'REPAIR_COMPLETED',
      entityType: 'Repair',
      entityId: updated.id,
      details: `Clôture de la réparation ${updated.code} (Montant final: ${financialService.formatMAD(updated.finalAmount)})`,
      userId,
    })

    return updated
  },

  async cancelRepair(id: string, userId?: string) {
    const existing = await repairRepository.getById(id)
    if (!existing) {
      throw new Error('Réparation introuvable')
    }

    if (existing.status !== 'EN_COURS') {
      throw new Error(
        `Impossible d'annuler une réparation avec le statut ${existing.status}`
      )
    }

    const updated = await repairRepository.update(id, {
      status: 'ANNULEE',
    })

    // Release vehicle back to IN_STOCK only if currently in WORKSHOP
    const vehicle = await prisma.vehicle.findUnique({ where: { id: existing.vehicleId } })
    if (vehicle?.status === 'WORKSHOP') {
      await vehicleStateMachine.transitionVehicleStatus(
        existing.vehicleId,
        'IN_STOCK',
        `Annulation de la réparation: ${existing.code}`,
        userId
      )
    }

    await auditService.log({
      action: 'REPAIR_CANCELLED',
      entityType: 'Repair',
      entityId: id,
      details: `Annulation de la réparation ${existing.code}`,
      userId,
    })

    return updated
  },
}
