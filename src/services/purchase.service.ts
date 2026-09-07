import { purchaseRepository } from '@/repositories/purchase.repository'
import { vehicleRepository } from '@/repositories/vehicle.repository'
import { auditService } from './audit.service'
import { financialService } from './financial.service'
import { PurchaseCreateInput, PurchaseUpdateInput } from '@/validation/purchase.schema'
import prisma from '@/lib/db'

export const purchaseService = {
  async listPurchases(params: { status?: string; search?: string } = {}) {
    return purchaseRepository.getAll(params)
  },

  async getPurchaseDetails(id: string) {
    return purchaseRepository.getById(id)
  },

  async createPurchase(input: PurchaseCreateInput, userId?: string) {
    const count = await prisma.purchase.count()
    const code = input.code || `ACH-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`

    const purchase = await purchaseRepository.create({
      code,
      purchaseDate: input.purchaseDate,
      vehicle: { connect: { id: input.vehicleId } },
      ...(input.sellerContactId ? { seller: { connect: { id: input.sellerContactId } } } : {}),
      ...(input.supplierContactId ? { supplier: { connect: { id: input.supplierContactId } } } : {}),
      ...(input.commissionerId ? { commissioner: { connect: { id: input.commissionerId } } } : {}),
      ...(input.handledById ? { handledBy: { connect: { id: input.handledById } } } : {}),
      purchasePrice: input.purchasePrice,
      commissionAmount: input.commissionAmount,
      paymentMethod: input.paymentMethod,
      status: input.status,
      invoiceNumber: input.invoiceNumber || null,
      notes: input.notes || null,
    })

    // Update vehicle purchase price
    await vehicleRepository.update(input.vehicleId, {
      purchasePrice: input.purchasePrice,
    })

    await auditService.log({
      action: 'PURCHASE_CREATED',
      entityType: 'Purchase',
      entityId: purchase.id,
      details: `Achat ${purchase.code} enregistré pour ${financialService.formatMAD(purchase.purchasePrice)}`,
      userId,
    })

    return purchase
  },

  async updatePurchase(id: string, input: PurchaseUpdateInput, userId?: string) {
    const updated = await purchaseRepository.update(id, input)

    await auditService.log({
      action: 'PURCHASE_UPDATED',
      entityType: 'Purchase',
      entityId: updated.id,
      details: `Mise à jour de l'achat ${updated.code}`,
      userId,
    })

    return updated
  },
}
