import { saleRepository } from '@/repositories/sale.repository'
import { vehicleRepository } from '@/repositories/vehicle.repository'
import { vehicleStateMachine } from './vehicle-state-machine.service'
import { paymentService } from './payment.service'
import { auditService } from './audit.service'
import { financialService } from './financial.service'
import { canTransitionSaleStatus, SaleStatus } from '@/domain/sale'
import { SaleCreateInput, SaleUpdateInput } from '@/validation/sale.schema'
import { isSuperAdminRole } from '@/lib/auth-roles'
import prisma from '@/lib/db'

export const saleService = {
  async listSales(params: { status?: string; search?: string } = {}) {
    return saleRepository.getAll(params)
  },

  async getRecentSales(limit = 5) {
    return saleRepository.getRecentSales(limit)
  },

  async getSaleDetails(id: string) {
    const sale = await saleRepository.getById(id)
    if (!sale) return null

    const paymentsReceived = sale.payments.reduce((sum, p) => (p.status === 'PAID' ? sum + p.amount : sum), 0)
    const outstandingBalance = financialService.calculateOutstandingBalance({
      totalAmount: sale.salePrice,
      paymentsReceived,
    })

    const vehicleExpenses = sale.vehicle?.expenses?.reduce((sum, e) => sum + e.amountTTC, 0) || 0
    const totalCost = financialService.calculateTotalVehicleCost({
      purchasePrice: sale.vehicle?.purchasePrice || 0,
      expensesTotalTTC: vehicleExpenses,
      saleCommission: sale.commissionAmount,
    })

    const { netProfit, marginPercent } = financialService.calculateProfitAndMargin({
      salePrice: sale.salePrice,
      totalVehicleCost: totalCost,
    })

    return {
      ...sale,
      paymentsReceived,
      outstandingBalance,
      totalCost,
      netProfit,
      marginPercent,
    }
  },

  async createSale(input: SaleCreateInput, userId?: string) {
    await vehicleStateMachine.expireDueReservations()

    const vehicle = await vehicleRepository.getById(input.vehicleId)
    if (!vehicle) throw new Error('Véhicule introuvable')

    // Invariant: Cannot sell a vehicle in repair
    if (vehicle.status === 'WORKSHOP') {
      throw new Error('Impossible de vendre un véhicule actuellement en réparation. Veuillez clôturer la réparation d\'abord.')
    }

    // Invariant: A reserved vehicle must be converted via reservation
    if (vehicle.status === 'RESERVED' && !input.reservationId) {
      throw new Error('Ce véhicule est actuellement réservé. Veuillez utiliser "Convertir en vente" ou annuler la réservation d\'abord.')
    }

    if (vehicle.status !== 'IN_STOCK' && vehicle.status !== 'RESERVED') {
      throw new Error(`Impossible de vendre un véhicule avec le statut ${vehicle.status}`)
    }

    const count = await prisma.sale.count()
    const code = input.code || `VEN-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`

    // Create Sale record
    const sale = await saleRepository.create({
      code,
      saleDate: input.saleDate,
      vehicle: { connect: { id: input.vehicleId } },
      ...(input.buyerContactId ? { buyer: { connect: { id: input.buyerContactId } } } : {}),
      buyerName: input.buyerName || null,
      buyerPhone: input.buyerPhone || null,
      buyerCin: input.buyerCin || null,
      buyerAddress: input.buyerAddress || null,
      ...(input.commissionerId ? { commissioner: { connect: { id: input.commissionerId } } } : {}),
      commissionerName: input.commissionerName || null,
      commissionerPhone: input.commissionerPhone || null,
      commissionerCin: input.commissionerCin || null,
      commissionerAddress: input.commissionerAddress || null,
      ...(input.commissionPaidById ? { commissionPaidBy: { connect: { id: input.commissionPaidById } } } : {}),
      ...(input.salespersonId ? { salesperson: { connect: { id: input.salespersonId } } } : {}),
      ...(input.receivedById ? { receivedBy: { connect: { id: input.receivedById } } } : {}),
      reservationId: input.reservationId || null,
      advanceAmount: input.advanceAmount || 0,
      salePrice: input.salePrice,
      taxRate: input.taxRate,
      commissionAmount: input.commissionAmount,
      discountAmount: input.discountAmount,
      additionalFees: input.additionalFees,
      status: input.status,
      paymentMethod: input.paymentMethod,
      expectedDeliveryDate: input.expectedDeliveryDate || null,
      notes: input.notes || null,
    })

    // Financial truth: record payments internally using Payment model
    // 1. Advance carried forward from reservation
    if (input.advanceAmount && input.advanceAmount > 0) {
      await paymentService.createPayment(
        {
          type: 'INFLOW',
          amount: input.advanceAmount,
          paymentDate: input.saleDate || new Date(),
          paymentMethod: input.paymentMethod,
          saleId: sale.id,
          contactId: input.buyerContactId || undefined,
          status: 'PAID',
          notes: `Acompte réservation reporté sur vente ${sale.code}`,
        },
        userId
      )
    }

    // 2. Amount received at the point of sale
    if (input.amountReceivedAtSale && input.amountReceivedAtSale > 0) {
      let receiverName: string | null = null
      if (input.receivedById) {
        const receiverUser = await prisma.user.findUnique({
          where: { id: input.receivedById },
          select: { name: true },
        })
        receiverName = receiverUser?.name || null
      }

      await paymentService.createPayment(
        {
          type: 'INFLOW',
          amount: input.amountReceivedAtSale,
          paymentDate: input.saleDate || new Date(),
          paymentMethod: input.paymentMethod,
          receivedBy: receiverName,
          saleId: sale.id,
          contactId: input.buyerContactId || undefined,
          status: 'PAID',
          notes: `Règlement vente ${sale.code}`,
        },
        userId
      )
    }

    // Vehicle is sold: automatically archive vehicle and set status to ARCHIVED
    await vehicleRepository.archive(
      vehicle.id,
      `Vente confirmée: ${sale.code} (Client: ${sale.buyerName || 'Acheteur'})`
    )

    await prisma.vehicleStatusHistory.create({
      data: {
        vehicleId: vehicle.id,
        oldStatus: vehicle.status,
        newStatus: 'ARCHIVED',
        reason: `Vente effectuée et archivage automatique: ${sale.code}`,
        changedBy: userId || 'SYSTEM',
      },
    })

    // Store actual sale price on vehicle
    await prisma.vehicle.update({
      where: { id: vehicle.id },
      data: { actualSalePrice: input.salePrice },
    })

    // If converted from a reservation, update reservation status
    if (input.reservationId) {
      await prisma.reservation.update({
        where: { id: input.reservationId },
        data: {
          status: 'CONVERTIE_EN_VENTE',
          convertedSaleId: sale.id,
        },
      })
    }

    await auditService.log({
      action: 'SALE_CREATED',
      entityType: 'Sale',
      entityId: sale.id,
      details: `Vente ${sale.code} confirmée pour ${financialService.formatMAD(sale.salePrice)} (Client: ${sale.buyerName || 'Acheteur'})`,
      userId,
    })

    return sale
  },

  async updateSale(id: string, input: SaleUpdateInput, userId?: string) {
    const existing = await saleRepository.getById(id)
    if (!existing) throw new Error('Vente introuvable')

    if (input.status && input.status !== existing.status) {
      if (!canTransitionSaleStatus(existing.status as SaleStatus, input.status as SaleStatus)) {
        throw new Error(`Transition de statut de vente non autorisée de ${existing.status} vers ${input.status}`)
      }
    }

    const updated = await saleRepository.update(id, input)

    // If marked as DELIVERED, automatically archive the vehicle out of stock
    if (input.status === 'DELIVERED' && existing.vehicleId) {
      await vehicleRepository.archive(
        existing.vehicleId,
        `Vente ${existing.code} validée et livraison effectuée par le Super Admin`
      )
    }

    await auditService.log({
      action: 'SALE_UPDATED',
      entityType: 'Sale',
      entityId: updated.id,
      details: `Mise à jour de la vente ${updated.code}`,
      userId,
    })

    return updated
  },

  async validateSaleAndDeliver(saleId: string, userRole?: string | null, userId?: string) {
    if (!isSuperAdminRole(userRole)) {
      throw new Error('Seul le Super Admin est habilité à valider définitivement la vente et la livraison du véhicule.')
    }

    const sale = await saleRepository.getById(saleId)
    if (!sale) throw new Error('Vente introuvable')

    // 1. Clôture des réparations en cours sur ce véhicule
    await prisma.repair.updateMany({
      where: { vehicleId: sale.vehicleId, status: 'EN_COURS' },
      data: {
        status: 'TERMINEE',
        completedAt: new Date(),
        notes: 'Clôture automatique de la préparation lors de la validation finale et livraison par le Super Admin',
      },
    })

    // 2. Mise à jour du statut de la vente à DELIVERED
    const updatedSale = await saleRepository.update(sale.id, {
      status: 'DELIVERED',
    })

    // 3. Archivage automatique et immédiat du véhicule hors stock
    const archivedVehicle = await vehicleRepository.archive(
      sale.vehicleId,
      `Vente ${sale.code} validée et livraison finale effectuée par le Super Admin (Client: ${sale.buyerName || 'Acheteur'})`
    )

    // 4. Historique de statut véhicule
    await prisma.vehicleStatusHistory.create({
      data: {
        vehicleId: sale.vehicleId,
        oldStatus: sale.vehicle?.status || 'SOLD',
        newStatus: 'ARCHIVED',
        reason: `Validation finale de vente ${sale.code} et livraison client par le Super Admin`,
        changedBy: 'Super Admin',
      },
    })

    await auditService.log({
      action: 'SALE_SUPER_ADMIN_VALIDATED_AND_ARCHIVED',
      entityType: 'Sale',
      entityId: sale.id,
      details: `Validation finale vente ${sale.code} et archivage automatique véhicule ${sale.vehicle?.brand} ${sale.vehicle?.model} par le Super Admin`,
      userId,
    })

    return {
      sale: updatedSale,
      vehicle: archivedVehicle,
    }
  },
}
