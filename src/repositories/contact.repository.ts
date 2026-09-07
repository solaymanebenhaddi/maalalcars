import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

export interface ContactFilterParams {
  role?: string
  segment?: string
  status?: string
  search?: string
  city?: string
}

export const contactRepository = {
  async getAll(params: ContactFilterParams = {}) {
    const where: Prisma.ContactWhereInput = {
      archivedAt: null,
    }

    if (params.role && params.role !== 'ALL' && params.role !== 'Tous') {
      where.role = params.role
    }

    if (params.segment && params.segment !== 'Tous') {
      where.segment = params.segment
    }

    if (params.status && params.status !== 'Tous') {
      where.status = params.status
    }

    if (params.city && params.city !== 'Toutes') {
      where.city = params.city
    }

    if (params.search) {
      where.OR = [
        { firstName: { contains: params.search } },
        { lastName: { contains: params.search } },
        { companyName: { contains: params.search } },
        { phone: { contains: params.search } },
        { email: { contains: params.search } },
        { code: { contains: params.search } },
        { cin: { contains: params.search } },
        { ice: { contains: params.search } },
      ]
    }

    return prisma.contact.findMany({
      where,
      include: {
        salesAsBuyer: {
          include: { vehicle: true, payments: true },
        },
        purchasesAsSeller: {
          include: { vehicle: true },
        },
        purchasesAsSupplier: {
          include: { vehicle: true },
        },
        purchasesAsCommissioner: true,
        salesAsCommissioner: true,
        payments: true,
        invoices: true,
        documents: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getById(id: string) {
    return prisma.contact.findUnique({
      where: { id },
      include: {
        salesAsBuyer: {
          include: { vehicle: true, payments: true, invoices: true },
          orderBy: { saleDate: 'desc' },
        },
        purchasesAsSeller: {
          include: { vehicle: true, payments: true },
          orderBy: { purchaseDate: 'desc' },
        },
        purchasesAsSupplier: {
          include: { vehicle: true },
          orderBy: { purchaseDate: 'desc' },
        },
        salesAsCommissioner: {
          include: { vehicle: true, buyer: true },
          orderBy: { saleDate: 'desc' },
        },
        purchasesAsCommissioner: {
          include: { vehicle: true },
        },
        reservations: {
          include: { vehicle: true },
        },
        payments: {
          orderBy: { paymentDate: 'desc' },
        },
        invoices: {
          include: { lines: true },
          orderBy: { issueDate: 'desc' },
        },
        contracts: true,
        documents: true,
        workshopOrders: {
          include: { vehicle: true },
        },
        appointments: true,
        communications: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  },

  async create(data: Prisma.ContactCreateInput) {
    return prisma.contact.create({
      data,
    })
  },

  async update(id: string, data: Prisma.ContactUpdateInput) {
    return prisma.contact.update({
      where: { id },
      data,
    })
  },
}
