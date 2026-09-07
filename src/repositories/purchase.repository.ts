import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

export const purchaseRepository = {
  async getAll(params: { status?: string; search?: string } = {}) {
    const where: Prisma.PurchaseWhereInput = {}

    if (params.status && params.status !== 'Tous') {
      where.status = params.status
    }

    if (params.search) {
      where.OR = [
        { code: { contains: params.search } },
        { invoiceNumber: { contains: params.search } },
        { vehicle: { brand: { contains: params.search } } },
        { vehicle: { model: { contains: params.search } } },
        { seller: { lastName: { contains: params.search } } },
        { supplier: { companyName: { contains: params.search } } },
      ]
    }

    return prisma.purchase.findMany({
      where,
      include: {
        vehicle: true,
        seller: true,
        supplier: true,
        commissioner: true,
        handledBy: true,
        payments: true,
        documents: true,
      },
      orderBy: { purchaseDate: 'desc' },
    })
  },

  async getById(id: string) {
    return prisma.purchase.findUnique({
      where: { id },
      include: {
        vehicle: {
          include: { photos: true, expenses: true },
        },
        seller: true,
        supplier: true,
        commissioner: true,
        handledBy: true,
        payments: { orderBy: { paymentDate: 'desc' } },
        documents: true,
      },
    })
  },

  async create(data: Prisma.PurchaseCreateInput) {
    return prisma.purchase.create({
      data,
    })
  },

  async update(id: string, data: Prisma.PurchaseUpdateInput) {
    return prisma.purchase.update({
      where: { id },
      data,
    })
  },
}
