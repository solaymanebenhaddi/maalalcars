import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

export const documentRepository = {
  async getAll(params: { category?: string; status?: string; search?: string } = {}) {
    const where: Prisma.DocumentWhereInput = {}

    if (params.category && params.category !== 'Toutes') {
      where.category = params.category
    }

    if (params.status && params.status !== 'Tous') {
      where.status = params.status
    }

    if (params.search) {
      where.OR = [
        { code: { contains: params.search } },
        { title: { contains: params.search } },
        { type: { contains: params.search } },
        { vehicle: { brand: { contains: params.search } } },
        { contact: { lastName: { contains: params.search } } },
      ]
    }

    return prisma.document.findMany({
      where,
      include: {
        vehicle: true,
        contact: true,
        sale: true,
        purchase: true,
      },
      orderBy: { issueDate: 'desc' },
    })
  },

  async getById(id: string) {
    return prisma.document.findUnique({
      where: { id },
      include: {
        vehicle: true,
        contact: true,
        sale: true,
        purchase: true,
      },
    })
  },

  async create(data: Prisma.DocumentCreateInput) {
    return prisma.document.create({
      data,
    })
  },

  async update(id: string, data: Prisma.DocumentUpdateInput) {
    return prisma.document.update({
      where: { id },
      data,
    })
  },

  async delete(id: string) {
    return prisma.document.delete({
      where: { id },
    })
  },
}
