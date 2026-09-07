import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

export const invoiceRepository = {
  async getAll(params: { status?: string; search?: string } = {}) {
    const where: Prisma.InvoiceWhereInput = {}

    if (params.status && params.status !== 'Tous') {
      where.status = params.status
    }

    if (params.search) {
      where.OR = [
        { code: { contains: params.search } },
        { contact: { firstName: { contains: params.search } } },
        { contact: { lastName: { contains: params.search } } },
        { contact: { companyName: { contains: params.search } } },
        { contact: { ice: { contains: params.search } } },
      ]
    }

    return prisma.invoice.findMany({
      where,
      include: {
        contact: true,
        sale: { include: { vehicle: true } },
        lines: true,
        payments: true,
      },
      orderBy: { issueDate: 'desc' },
    })
  },

  async getById(id: string) {
    return prisma.invoice.findUnique({
      where: { id },
      include: {
        contact: true,
        sale: {
          include: {
            vehicle: true,
            commissioner: true,
            salesperson: true,
          },
        },
        lines: true,
        payments: { orderBy: { paymentDate: 'desc' } },
        regularizations: true,
      },
    })
  },

  async create(data: Prisma.InvoiceCreateInput) {
    return prisma.invoice.create({
      data,
      include: { lines: true },
    })
  },

  async update(id: string, data: Prisma.InvoiceUpdateInput) {
    return prisma.invoice.update({
      where: { id },
      data,
      include: { lines: true },
    })
  },
}
