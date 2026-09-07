import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

export const workshopRepository = {
  async getAll(params: { status?: string; priority?: string; search?: string } = {}) {
    const where: Prisma.WorkshopOrderWhereInput = {}

    if (params.status && params.status !== 'Tous') {
      where.status = params.status
    }

    if (params.priority && params.priority !== 'Toutes') {
      where.priority = params.priority
    }

    if (params.search) {
      where.OR = [
        { code: { contains: params.search } },
        { serviceType: { contains: params.search } },
        { vehicle: { brand: { contains: params.search } } },
        { vehicle: { model: { contains: params.search } } },
        { technician: { name: { contains: params.search } } },
      ]
    }

    return prisma.workshopOrder.findMany({
      where,
      include: {
        vehicle: true,
        client: true,
        technician: true,
      },
      orderBy: { scheduledDate: 'desc' },
    })
  },

  async getById(id: string) {
    return prisma.workshopOrder.findUnique({
      where: { id },
      include: {
        vehicle: {
          include: { photos: true, inspections: true },
        },
        client: true,
        technician: true,
      },
    })
  },

  async create(data: Prisma.WorkshopOrderCreateInput) {
    return prisma.workshopOrder.create({
      data,
    })
  },

  async update(id: string, data: Prisma.WorkshopOrderUpdateInput) {
    return prisma.workshopOrder.update({
      where: { id },
      data,
    })
  },
}
