import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

export const saleRepository = {
  async getAll(params: { status?: string; search?: string } = {}) {
    const where: Prisma.SaleWhereInput = {}

    if (params.status && params.status !== 'Tous') {
      where.status = params.status
    }

    if (params.search) {
      where.OR = [
        { code: { contains: params.search } },
        { buyerName: { contains: params.search } },
        { buyerPhone: { contains: params.search } },
        { buyerCin: { contains: params.search } },
        { buyer: { firstName: { contains: params.search } } },
        { buyer: { lastName: { contains: params.search } } },
        { vehicle: { brand: { contains: params.search } } },
        { vehicle: { model: { contains: params.search } } },
      ]
    }

    return prisma.sale.findMany({
      where,
      include: {
        vehicle: {
          include: {
            photos: { orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }] },
            expenses: true,
          },
        },
        buyer: true,
        commissioner: true,
        salesperson: true,
        receivedBy: true,
        payments: true,
        invoices: true,
        deliveries: true,
      },
      orderBy: { saleDate: 'desc' },
    })
  },

  async getRecentSales(limit = 5) {
    return prisma.sale.findMany({
      include: {
        vehicle: {
          include: {
            photos: { orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }] },
          },
        },
        buyer: true,
        salesperson: true,
        receivedBy: true,
        payments: true,
      },
      orderBy: { saleDate: 'desc' },
      take: limit,
    })
  },

  async countSales(params: { startDate?: Date; endDate?: Date } = {}) {
    const where: Prisma.SaleWhereInput = {}
    if (params.startDate || params.endDate) {
      where.saleDate = {}
      if (params.startDate) where.saleDate.gte = params.startDate
      if (params.endDate) where.saleDate.lte = params.endDate
    }
    return prisma.sale.count({ where })
  },

  async getById(id: string) {
    return prisma.sale.findFirst({
      where: {
        OR: [{ id }, { code: id }],
      },
      include: {
        vehicle: {
          include: {
            photos: { orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }] },
            expenses: { include: { category: true } },
            purchases: { include: { seller: true } },
            repairs: {
              include: { paidBy: true },
              orderBy: { startedAt: 'desc' },
            },
          },
        },
        buyer: true,
        commissioner: true,
        salesperson: true,
        receivedBy: true,
        commissionPaidBy: true,
        payments: { orderBy: { paymentDate: 'desc' } },
        invoices: { include: { lines: true } },
        deliveries: true,
        regularizations: true,
        documents: true,
      },
    })
  },

  async create(data: Prisma.SaleCreateInput) {
    return prisma.sale.create({
      data,
      include: {
        vehicle: true,
        buyer: true,
        payments: true,
      },
    })
  },

  async update(id: string, data: Prisma.SaleUpdateInput) {
    // Resolve sale by id or code
    const existing = await prisma.sale.findFirst({
      where: { OR: [{ id }, { code: id }] },
      select: { id: true },
    })
    const actualId = existing?.id || id

    return prisma.sale.update({
      where: { id: actualId },
      data,
      include: {
        vehicle: true,
        buyer: true,
        payments: true,
      },
    })
  },
}
