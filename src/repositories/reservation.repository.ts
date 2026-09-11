import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

export const reservationRepository = {
  async getAll(params: { status?: string; search?: string } = {}) {
    const where: Prisma.ReservationWhereInput = {}

    if (params.status && params.status !== 'Tous') {
      where.status = params.status
    }

    if (params.search) {
      where.OR = [
        { code: { contains: params.search } },
        { clientName: { contains: params.search } },
        { clientPhone: { contains: params.search } },
        { clientCin: { contains: params.search } },
        { vehicle: { brand: { contains: params.search } } },
        { vehicle: { model: { contains: params.search } } },
        { contact: { firstName: { contains: params.search } } },
        { contact: { lastName: { contains: params.search } } },
      ]
    }

    return prisma.reservation.findMany({
      where,
      include: {
        vehicle: { include: { photos: { orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }] } } },
        contact: true,
        convertedSale: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getById(id: string) {
    return prisma.reservation.findUnique({
      where: { id },
      include: {
        vehicle: {
          include: {
            photos: { orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }] },
            expenses: true,
          },
        },
        contact: true,
        convertedSale: true,
      },
    })
  },

  async getExpiringSoon(days = 3) {
    const now = new Date()
    const threshold = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)

    return prisma.reservation.findMany({
      where: {
        status: 'ACTIVE',
        expiryDate: {
          gte: now,
          lte: threshold,
        },
      },
      include: {
        vehicle: {
          include: { photos: { orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }] } },
        },
        contact: true,
      },
      orderBy: { expiryDate: 'asc' },
    })
  },

  async getActiveReservations() {
    return prisma.reservation.findMany({
      where: { status: 'ACTIVE' },
      include: {
        vehicle: { include: { photos: { orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }] } } },
        contact: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  async countActive() {
    return prisma.reservation.count({
      where: { status: 'ACTIVE' },
    })
  },

  async create(data: Prisma.ReservationCreateInput) {
    return prisma.reservation.create({
      data,
      include: {
        vehicle: true,
        contact: true,
      },
    })
  },

  async update(id: string, data: Prisma.ReservationUpdateInput) {
    return prisma.reservation.update({
      where: { id },
      data,
      include: {
        vehicle: true,
        contact: true,
      },
    })
  },
}
