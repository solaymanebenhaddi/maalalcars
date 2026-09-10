import { vehicleRepository, VehicleFilterParams } from '@/repositories/vehicle.repository'
import { auditService } from './audit.service'
import { financialService } from './financial.service'
import { canTransitionVehicleStatus, VehicleStatus } from '@/domain/vehicle'
import { VehicleCreateInput, VehicleUpdateInput } from '@/validation/vehicle.schema'
import prisma from '@/lib/db'

import { isSuperAdminRole } from '@/lib/auth-roles'

export const vehicleService = {
  async listVehicles(params: VehicleFilterParams = {}) {
    return vehicleRepository.getAll(params)
  },

  async getVehicleDetails(id: string) {
    const vehicle = await vehicleRepository.getById(id)
    if (!vehicle) return null

    const expensesTotalTTC = vehicle.expenses.reduce((acc, e) => acc + e.amountTTC, 0)
    const totalCost = financialService.calculateTotalVehicleCost({
      purchasePrice: vehicle.purchasePrice,
      expensesTotalTTC,
    })

    const { netProfit, marginPercent } = financialService.calculateProfitAndMargin({
      salePrice: vehicle.actualSalePrice || vehicle.targetSalePrice,
      totalVehicleCost: totalCost,
    })

    return {
      ...vehicle,
      totalCost,
      netProfit,
      marginPercent,
    }
  },

  async createVehicle(input: VehicleCreateInput, userId?: string) {
    // Generate unique code if not provided
    const count = await prisma.vehicle.count()
    const code = input.code || `V-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`

    const vehicle = await vehicleRepository.create({
      code,
      vin: input.vin,
      matricule: input.matricule || null,
      brand: input.brand,
      model: input.model,
      version: input.version || null,
      bodyType: input.bodyType,
      year: input.year,
      colorExterior: input.colorExterior,
      colorInterior: input.colorInterior || null,
      fuelType: input.fuelType,
      transmission: input.transmission,
      mileage: input.mileage,
      doors: input.doors,
      seats: input.seats,
      fiscalPower: input.fiscalPower,
      options: input.options || null,
      location: input.location,
      purchasePrice: input.purchasePrice,
      targetSalePrice: input.targetSalePrice,
      minSalePrice: input.minSalePrice || null,
      description: input.description || null,
      status: input.status,
      customsStatus: input.customsStatus || 'MAROC',
      customsYear: input.customsStatus === 'DEDOUANEE' ? (input.customsYear || null) : null,
    })

    await auditService.log({
      action: 'VEHICLE_CREATED',
      entityType: 'Vehicle',
      entityId: vehicle.id,
      details: `Création du véhicule ${vehicle.brand} ${vehicle.model} (${vehicle.vin})`,
      userId,
    })

    return vehicle
  },

  async updateVehicle(id: string, input: VehicleUpdateInput, userId?: string) {
    const existing = await vehicleRepository.getById(id)
    if (!existing) throw new Error('Véhicule introuvable')

    if (input.status && input.status !== existing.status) {
      if (!canTransitionVehicleStatus(existing.status as VehicleStatus, input.status as VehicleStatus)) {
        throw new Error(`Transition de statut non autorisée de ${existing.status} vers ${input.status}`)
      }

      await prisma.vehicleStatusHistory.create({
        data: {
          vehicleId: id,
          oldStatus: existing.status,
          newStatus: input.status,
          changedBy: userId || 'SYSTEM',
        },
      })
    }

    const updated = await vehicleRepository.update(id, input)

    await auditService.log({
      action: 'VEHICLE_UPDATED',
      entityType: 'Vehicle',
      entityId: updated.id,
      details: `Mise à jour du véhicule ${updated.code}`,
      userId,
    })

    return updated
  },

  async getStockOverview() {
    const counts = await vehicleRepository.countByStatus()
    const aging = await vehicleRepository.getStockAging()

    return {
      counts,
      aging,
    }
  },

  async archiveVehicle(id: string, reason?: string, userId?: string) {
    const archived = await vehicleRepository.archive(id, reason)
    await auditService.log({
      action: 'VEHICLE_ARCHIVED',
      entityType: 'Vehicle',
      entityId: id,
      details: `Archivage: ${reason || 'Manuel'}`,
      userId,
    })
    return archived
  },

  async restoreVehicle(id: string, userRole?: string | null, userId?: string, reason?: string) {
    if (!isSuperAdminRole(userRole)) {
      throw new Error('Seul le Super Admin est autorisé à restaurer un véhicule des archives.')
    }

    const restored = await vehicleRepository.restore(id, reason)
    await auditService.log({
      action: 'VEHICLE_RESTORED',
      entityType: 'Vehicle',
      entityId: id,
      details: `Restauration par le Super Admin: ${reason || 'Remis en stock'}`,
      userId,
    })
    return restored
  },
}
