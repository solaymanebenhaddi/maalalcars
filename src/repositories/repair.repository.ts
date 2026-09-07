import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

export const repairRepository = {
  async getAll(params: { status?: string; vehicleId?: string; search?: string } = {}) {
    const where: Prisma.RepairWhereInput = {}

    if (params.status && params.status !== 'Tous') {
      where.status = params.status
    }

    if (params.vehicleId) {
      where.vehicleId = params.vehicleId
    }

    if (params.search) {
      where.OR = [
        { code: { contains: params.search } },
        { garageName: { contains: params.search } },
        { description: { contains: params.search } },
        { vehicle: { brand: { contains: params.search } } },
        { vehicle: { model: { contains: params.search } } },
      ]
    }

    return prisma.repair.findMany({
      where,
      include: {
        vehicle: {
          include: {
            photos: true,
          },
        },
        paidBy: true,
      },
      orderBy: { startedAt: 'desc' },
    })
  },

  async getById(id: string) {
    return prisma.repair.findUnique({
      where: { id },
      include: {
        vehicle: {
          include: {
            photos: true,
            expenses: true,
          },
        },
        paidBy: true,
      },
    })
  },

  async getActiveRepairs() {
    return prisma.repair.findMany({
      where: { status: 'EN_COURS' },
      include: {
        vehicle: {
          include: {
            photos: true,
          },
        },
        paidBy: true,
      },
      orderBy: { startedAt: 'desc' },
    })
  },

  async countActive() {
    return prisma.repair.count({
      where: { status: 'EN_COURS' },
    })
  },

  async create(data: Prisma.RepairCreateInput) {
    return prisma.repair.create({
      data,
      include: {
        vehicle: true,
        paidBy: true,
      },
    })
  },

  async update(id: string, data: Prisma.RepairUpdateInput) {
    return prisma.repair.update({
      where: { id },
      data,
      include: {
        vehicle: true,
        paidBy: true,
      },
    })
  },
}
