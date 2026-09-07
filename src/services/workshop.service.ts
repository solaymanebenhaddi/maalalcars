import { workshopRepository } from '@/repositories/workshop.repository'
import { vehicleRepository } from '@/repositories/vehicle.repository'
import { auditService } from './audit.service'
import { financialService } from './financial.service'
import { calculateWorkshopTotals } from '@/domain/workshop'
import { WorkshopOrderCreateInput, WorkshopOrderUpdateInput } from '@/validation/workshop.schema'
import prisma from '@/lib/db'

export const workshopService = {
  async listOrders(params: { status?: string; priority?: string; search?: string } = {}) {
    return workshopRepository.getAll(params)
  },

  async getOrderDetails(id: string) {
    return workshopRepository.getById(id)
  },

  async createOrder(input: WorkshopOrderCreateInput, userId?: string) {
    const count = await prisma.workshopOrder.count()
    const code = input.code || `OT-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`

    const totals = calculateWorkshopTotals(input.partsCostHT, input.laborCostHT, input.taxRate)

    const order = await workshopRepository.create({
      code,
      vehicle: { connect: { id: input.vehicleId } },
      ...(input.clientId ? { client: { connect: { id: input.clientId } } } : {}),
      ...(input.technicianId ? { technician: { connect: { id: input.technicianId } } } : {}),
      serviceType: input.serviceType,
      priority: input.priority,
      status: input.status,
      scheduledDate: input.scheduledDate,
      completedDate: input.completedDate || null,
      partsCostHT: input.partsCostHT,
      laborCostHT: input.laborCostHT,
      taxRate: input.taxRate,
      totalTTC: totals.totalTTC,
      notes: input.notes || null,
      partsList: input.partsList || null,
    })

    // Optionally update vehicle status to WORKSHOP if IN_STOCK
    const vehicle = await vehicleRepository.getById(input.vehicleId)
    if (vehicle && vehicle.status === 'IN_STOCK') {
      await vehicleRepository.update(vehicle.id, { status: 'WORKSHOP' })
    }

    await auditService.log({
      action: 'WORKSHOP_ORDER_CREATED',
      entityType: 'WorkshopOrder',
      entityId: order.id,
      details: `Ordre de travail ${order.code} (${order.serviceType}) pour ${financialService.formatMAD(order.totalTTC)}`,
      userId,
    })

    return order
  },

  async updateOrder(id: string, input: WorkshopOrderUpdateInput, userId?: string) {
    const existing = await workshopRepository.getById(id)
    if (!existing) throw new Error('Ordre de travail introuvable')

    let totalTTC = existing.totalTTC
    if (input.partsCostHT !== undefined || input.laborCostHT !== undefined || input.taxRate !== undefined) {
      const parts = input.partsCostHT !== undefined ? input.partsCostHT : existing.partsCostHT
      const labor = input.laborCostHT !== undefined ? input.laborCostHT : existing.laborCostHT
      const rate = input.taxRate !== undefined ? input.taxRate : existing.taxRate
      const totals = calculateWorkshopTotals(parts, labor, rate)
      totalTTC = totals.totalTTC
    }

    const updated = await workshopRepository.update(id, {
      ...input,
      totalTTC,
    })

    // If completed, check if vehicle can be restored to IN_STOCK
    if (input.status === 'COMPLETED' && existing.vehicle?.status === 'WORKSHOP' && existing.vehicleId) {
      await vehicleRepository.update(existing.vehicleId, { status: 'IN_STOCK' })
    }

    await auditService.log({
      action: 'WORKSHOP_ORDER_UPDATED',
      entityType: 'WorkshopOrder',
      entityId: updated.id,
      details: `Mise à jour de l'ordre ${updated.code} (Statut: ${updated.status})`,
      userId,
    })

    return updated
  },
}
