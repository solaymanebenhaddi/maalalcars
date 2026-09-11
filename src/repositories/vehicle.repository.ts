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
  customsStatus?: string
  urgent?: boolean | string
  page?: number
  pageSize?: number
}

export function buildVehicleWhere(params: VehicleFilterParams = {}): Prisma.VehicleWhereInput {
  const isArchivedQuery = params.status === 'ARCHIVED'
  const andConditions: Prisma.VehicleWhereInput[] = []

  if (isArchivedQuery) {
    andConditions.push({
      OR: [
        { status: 'ARCHIVED' },
        { archivedAt: { not: null } },
        { status: 'SOLD' },
      ],
    })
  } else {
    // Strictly hide archived & sold vehicles from general inventory and "Tous"
    andConditions.push({
      status: { notIn: ['ARCHIVED', 'SOLD'] },
      archivedAt: null,
    })

    if (params.status && params.status !== 'Tous') {
      andConditions.push({ status: params.status })
    }
  }

  if (params.brand && params.brand !== 'Toutes') {
    andConditions.push({ brand: params.brand })
  }

  if (params.fuelType && params.fuelType !== 'Tous') {
    andConditions.push({ fuelType: params.fuelType })
  }

  if (params.transmission && params.transmission !== 'Toutes') {
    andConditions.push({ transmission: params.transmission })
  }

  if (params.location && params.location !== 'Toutes') {
    andConditions.push({ location: params.location })
  }

  if (params.parkId && params.parkId !== 'Tous') {
    andConditions.push({ parkId: params.parkId })
  }

  if (params.customsStatus && params.customsStatus !== 'Tous') {
    andConditions.push({ customsStatus: params.customsStatus })
  }

  if (params.urgent === true || params.urgent === 'true') {
    andConditions.push({ isBulkImport: true })
  }

  if (params.search) {
    andConditions.push({
      OR: [
        { brand: { contains: params.search } },
        { model: { contains: params.search } },
        { vin: { contains: params.search } },
        { matricule: { contains: params.search } },
        { code: { contains: params.search } },
      ],
    })
  }

  if (params.minPrice || params.maxPrice) {
    const priceFilter: Prisma.FloatFilter = {}
    if (params.minPrice) priceFilter.gte = params.minPrice
    if (params.maxPrice) priceFilter.lte = params.maxPrice
    andConditions.push({ targetSalePrice: priceFilter })
  }

  return andConditions.length > 0 ? { AND: andConditions } : {}
}

export const vehicleRepository = {
  async getAll(params: VehicleFilterParams = {}) {
    const where = buildVehicleWhere(params)
    const skip =
      params.page && params.pageSize
        ? (Math.max(1, params.page) - 1) * params.pageSize
        : undefined
    const take = params.pageSize || undefined

    return prisma.vehicle.findMany({
      where,
      skip,
      take,
      include: {
        park: true,
        photos: { orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }] },
        expenses: {
          include: { category: true },
        },
        purchases: {
          include: { seller: true, commissioner: true, handledBy: true, commissionPaidBy: true, documents: true },
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

  async count(params: VehicleFilterParams = {}) {
    const where = buildVehicleWhere(params)
    return prisma.vehicle.count({ where })
  },

  async getPaginated(params: VehicleFilterParams = {}) {
    const page = Math.max(1, params.page || 1)
    const pageSize = params.pageSize || 9
    const [vehicles, total] = await Promise.all([
      this.getAll({ ...params, page, pageSize }),
      this.count(params),
    ])
    return {
      vehicles,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    }
  },

  async getById(id: string) {
    return prisma.vehicle.findUnique({
      where: { id },
      include: {
        park: true,
        photos: { orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }] },
        expenses: {
          include: { category: true },
          orderBy: { expenseDate: 'desc' },
        },
        purchases: {
          include: { seller: true, commissioner: true, handledBy: true, commissionPaidBy: true, documents: true },
        },
        sales: {
          include: { buyer: true, commissioner: true, salesperson: true, payments: true, invoices: true, commissionPaidBy: true, receivedBy: true, documents: true },
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
          include: { paidBy: true, documents: true },
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
    const workshop = await prisma.vehicle.count({ where: { status: 'WORKSHOP', archivedAt: null } })
    const archived = await prisma.vehicle.count({
      where: {
        OR: [
          { status: 'ARCHIVED' },
          { archivedAt: { not: null } },
          { status: 'SOLD' },
        ],
      },
    })
    // Total reflects all active stock vehicles currently in showroom or workshop
    const total = inStock + reserved + workshop

    return { total, inStock, reserved, sold: 0, workshop, archived }
  },

  async getStockAging() {
    const now = new Date()
    const vehicles = await prisma.vehicle.findMany({
      where: { status: { in: ['IN_STOCK', 'RESERVED'] }, archivedAt: null },
      include: {
        photos: { orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }] },
        expenses: true,
      },
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

  async delete(id: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        sales: { select: { id: true } },
        purchases: { select: { id: true } },
        repairs: { select: { id: true } },
      },
    })
    if (!vehicle) throw new Error('Véhicule introuvable')

    // If there are recorded financial/workshop transactions, soft-archive instead of hard deleting
    // to preserve accounting integrity and tax/audit compliance in Morocco
    if (vehicle.sales.length > 0 || vehicle.purchases.length > 0 || vehicle.repairs.length > 0) {
      await this.archive(id, 'Archivage automatique suite à une demande de suppression (transactions liées existantes)')
      return { id, deleted: false, archived: true }
    }

    // Clean up dependent transient records safely before deleting the vehicle
    await prisma.$transaction([
      prisma.reservation.deleteMany({ where: { vehicleId: id } }),
      prisma.vehicleInspection.deleteMany({ where: { vehicleId: id } }),
      prisma.vehicleStatusHistory.deleteMany({ where: { vehicleId: id } }),
      prisma.document.deleteMany({ where: { vehicleId: id } }),
      prisma.vehiclePhoto.deleteMany({ where: { vehicleId: id } }),
      prisma.expense.deleteMany({ where: { vehicleId: id } }),
      prisma.archiveRecord.deleteMany({ where: { entityId: id, entityType: 'Vehicle' } }),
      prisma.vehicle.delete({ where: { id } }),
    ])

    return { id, deleted: true, archived: false }
  },

  async deleteMany(ids: string[]) {
    const results = []
    for (const id of ids) {
      try {
        const res = await this.delete(id)
        results.push(res)
      } catch (err) {
        console.error(`Erreur lors de la suppression du véhicule ${id}:`, err)
      }
    }
    const deletedCount = results.filter((r) => r.deleted).length
    const archivedCount = results.filter((r) => r.archived).length
    return {
      total: ids.length,
      deletedCount,
      archivedCount,
      results,
    }
  },
}
