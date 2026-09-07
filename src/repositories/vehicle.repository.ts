import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

export interface VehicleFilterParams {
  brand?: string
  status?: string
  minPrice?: number
  maxPrice?: number
  fuelType?: string
  transmission?: string
  location?: string
  parkId?: string
  search?: string
}

export const vehicleRepository = {
  async getAll(params: VehicleFilterParams = {}) {
    const isArchivedQuery = params.status === 'ARCHIVED'
    const where: Prisma.VehicleWhereInput = isArchivedQuery
      ? { status: 'ARCHIVED' }
      : { archivedAt: null }

    if (params.brand && params.brand !== 'Toutes') {
      where.brand = params.brand
    }

    if (params.status && params.status !== 'Tous' && !isArchivedQuery) {
      where.status = params.status
    }

    if (params.fuelType && params.fuelType !== 'Tous') {
      where.fuelType = params.fuelType
    }

    if (params.transmission && params.transmission !== 'Toutes') {
      where.transmission = params.transmission
    }

    if (params.location && params.location !== 'Toutes') {
      where.location = params.location
    }

    if (params.parkId && params.parkId !== 'Tous') {
      where.parkId = params.parkId
    }

    if (params.search) {
      where.OR = [
        { brand: { contains: params.search } },
        { model: { contains: params.search } },
        { vin: { contains: params.search } },
        { matricule: { contains: params.search } },
        { code: { contains: params.search } },
      ]
    }

    if (params.minPrice || params.maxPrice) {
      where.targetSalePrice = {}
      if (params.minPrice) where.targetSalePrice.gte = params.minPrice
      if (params.maxPrice) where.targetSalePrice.lte = params.maxPrice
    }

    return prisma.vehicle.findMany({
      where,
      include: {
        park: true,
        photos: true,
        expenses: {
          include: { category: true },
        },
        purchases: {
          include: { seller: true, commissioner: true },
        },
        sales: {
          include: { buyer: true },
        },
        reservations: {
          include: { contact: true },
        },
        repairs: {
          orderBy: { createdAt: 'desc' },
        },
        documents: true,
        inspections: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { entryDate: 'desc' },
    })
  },

  async getById(id: string) {
    return prisma.vehicle.findUnique({
      where: { id },
      include: {
        park: true,
        photos: { orderBy: { order: 'asc' } },
        expenses: {
          include: { category: true },
          orderBy: { expenseDate: 'desc' },
        },
        purchases: {
          include: { seller: true, commissioner: true, handledBy: true, commissionPaidBy: true },
        },
        sales: {
          include: { buyer: true, commissioner: true, salesperson: true, payments: true, invoices: true, commissionPaidBy: true, receivedBy: true },
        },
        reservations: {
          include: { contact: true },
          orderBy: { createdAt: 'desc' },
        },
        documents: { orderBy: { issueDate: 'desc' } },
        inspections: { orderBy: { inspectionDate: 'desc' } },
        workshopOrders: {
          include: { technician: true },
          orderBy: { scheduledDate: 'desc' },
        },
        repairs: {
          include: { paidBy: true },
          orderBy: { startedAt: 'desc' },
        },
        warranties: true,
        insurances: true,
        registrations: true,
        listings: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  },

  async create(data: Prisma.VehicleCreateInput) {
    return prisma.vehicle.create({
      data,
    })
  },

  async update(id: string, data: Prisma.VehicleUpdateInput) {
    return prisma.vehicle.update({
      where: { id },
      data,
    })
  },

  async countByStatus() {
    const inStock = await prisma.vehicle.count({ where: { status: 'IN_STOCK', archivedAt: null } })
    const reserved = await prisma.vehicle.count({ where: { status: 'RESERVED', archivedAt: null } })
    const sold = await prisma.vehicle.count({ where: { status: 'SOLD', archivedAt: null } })
    const workshop = await prisma.vehicle.count({ where: { status: 'WORKSHOP', archivedAt: null } })
    const archived = await prisma.vehicle.count({ where: { status: 'ARCHIVED' } })
    const total = inStock + reserved + sold + workshop

    return { total, inStock, reserved, sold, workshop, archived }
  },

  async getStockAging() {
    const now = new Date()
    const vehicles = await prisma.vehicle.findMany({
      where: { status: { in: ['IN_STOCK', 'RESERVED'] }, archivedAt: null },
      include: { photos: true, expenses: true },
      orderBy: { entryDate: 'asc' },
    })

    type VehicleWithExpenses = (typeof vehicles)[number] & {
      ageDays: number
      totalCost: number
    }

    const buckets = {
      under30: [] as VehicleWithExpenses[],
      between31and60: [] as VehicleWithExpenses[],
      between61and90: [] as VehicleWithExpenses[],
      over90: [] as VehicleWithExpenses[],
    }

    let totalStockValue = 0

    for (const v of vehicles) {
      const diffTime = Math.abs(now.getTime() - new Date(v.entryDate).getTime())
      const ageDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const totalCost = v.purchasePrice + v.expenses.reduce((acc, e) => acc + e.amountTTC, 0)
      totalStockValue += totalCost

      const vehicleWithAge = { ...v, ageDays, totalCost }

      if (ageDays <= 30) buckets.under30.push(vehicleWithAge)
      else if (ageDays <= 60) buckets.between31and60.push(vehicleWithAge)
      else if (ageDays <= 90) buckets.between61and90.push(vehicleWithAge)
      else buckets.over90.push(vehicleWithAge)
    }

    return {
      vehicles,
      buckets,
      totalCount: vehicles.length,
      totalStockValue,
    }
  },

  async archive(id: string, reason?: string) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id } })
    if (!vehicle) throw new Error('Véhicule introuvable')

    await prisma.archiveRecord.create({
      data: {
        entityType: 'Vehicle',
        entityId: vehicle.id,
        entityCode: vehicle.code,
        summary: `${vehicle.brand} ${vehicle.model} ${vehicle.year} (${vehicle.matricule || vehicle.vin})`,
        archivedReason: reason || 'Archivage manuel',
        dataSnapshot: JSON.stringify(vehicle),
      },
    })

    return prisma.vehicle.update({
      where: { id },
      data: {
        archivedAt: new Date(),
        status: 'ARCHIVED',
      },
    })
  },

  async restore(id: string, reason?: string) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id } })
    if (!vehicle) throw new Error('Véhicule introuvable')

    await prisma.archiveRecord.updateMany({
      where: { entityId: vehicle.id, entityType: 'Vehicle', restoredAt: null },
      data: { restoredAt: new Date() },
    })

    await prisma.vehicleStatusHistory.create({
      data: {
        vehicleId: vehicle.id,
        oldStatus: vehicle.status,
        newStatus: 'IN_STOCK',
        reason: reason || 'Véhicule restauré des archives par le Super Admin',
        changedBy: 'Super Admin',
      },
    })

    return prisma.vehicle.update({
      where: { id },
      data: {
        archivedAt: null,
        status: 'IN_STOCK',
      },
    })
  },
}
